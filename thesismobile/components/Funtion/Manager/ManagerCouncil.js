import React, { useContext, useState, memo, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator, TouchableWithoutFeedback, Keyboard, RefreshControl, ScrollView, Alert, TextInput } from "react-native";
import { Icon, Modal, Searchbar, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { MyUserContext } from "../../../configs/Contexts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StyleStudy from "../Study/StyleStudy";
import ManagerStudyStyle from "./ManagerStudyStyle";
import ListStudyStyle from "../Study/ListStudyStyle";
import ManagerCouncilStyle from "./ManagerCouncilStyle";
import CouncilStyle from "../Council/CouncilStyle"
import CriteriaStyle from "../Criterias/Style";
import APIs, { endpoints, authApi } from "../../../configs/APIs";
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';

const MenuCouncil = () => {
    const [thesisData, setThesisData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const nav = useNavigation();
    const user = useContext(MyUserContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [councilMembers, setCouncilMembers] = useState([]);
    const [selectedThesis, setSelectedThesis] = useState(null);
    const [isMenu, setisMenu] = useState(false);
    const [isPost, setisPost] = useState(false);
    const [isDel, setisDel] = useState(false);
    const [deleteCode, setDeleteCode] = useState("");
    const [memberToDelete, setMemberToDelete] = useState(null);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [newPosition, setNewPosition] = useState('');
    const [editPositionVisible, setEditPositionVisible] = useState(false);
    const [selectedCouncilName, setSelectedCouncilName] = useState('');
    const [selectedCouncilDescription, setSelectedCouncilDescription] = useState('');

    const handleChange = (fieldName, value) => {
        setFormData({ ...formData, [fieldName]: value });
    };

    const fetchThesisData = async (page, query) => {
        if (page > 0) {
            let url = `${endpoints['councils']}?q=${query}&page=${page}`;
            try {
                setLoading(true);
                let res = await APIs.get(url);
                if (page === 1)
                    setThesisData(res.data.results);
                else if (page > 1)
                    setThesisData(current => [...current, ...res.data.results]);
                if (res.data.next === null)
                    setCurrentPage(0);
            } catch (ex) {
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchThesisData(currentPage, searchQuery);
    }, [currentPage, searchQuery]);

    const handleBack = () => {
        nav.navigate('BottomNavigator');
    };

    const loadMore = ({ nativeEvent }) => {
        if (!loading && isCloseToBottom(nativeEvent)) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 1;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    };

    const search = (value) => {
        setCurrentPage(1);
        setSearchQuery(value);
    };

    const toggleLock = async (item) => {
        const updatedLockState = !item.is_lock;
        try {
            const url = `${endpoints['councils']}${item.id}/update_lock/`;
            await APIs.post(url, { is_lock: updatedLockState });
            setThesisData((prevData) =>
                prevData.map((thesis) =>
                    thesis.id === item.id ? { ...thesis, is_lock: updatedLockState } : thesis
                )
            );
        } catch (error) {
            Alert.alert("Lỗi", "Không thể tải tài nguyên");
        }
    };

    const stripHtmlTags = (text) => {
        return text.replace(/<\/?[^>]+(>|$)/g, "");
    };

    const handleViewDetails = async (item) => {
        setSelectedThesis(item);
        setModalVisible(true);
        setModalLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await authApi(token).get(endpoints['council-members'](item.id));
            setCouncilMembers(response.data);
            const membersWithId = response.data.map(member => ({
                ...member,
                councilId: item.id
            }));
            setCouncilMembers(membersWithId);
        } catch (error) {
            Alert.alert("Lỗi", "Không thể tải tài nguyên");
        } finally {
            setModalLoading(false);
        }

    };

    const RenderItem = memo(({ item }) => (
        <View style={ManagerCouncilStyle.item} key={item.id}>
            <Text style={StyleStudy.itemText}>Mã hội đồng: {item.id}</Text>
            <Text style={StyleStudy.itemText}>Tên: {item.name}</Text>
            <Text style={StyleStudy.itemText}>Mô tả: {stripHtmlTags(item.description)}</Text>
            <View style={ManagerStudyStyle.buttonDetail}>
                <Button
                    icon={item.is_lock ? "lock" : "lock-open"}
                    mode="contained"
                    onPress={() => toggleLock(item)}
                    style={ManagerCouncilStyle.closeButton}
                >
                    {item.is_lock ? "Unlock" : "Lock"}
                </Button>
                <View style={{ flexDirection: 'row', }}>
                    <Button mode="contained" style={ListStudyStyle.ButtonCouncilDetail} onPress={() => handleViewDetails(item)}>
                        Thành viên
                    </Button>
                    <Button mode="contained" style={ListStudyStyle.ButtonCouncilDetail} onPress={() => handleViewTheses(item)}>
                        DS khóa luận
                    </Button>
                </View>
            </View>
        </View>
    ));



    const [formData, setFormData] = useState({
        id: "",
        name: "",
        description: "",
        is_Lock: "",
    });

    const [members, setMembers] = useState([
        { lecturer_id: "", position_id: 1 },
        { lecturer_id: "", position_id: 2 },
        { lecturer_id: "", position_id: 3 }
    ]);
    
    const handleMemberChange = (index, name, value) => {
        const newMembers = [...members];
        newMembers[index][name] = value;
        setMembers(newMembers);
    };

    const handleSubmit = async () => {
        if (!formData.name) {
            Alert.alert("Lỗi", "Vui lòng nhập mã khóa luận");
            return;
        }
    
        setLoading(true);
    
        let councilId = null;
    
        try {
            const councilData = {
                name: formData.name,
                description: formData.description,
                is_Lock: formData.is_Lock,
            };
    
            const councilFormData = new FormData();
            councilFormData.append('name', councilData.name);
            councilFormData.append('description', councilData.description);
            councilFormData.append('is_lock', councilData.is_Lock);
    
            const res = await APIs.post(endpoints['councils'], councilFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
    
            councilId = res.data.id;
    
            for (const member of members) {
                const memberFormData = new FormData();
                memberFormData.append('lecturer', member.lecturer_id);
                memberFormData.append('council', councilId);
                memberFormData.append('position', member.position_id);
    
                await APIs.post(endpoints['council_details'], memberFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-CSRFToken': 'LxGlGW539zpgT1OAzXIzW6GmxyHKK2Bl2sKYmispivUORsp7PLNV9xJFgTCUqqB7',
                    }
                });
            }
    
            Alert.alert("Thành công", "Hội đồng và thành viên đã được thêm thành công");
            setFormData({ name: "", description: "", is_Lock: "" });
            setMembers([
                { lecturer_id: "", position_id: 1 },
                { lecturer_id: "", position_id: 2 },
                { lecturer_id: "", position_id: 3 }
            ]);
            setisPost(false);
            setisMenu(!isMenu);
    
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.code) {
                Alert.alert("Lỗi", "Mã hội đồng này đã tồn tại",);
            } else {
                Alert.alert("Lỗi", `${JSON.stringify(error.response.data).replace(/[{}"]/g, '')}`);
            }
    
            if (councilId) {
                await deleteCouncil(councilId, false);
            }
    
        } finally {
            setLoading(false);
        }
    };
    
    
    const deleteCouncil = async (id,  showAlert = true) => {
        try {
            const url = `${endpoints['councils']}${id}/`;
            await APIs.delete(url, {
                headers: {
                    'X-CSRFToken': 'Wyr6DbQsggagMgMu48H8RlnkBhBHjQFX50ne8zXpBcDOB4fDYd5Yoaphc8zUNHgm'
                }
            });
            if(showAlert){
                Alert.alert("Thành công", "Hội đồng đã được xóa thành công");
            }
            setDeleteCode("");
        } catch (error) {
            if (error.response && error.response.status === 404) {
                Alert.alert(
                    "Lỗi",
                    "Mã hội đồng này không tồn tại",
                );
            } else {
                Alert.alert(
                    "Lỗi",
                    "Đã xảy ra lỗi khi xóa hội đồng",
                );
            }
        }
    };
    
    const handleDelete = () => {
        if (!deleteCode) {
            Alert.alert("Lỗi", "Vui lòng nhập mã hội đồng cần xóa");
            return;
        }
        deleteCouncil(deleteCode);
        setisDel(false);
        setisMenu(!isMenu);
    };
    const [editModalVisible, setEditModalVisible] = useState(false);

    const updateThesis = async (thesisData) => {
        try {
            const url = `${endpoints['councils']}${thesisData.id}/`;
            const formData = new FormData();
            formData.append('id', thesisData.id);
            formData.append('name', thesisData.name);
            formData.append('description', thesisData.description);

            const res = await APIs.patch(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            Alert.alert("Thành công", "Khóa luận đã được cập nhật thành công");
            setEditModalVisible(false);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    Alert.alert("Lỗi", "Mã khóa luận không tồn tại");
                } else {
                    Alert.alert("Lỗi", `Đã xảy ra lỗi khi cập nhật khóa luận: ${JSON.stringify(error.response.data)}`);
                }
            } else {
                Alert.alert("Lỗi", "Đã xảy ra lỗi khi cập nhật khóa luận");
            }
        }
    };

    const handleEditChange = (fieldName, value) => {
        setSelectedThesis({ ...selectedThesis, [fieldName]: value });
    };

    const handleEditUpdate = () => {
       
        updateThesis(selectedThesis);
    };
    

    const [isPostMem, setisPostMem] = useState(false);

    const [formDataMem, setFormDataMem] = useState([
        { lecturer_id: "", position_id: "" }
    ]);
    const [councilId, setCouncilId] = useState("");
    

    const addMembers = async (members) => {
        try {
            for (const member of members) {
                const formData = new FormData();
                formData.append('lecturer', member.lecturer_id);
                formData.append('council', member.council_id);
                formData.append('position', member.position_id);
        
                const res = await APIs.post(endpoints['council_details'], formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-CSRFToken': 'LxGlGW539zpgT1OAzXIzW6GmxyHKK2Bl2sKYmispivUORsp7PLNV9xJFgTCUqqB7',
                    }
                });
        
            }
        
            Alert.alert("Thành công", "Tất cả thành viên đã được thêm thành công");
            setFormDataMem([{ lecturer_id: "", position_id: "" }]);
            setCouncilId("");
        } catch (error) {
                Alert.alert("Lỗi", `${JSON.stringify(error.response.data).replace(/[{}"]/g, '')}`);
        }
    };
        
        
    const handleMemberSubmit = () => {
        if (!councilId) {
            Alert.alert("Lỗi", "Vui lòng chọn mã hội đồng");
            return;
        }
        
        const validMembers = formDataMem.filter(({ lecturer_id, position_id }) =>
            lecturer_id && position_id
        );
        
        if (validMembers.length === 0) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin cho ít nhất một thành viên");
            return;
        }
        
        const membersWithCouncil = validMembers.map(member => ({
            ...member,
            council_id: councilId
        }));
        
        addMembers(membersWithCouncil);
        setisPostMem(false);
        setisMenu(!isMenu);
    };
        
        
        
    const handleChangeMem = (index, field, value) => {
        const updatedMembers = [...formDataMem];
        updatedMembers[index][field] = value;
        setFormDataMem(updatedMembers);
    };
        
    const addNewMemberField = () => {
        setFormDataMem([...formDataMem, { lecturer_id: "", council_id: "", position_id: "" }]);
    };
        
    const removeMemberField = (index) => {
        const updatedMembers = formDataMem.filter((_, i) => i !== index);
        setFormDataMem(updatedMembers);
    };

    const deleteMember = async (memberId) => {
        if (councilMembers.length <= 3) {
            Alert.alert(
                "Lỗi",
                "Số lượng thành viên đang ở mức tối thiểu",
            );
            return;
        }

        try {
            const url = `${endpoints['council_details_id']}${memberId}/`;
            await APIs.delete(url, {
                headers: {
                    'X-CSRFToken': 'Wyr6DbQsggagMgMu48H8RlnkBhBHjQFX50ne8zXpBcDOB4fDYd5Yoaphc8zUNHgm'
                }
            });
            Alert.alert("Thành công", "Thành viên đã được xóa thành công");
            setCouncilMembers(prevMembers => prevMembers.filter(member => member.id !== memberId));
            setConfirmVisible(false);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                Alert.alert(
                    "Lỗi",
                    "Thành viên này không tồn tại",
                );
            } else {
                Alert.alert(
                    "Lỗi",
                    "Đã xảy ra lỗi khi xóa thành viên",
                );
            }
        }
    };


    const confirmDelete = (member) => {
        setMemberToDelete(member);
        setConfirmVisible(true);
    };

    const handleConfirmDelete = () => {
        if (memberToDelete) {
            deleteMember(memberToDelete.id);
        }
    };


    const updatePosition = async (newPosition, selectedMember) => {
        try {
            const url = `${endpoints['council_details']}`;
            const formData = new FormData();
            formData.append('position', newPosition);
            formData.append('lecturer', selectedMember.lecturerId);
            formData.append('council', selectedMember.councilId);
            const res = await APIs.patch(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRFToken': 'cl0o05M8FlReZn199elVa5Kq0W8VqJRptg41Gr9uOhmMXOCGp2qhnwNJJh3567Rb'
                }
            });
            setCouncilMembers(prevMembers => prevMembers.map(member =>
                member.id === selectedMember.id ? { ...member, position: newPosition } : member
            ));
            setEditPositionVisible(false);
    
        } catch (error) {
        }
    };
    
    const showEditPositionForm = (member, councilId) => {
        setSelectedMember({
            id: member.id,
            lecturerId: member.lecturer_id,
            councilId: member.councilId,
        });
        setEditPositionVisible(true);
    };
    
    const handleUpdatePosition = () => {
        if (newPosition.trim() !== '') {
            updatePosition(newPosition, selectedMember);
        } else {
        }
    };
    const [councilTheses, setCouncilTheses] = useState([]);
    const [thesisCode, setthesisCode] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleViewTheses = async (item) => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await authApi(token).get(endpoints['council-theses'](item.id));
            setCouncilTheses(response.data);
            setIsModalVisible(true); 
            cid = item.id;
        } catch (error) {
            Alert.alert("Lỗi", "Không thể tải tài nguyên");
        }
    };
    
    
    const handleThesis = async () => {
        try {
            const url = `${endpoints['councils']}${cid}/assign-thesis/`;
            const formData = new FormData();
            formData.append('thesis_code', thesisCode);
    
            const res = await APIs.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            if (res.status === 200 || res.status === 201) {
                alert('Thesis added successfully');
                setthesisCode('');
                setIsModalVisible(false); 
            } else {
                const responseData = await res.json();
                alert('Thất bại: ' + (responseData.message || 'Unknown error'));
            }
        } catch (error) {
            alert('Lỗi: ' + error.message);
        }
    };

    const [councilsOptions, setCouncilsOptions] = useState([]);
    const [selectedCouncil, setSelectedCouncil] = useState(null);

    const fetchCouncils = async () => {
        try {
            let allCouncils = [];
            let page = 1;
            while (true) {
                let url = `${endpoints['councils']}?page=${page}`;
                let res = await APIs.get(url);
                let councils = res.data.results.map(item => ({
                    id: item.id,
                    description: item.description,
                    name: item.name
                }));
                allCouncils = [...allCouncils, ...councils];
                if (!res.data.next) break;
                page++;
            }
            setCouncilsOptions(allCouncils);
        } catch (error) {
        }
    };

    const [lecturersOptions, setLecturersOptions] = useState([]);

    const fetchLecturers = async () => {
        try {
            let allLecturers = [];
            let page = 1;
            while (true) {
                let url = `${endpoints['lecturers']}?page=${page}`;
                let res = await APIs.get(url);
                let lecturers = res.data.results.map(item => ({
                    id: item.user,
                    code: item.code,
                    name: item.full_name
                }));
                allLecturers = [...allLecturers, ...lecturers];
                if (!res.data.next) break;
                page++;
            }
            setLecturersOptions(allLecturers);
        } catch (error) {
        }
    };

    const [positionsOptions, setPositionsOptions] = useState([]);

    const fetchPositions = async () => {
        try {
            let allPositions = [];
            let page = 1;
            while (true) {
                let url = `${endpoints['positions']}?page=${page}`;
                let res = await APIs.get(url);
                let positions = res.data.results.map(item => ({
                    id: item.id,
                    name: item.name
                }));
                allPositions = [...allPositions, ...positions];
                if (!res.data.next) break;
                page++;
            }
            setPositionsOptions(allPositions);
        } catch (error) {
        }
    };

    
    useEffect(() => {
        fetchCouncils();
        fetchLecturers();
        fetchPositions();
        fetchTheses();
    }, []);

    const [thesisOptions, setThesisOptions] = useState([]);

    const fetchTheses = async () => {
        try {
            let allTheses = [];
            let page = 1;
            while (true) {
                let url = `${endpoints['theses']}?page=${page}`;
                let res = await APIs.get(url);
                let theses = res.data.results.map(item => ({
                    code: item.code,
                    name: item.name,
                    start_date: item.start_date,
                    end_date: item.end_date,
                    council: item.council,
                    major: item.major,
                    schoolYear: item.school_year,
                }));
                allTheses = [...allTheses, ...theses];
                if (!res.data.next) break; 
                page++;
            }
            setThesisOptions(allTheses);
        } catch (error) {
        }
    };
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={StyleStudy.container}>
                <View style={StyleStudy.Square}>
                    <TouchableOpacity style={StyleStudy.backButton} onPress={handleBack}>
                        <Icon source="arrow-left" color="#f3e5e4" size={30} />
                    </TouchableOpacity>
                    <TouchableOpacity style={ManagerStudyStyle.DrawerButton} onPress={() => setisMenu(!isMenu)}>
                        <Icon source="menu-open" color="#f3e5e4" size={30} />
                    </TouchableOpacity>
                    <Image
                        style={StyleStudy.Logo}
                        source={{ uri: 'https://res.cloudinary.com/dkmurrwq5/image/upload/v1714062975/logo_kl.png' }}
                    />
                </View>
                <View style={StyleStudy.TopBackGround}>
                    <TouchableOpacity onPress={handleBack}>
                        <Icon icon="arrow-left" size={30} color="#f3e5e4" />
                    </TouchableOpacity>
                    <Text style={StyleStudy.greeting}>DANH SÁCH HỘI ĐỒNG</Text>
                </View>
                <Searchbar placeholder="Tìm kiếm theo tên hội đồng..." value={searchQuery} onChangeText={search} style={ManagerStudyStyle.Search} />
                <ScrollView
                    onScroll={loadMore}
                    scrollEventThrottle={16}
                    refreshControl={
                        <RefreshControl onRefresh={() => fetchThesisData(1, searchQuery)} refreshing={loading} />
                    }
                >
                    {loading && currentPage === 1 && <ActivityIndicator />}
                    {thesisData.map(item => (
                        <RenderItem key={item.id} item={item} />
                    ))}
                    {loading && currentPage > 1 && <ActivityIndicator />}
                </ScrollView>
                <Modal visible={isMenu}>
                    <View style={ManagerStudyStyle.modalContainerMenu}>
                        <View style={ManagerStudyStyle.modalMenu}>
                            <TouchableOpacity style={ManagerStudyStyle.modalFuntion} onPress={() => { setisPost(!isPost), setisMenu(false) }}>
                                <Text style={ManagerStudyStyle.modalItemText}>Thêm</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={ManagerStudyStyle.modalFuntion} onPress={() => { setEditModalVisible(!editModalVisible), setisMenu(false) }}>
                                <Text style={ManagerStudyStyle.modalItemText}>Sửa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={ManagerStudyStyle.modalFuntion} onPress={() => { setisDel(!isDel), setisMenu(false) }}>
                                <Text style={ManagerStudyStyle.modalItemText}>Xóa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={ManagerStudyStyle.modalFuntion} onPress={() => { setisPostMem(!isPostMem), setisMenu(false) }}>
                                <Text style={ManagerStudyStyle.modalItemText}>Thêm thành Viên</Text>
                            </TouchableOpacity>
                            <Button mode="outlined" onPress={() => setisMenu(false)} style={ManagerStudyStyle.closeButton}>
                                <Icon source="close" color="#f3e5e4" size={17} />
                                <Text style={{ color: '#f3e5e4', fontSize: 15 }}> Đóng</Text>
                            </Button>
                        </View>
                    </View>
                </Modal>
                <>
                    <Modal
                        visible={modalVisible}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={ManagerCouncilStyle.modalContainer}>
                            <View style={ManagerCouncilStyle.modalContent}>
                                {modalLoading ? (
                                    <ActivityIndicator size="large" color="#f3e5e4" />
                                ) : (
                                    <>
                                        <ScrollView style={ManagerCouncilStyle.scrollContainer}>
                                            {councilMembers.map((member, index) => (
                                                <View key={index} style={ManagerCouncilStyle.modalInfo}>
                                                    <Text style={ListStudyStyle.modalItemText}>{member.full_name}</Text>
                                                    <Text style={ListStudyStyle.modalItemText}>{member.position}</Text>
                                                    <Button style={ManagerCouncilStyle.DeleteButton} onPress={() => confirmDelete(member)}>
                                                        <Text style={{ color: '#f3e5e4' }}>
                                                            Xóa
                                                        </Text>
                                                    </Button>
                                                    <Button style={ManagerCouncilStyle.EditButton} onPress={() => showEditPositionForm(member)}>
                                                        <Text style={{ color: '#f3e5e4' }}>
                                                            Sửa
                                                        </Text>
                                                    </Button>
                                                </View>
                                            ))}
                                        </ScrollView>
                                        <Button mode="contained" style={ListStudyStyle.closeButton} onPress={() => setModalVisible(false)}>
                                            Đóng
                                        </Button>
                                    </>
                                )}
                            </View>
                        </View>
                    </Modal>
                    {confirmVisible && (
                        <Modal
                            visible={confirmVisible}
                            transparent={true}
                            animationType="fade"
                            onRequestClose={() => setConfirmVisible(false)}
                        >
                            <View style={ManagerCouncilStyle.modalContainer}>
                                <View style={ManagerCouncilStyle.modalContent}>
                                    <Text>Are you sure you want to delete {memberToDelete?.full_name}?</Text>
                                    <Button onPress={handleConfirmDelete}>
                                        <Text style={{ color: '#f3e5e4' }}>
                                            Yes
                                        </Text>
                                    </Button>
                                    <Button onPress={() => setConfirmVisible(false)}>
                                        <Text style={{ color: '#f3e5e4' }}>
                                            No
                                        </Text>
                                    </Button>
                                </View>
                            </View>
                        </Modal>
                    )}

                    {editPositionVisible && (
                        <Modal
                            visible={editPositionVisible}
                            transparent={true}
                            animationType="fade"
                            onRequestClose={() => setEditPositionVisible(false)}
                        >
                            <View style={ManagerCouncilStyle.modalContainer}>
                                <View style={ManagerCouncilStyle.modalContent}>
                                    <TextInput
                                        placeholder="Nhập vị trí mới"
                                        value={newPosition}
                                        onChangeText={text => setNewPosition(text)}
                                        style={ManagerCouncilStyle.input}
                                    />
                                    <Button onPress={handleUpdatePosition}>
                                        <Text style={{ color: '#f3e5e4' }}>Lưu</Text>
                                    </Button>
                                    <Button onPress={() => setEditPositionVisible(false)}>
                                        <Text style={{ color: '#f3e5e4' }}>Hủy</Text>
                                    </Button>
                                </View>
                            </View>
                        </Modal>
                    )}
                </>
                <Modal visible={isPost}>
                    <View style={ManagerStudyStyle.modalContainer}>
                        <View style={ManagerStudyStyle.modalInput}>
                            <Text style={ManagerStudyStyle.modalItemText2}>Thêm hội đồng mới</Text>
                            <ScrollView>
                                <TextInput
                                    placeholder="Tên hội đồng*"
                                    onChangeText={(text) => handleChange('name', text)}
                                    value={formData.name}
                                    style={ManagerStudyStyle.modalTextInput}
                                />
                                <TextInput
                                    placeholder="Mô tả*"
                                    onChangeText={(text) => handleChange('description', text)}
                                    value={formData.description}
                                    style={ManagerStudyStyle.modalTextInput}
                                />
                                <TextInput
                                    placeholder="Tình trạng khóa"
                                    onChangeText={(text) => handleChange('is_Lock', text)}
                                    value={formData.is_Lock}
                                    style={ManagerStudyStyle.modalTextInput}
                                />
                                {members.map((member, index) => (
                                    <View key={index}>
                                        <View style={CriteriaStyle.modalTextInput2}>
                                            <Picker
                                                selectedValue={member.lecturer_id}
                                                onValueChange={(itemValue) => handleMemberChange(index, 'lecturer_id', itemValue)}
                                                style={CriteriaStyle.modalTextInput}
                                            >
                                                {index === 0 && <Picker.Item label="Chọn mã giảng viên cho vị trí chủ tịch" value="" style={CriteriaStyle.label} />}
                                                {index === 1 && <Picker.Item label="Chọn mã giảng viên cho vị trí thư ký" value="" style={CriteriaStyle.label} />}
                                                {index === 2 && <Picker.Item label="Chọn mã giảng viên cho vị trí phản biện" value="" style={CriteriaStyle.label} />}
                                                {lecturersOptions.map(option => (
                                                    <Picker.Item
                                                        key={option.id}
                                                        label={`${option.code} - ${option.name}`}
                                                        value={option.id}
                                                        style={CriteriaStyle.choice}
                                                    >
                                                    </Picker.Item>
                                                ))}
                                            </Picker>
                                        </View>
                                    </View>
                                ))}


                            </ScrollView>
                            <View style={{ alignSelf: 'center', flexDirection: 'row', marginBottom: 20 }}>
                                <Button mode="contained" onPress={handleSubmit} style={[ManagerStudyStyle.closeButton, { marginRight: 20 }]}>
                                    Submit
                                </Button>
                                <Button onPress={() => { setisPost(false), setisMenu(!isMenu) }} style={ManagerStudyStyle.closeButton}>
                                    <Icon source="close" color="#f3e5e4" size={17} />
                                    <Text style={{ color: '#f3e5e4', fontSize: 15 }}> Đóng</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal visible={isDel}>
                    <View style={ManagerStudyStyle.modalContainer}>
                        <View style={[ManagerStudyStyle.modalInput, { height: 270 }]} >
                            <Text style={ManagerStudyStyle.modalItemText2}>Xóa hội đồng</Text>
                            <ScrollView>
                                <View style={CriteriaStyle.modalTextInput2}>
                                    <Picker
                                        selectedValue={deleteCode}
                                        onValueChange={(itemValue) => setDeleteCode(itemValue)}
                                        style={CriteriaStyle.modalTextInput}
                                    >
                                        <Picker.Item label="Chọn mã hội đồng" value="" style={CriteriaStyle.label} />
                                        {councilsOptions.map(option => (
                                            <Picker.Item
                                                key={option.id}
                                                label={`${option.id} - ${option.name}`}
                                                value={option.id}
                                                style={CriteriaStyle.choice}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                            </ScrollView>
                            <View style={{ alignSelf: 'center', marginBottom: 20, width: 160 }}>
                                <Button onPress={handleDelete} style={ManagerStudyStyle.closeButton}>
                                    <Text style={{ color: '#f3e5e4', fontSize: 15 }}> Xóa</Text>
                                </Button>
                                <Button onPress={() => { setisDel(false), setisMenu(!isMenu) }} style={ManagerStudyStyle.closeButton}>
                                    <Icon source="close" color="#f3e5e4" size={17} />
                                    <Text style={{ color: '#f3e5e4', fontSize: 15 }}> Đóng</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal visible={editModalVisible}>
                    <View style={ManagerStudyStyle.modalContainer}>
                        <View style={ManagerStudyStyle.modalInput}>
                            <Text style={ManagerStudyStyle.modalItemText2}>Sửa hội đồng</Text>
                            <ScrollView>
                                <View style={CriteriaStyle.modalTextInput2}>
                                    <Picker
                                        selectedValue={selectedCouncil}
                                        onValueChange={(itemValue) => {
                                            setSelectedCouncil(itemValue);
                                            handleEditChange('id', itemValue);
                                            const selectedCouncil = councilsOptions.find(option => option.id === itemValue);
                                            if (selectedCouncil) {
                                                setSelectedCouncilName(selectedCouncil.name);
                                                setSelectedCouncilDescription(selectedCouncil.description);
                                            } else {
                                                setSelectedCouncilName('');
                                                setSelectedCouncilDescription('');
                                            }
                                        }}
                                        style={CriteriaStyle.modalTextInput}
                                    >
                                        <Picker.Item label="Chọn mã hội đồng" value="" style={CriteriaStyle.label} />
                                        {councilsOptions.map(option => (
                                            <Picker.Item
                                                key={option.id}
                                                label={`${option.id} - ${option.name}`}
                                                value={option.id}
                                                style={CriteriaStyle.choice}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                                <Text style={ManagerCouncilStyle.textOriginal}>Tên hội đồng: {selectedCouncilName}</Text>
                                <TextInput
                                    placeholder="Tên mới"
                                    onChangeText={(text) => handleEditChange('name', text)}
                                    value={selectedThesis?.name}
                                    style={ManagerStudyStyle.modalTextInput}
                                />
                                <Text style={ManagerCouncilStyle.textOriginal}>Mô tả: {selectedCouncilDescription}</Text>
                                <TextInput
                                    placeholder="Mô tả mới"
                                    onChangeText={(text) => handleEditChange('description', text)}
                                    value={selectedThesis?.code}
                                    style={ManagerStudyStyle.modalTextInput}
                                />
                            </ScrollView>
                            <View style={{ alignSelf: 'center', flexDirection: 'row', marginBottom: 20 }}>
                                <Button mode="contained" onPress={handleEditUpdate} style={[ManagerStudyStyle.closeButton, { marginRight: 20 }]}>
                                    Sửa
                                </Button>
                                <Button onPress={() => { setEditModalVisible(false), setisMenu(!isMenu) }} style={ManagerStudyStyle.closeButton}>
                                    <Icon source="close" color="#f3e5e4" size={17} />
                                    <Text style={{ color: '#f3e5e4', fontSize: 15 }}> Đóng</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal visible={isPostMem}>
                    <View style={ManagerStudyStyle.modalContainer}>
                        <View style={ManagerStudyStyle.modalInput}>
                            <Text style={ManagerStudyStyle.modalItemText2}>Thêm thành viên mới</Text>
                            <ScrollView>
                                <View style={CriteriaStyle.modalTextInput2}>
                                    <Picker
                                        selectedValue={councilId}
                                        onValueChange={(itemValue) => setCouncilId(itemValue)}
                                        style={CriteriaStyle.modalTextInput}
                                    >
                                        <Picker.Item label="Chọn mã hội đồng" value="" style={CriteriaStyle.label} />
                                        {councilsOptions.map(option => (
                                            <Picker.Item
                                                key={option.id}
                                                label={`${option.id} - ${option.name}`}
                                                value={option.id}
                                                style={CriteriaStyle.choice}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                                {formDataMem.map((member, index) => (
                                    <View key={index}>
                                        <View style={CriteriaStyle.modalTextInput2}>
                                            <Picker
                                                selectedValue={member.lecturer_id}
                                                onValueChange={(itemValue) => handleChangeMem(index, 'lecturer_id', itemValue)}
                                                style={CriteriaStyle.modalTextInput}
                                            >
                                                <Picker.Item label="Chọn mã giảng viên" value="" style={CriteriaStyle.label} />
                                                {lecturersOptions.map(option => (
                                                    <Picker.Item
                                                        key={option.id}
                                                        label={`${option.code} - ${option.name}`}
                                                        value={option.id}
                                                        style={CriteriaStyle.choice}
                                                    />
                                                ))}
                                            </Picker>
                                        </View>
                                        <View style={CriteriaStyle.modalTextInput2}>
                                            <Picker
                                                selectedValue={member.position_id}
                                                onValueChange={(itemValue) => handleChangeMem(index, 'position_id', itemValue)}
                                                style={CriteriaStyle.modalTextInput}
                                            >
                                                <Picker.Item label="Chọn vị trí" value="" style={CriteriaStyle.label} />
                                                {positionsOptions.map(option => (
                                                    <Picker.Item
                                                        key={option.id}
                                                        label={`${option.id} - ${option.name}`}
                                                        value={option.id}
                                                        style={CriteriaStyle.choice}
                                                    />
                                                ))}
                                            </Picker>
                                        </View>
                                        {index > 0 && (
                                            <Button onPress={() => removeMemberField(index)} style={ManagerCouncilStyle.addButton}>
                                                <Text style={{ color: '#da91a4', fontSize: 12 }}> Xóa</Text>
                                            </Button>
                                        )}
                                    </View>
                                ))}
                            </ScrollView>
                            <Button onPress={addNewMemberField} style={ManagerCouncilStyle.addButton}>
                                <Text style={{ color: '#da91a4', fontSize: 12 }}> Thêm thành viên</Text>
                            </Button>
                            <View style={{ alignSelf: 'center', flexDirection: 'row', marginBottom: 20 }}>
                                <Button loading={loading} mode="contained" style={[ManagerStudyStyle.closeButton, { marginRight: 20 }]} onPress={handleMemberSubmit} >
                                    {!loading && (
                                        <Text style={{ color: '#f3e5e4', fontSize: 15, fontWeight: "bold" }}> Submit</Text>
                                    )}
                                </Button>
                                <Button onPress={() => { setisPostMem(false); setisMenu(!isMenu); }} style={ManagerStudyStyle.closeButton}>
                                    <Text style={{ color: '#f3e5e4', fontSize: 15 }}> Đóng</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                    visible={isModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setIsModalVisible(false)}
                >
                   
                    <View style={ManagerCouncilStyle.modalContainer}>
                        <View style={ManagerCouncilStyle.modalContent}>
                            {modalLoading ? (
                                <ActivityIndicator size="large" color="#f3e5e4" />
                            ) : (
                                <>
                                    <ScrollView style={ManagerCouncilStyle.scrollContainer}>
                                        {councilTheses.map((thesis, index) => (
                                            <View key={index} style={CouncilStyle.modalInfo}>
                                                <Text style={ListStudyStyle.modalItemText}>Mã: {thesis.code}</Text>
                                                <Text style={ListStudyStyle.modalItemText}>Tên: {thesis.name}</Text>
                                                <Text style={ListStudyStyle.modalItemText}>Ngày bắt đầu: {moment(thesis.start_date).format('DD-MM-YYYY')}</Text>
                                                <Text style={ListStudyStyle.modalItemText}>Ngày kết thúc: {moment(thesis.end_date).format('DD-MM-YYYY')}</Text>
                                                <Text style={ListStudyStyle.modalItemText}>khoa: {thesis.major}</Text>
                                            </View>
                                        ))}
                                    </ScrollView>

                                        <View style={CriteriaStyle.modalTextInput2}>
                                    <Picker
                                        selectedValue={thesisCode}
                                        onValueChange={(itemValue) => setthesisCode(itemValue)}
                                        style={CriteriaStyle.modalTextInput}
                                    >
                                        <Picker.Item label="Chọn mã khóa luận" value="" style={CriteriaStyle.label} />
                                        {thesisOptions.map(option => (
                                            <Picker.Item
                                                key={option.code}
                                                label={`${option.code} - ${option.name}`}
                                                value={option.code}
                                                style={CriteriaStyle.choice} />
                                        ))}
                                    </Picker>
                                </View>
                                    <Button mode="contained" style={ListStudyStyle.ButtonCouncilDetail} onPress={handleThesis}>
                                        Thêm khóa luận
                                    </Button>
                                    <Button mode="contained" style={ListStudyStyle.closeButton} onPress={() => {
                                        setCouncilTheses([]);
                                        setIsModalVisible(false); 
                                    }}>
                                        Đóng
                                    </Button>
                                </>
                            )}
                        </View>
                    </View>
                </Modal>


            </View>
        </TouchableWithoutFeedback>
    );
};

export default MenuCouncil;
