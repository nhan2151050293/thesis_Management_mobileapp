import React, { useEffect, useState, memo } from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator, TouchableWithoutFeedback, Keyboard, RefreshControl, ScrollView, TextInput, Alert, Linking} from "react-native";
import { Icon, Modal, Searchbar, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import StyleStudy from "../Study/StyleStudy";
import ManagerStudyStyle from "./ManagerStudyStyle";
import ListStudyStyle from "../Study/ListStudyStyle";
import CriteriaStyle from "../Criterias/Style";
import ManagerCouncilStyle from './ManagerCouncilStyle'
import APIs, { authApi,endpoints } from "../../../configs/APIs";
import moment from 'moment';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from 'react-native-modal-datetime-picker';


const ManagerStudy = () => {
    const [thesisData, setThesisData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageKL, setCurrentPageKL] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [isMenu, setisMenu] = useState(false);
    const [isPost, setisPost] = useState(false);
    const [isDel, setisDel] = useState(false);
    const nav = useNavigation();
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedThesis, setSelectedThesis] = useState(null);
    const [isAddLecturer, setisAddLecturer] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedThesisDetail, setSelectedThesisDetail] = useState(null);
   
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        startDate: "",
        endDate: "",
        reportFile: "",
        totalScore: "",
        result: "",
        council: "",
        major: "",
        schoolYear: "",
    });

    const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);

    const showStartDatePicker = () => {
        setStartDatePickerVisible(true);
    };

    const hideStartDatePicker = () => {
        setStartDatePickerVisible(false);
    };

    const handleStartDateConfirm = (date) => {
        setFormData({ ...formData, startDate: moment(date).format('YYYY-MM-DD') });
        setSelectedThesis({ ...selectedThesis, start_date: moment(date).format('YYYY-MM-DD') });
        hideStartDatePicker();
    };

    const showEndDatePicker = () => {
        setEndDatePickerVisible(true);
    };

    const hideEndDatePicker = () => {
        setEndDatePickerVisible(false);
    };

    const handleEndDateConfirm = (date) => {
        setFormData({ ...formData, endDate: moment(date).format('YYYY-MM-DD') });
        setSelectedThesis({ ...selectedThesis, end_date: moment(date).format('YYYY-MM-DD') });
        hideEndDatePicker();
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const fetchThesisData = async (page, query) => {
        if (page > 0) {
            let url = `${endpoints['theses']}?q=${query}&page=${page}`;
            try {
                setLoading(true);
                let res = await APIs.get(url);
                if (page === 1)
                    setThesisData(res.data.results);
                else if (page > 1)
                    setThesisData(current => [...current, ...res.data.results]);
                if (res.data.next === null)
                    setCurrentPageKL(0);
            } catch (ex) {
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchThesisData(currentPageKL, searchQuery);
    }, [currentPageKL, searchQuery]);

    const handleBack = () => {
        nav.navigate('BottomNavigator');
    };

    const loadMore = ({ nativeEvent }) => {
        if (!loading && isCloseToBottom(nativeEvent)) {
            setCurrentPageKL(prevPage => prevPage + 1);
        }
    };

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    };

    const search = (value) => {
        setCurrentPageKL(1);
        setSearchQuery(value);
    };

    const addThesis = async (thesisData) => {
        try {
            const formData = new FormData();
            formData.append('code', thesisData.code);
            formData.append('name', thesisData.name);
            formData.append('start_date', thesisData.startDate);
            formData.append('end_date', thesisData.endDate);
            formData.append('reportFile', thesisData.reportFile);
            formData.append('total_score', thesisData.totalScore);
            formData.append('result', thesisData.result);
            formData.append('council', thesisData.council);
            formData.append('major', thesisData.major);
            formData.append('school_year', thesisData.schoolYear);
            formData.append('student', thesisData.student);
    
            const res = await APIs.post(endpoints['theses'], formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
    
            return res.data.code; 
        } catch (error) {
            console.log('Error in addThesis:', error); 
            Alert.alert("Lỗi", `${JSON.stringify(error.response.data).replace(/[{}"]/g, '')}`);
            throw error; 
        }
    };
    
    const handleSubmit = async () => {
        if (!formData.code) {
            Alert.alert("Lỗi", "Vui lòng nhập mã khóa luận");
            return;
        }
    
        setLoading(true); 
    
        try {
            const thesisCode = await addThesis(formData); 
            await handleAddStudentSubmit(thesisCode, formDataMem); 
            await addLecturersToThesisSubmit(thesisCode, formDataLecturers);
            Alert.alert("Thành công", "Khóa luận đã được thêm thành công");
            setFormData({
                code: "",
                name: "",
                startDate: "",
                endDate: "",
                reportFile: "",
                totalScore: "",
                result: "",
                council: "",
                major: "",
                schoolYear: "",
                student: "",
            });
            setFormDataMem([{ student_id: "" }]);
            setFormDataLecturers([{ lecturerCode: '' }]);
            setLecturerCount(0);
            setisPost(false);
            setisMenu(!isMenu);
        } catch (error) {
            Alert.alert("Lỗi", `${JSON.stringify(error.response.data).replace(/[{}"]/g, '')}`);
        } finally {
            setLoading(false);
        }
    };

    

    const deleteThesis = async (code, showAlert = true) => {
        try {
            const url = `${endpoints['theses']}${code}/`;
            await APIs.delete(url, {
                headers: {
                    'X-CSRFToken': 'ph7SrMP9TGjIouFTcmM7YYxHr8ICb3GWyJ30WaW6eCMgdi826raXvNzE2ZGPFUhl'
                }
            });
            if (showAlert) {
                Alert.alert("Thành công", "Khóa luận đã được xóa thành công");
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                Alert.alert(
                    "Lỗi",
                    "Mã khóa luận này không tồn tại",
                    );
            } else {
                Alert.alert(
                    "Lỗi",
                    "Đã xảy ra lỗi khi xóa khóa luận",
                );
            }
        }
    };
    

    const handleDeleteSubmit = () => {
        if (!selectedThesis) {
            Alert.alert("Lỗi", "Vui lòng chọn mã khóa luận cần xóa");
            return;
        }
        deleteThesis(selectedThesis); 
        setisDel(false);
        setisMenu(!isMenu);
    };

    const updateThesis = async (thesisData) => {
        try {
            const url = `${endpoints['theses']}${thesisData.code}/`;
            const formData = new FormData();
            formData.append('code', thesisData.code);
            if (thesisData.name) {
                formData.append('name', thesisData.name);
            }
            if (thesisData.start_date) {
                formData.append('start_date', thesisData.start_date);
            }
            if (thesisData.end_date) {
                formData.append('end_date', thesisData.end_date);
                if (thesisData.reportFile) {
                    formData.append('reportFile', thesisData.reportFile);
                }
            }
            if (thesisData.total_score) {
                formData.append('total_score', thesisData.total_score);
            }
            if (thesisData.result) {
                formData.append('result', thesisData.result);
            }
            if (thesisData.council) {
                formData.append('council', thesisData.council);
            }
            if (thesisData.major) {
                formData.append('major', thesisData.major);
            }
            if (thesisData.school_year) {
                formData.append('school_year', thesisData.school_year);
            }
        
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
        if (!selectedThesis.code) {
            Alert.alert("Lỗi", "Mã là bắt buộc");
            return;
        }
        updateThesis(selectedThesis);
        
    };
    
    const addLecturersToThesis = async () => {
        try {
            if (!selectedThesis || formDataLecturers.length === 0) {
                Alert.alert("Lỗi", "Vui lòng chọn mã khóa luận và ít nhất một mã giảng viên");
                return;
            }

            if (lecturerCount > 2) {
                Alert.alert("Thông báo", "Bạn chỉ được thêm tối đa 2 giảng viên.");
                return;
            }

            const url = `${endpoints['theses']}${selectedThesis}/add_lecturer/`;

            for (const lecturer of formDataLecturers) {
                const formData = new FormData();
                formData.append('lecturer_code', lecturer.lecturerCode);

                const res = await APIs.post(url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-CSRFToken': 'your-csrf-token',
                    }
                });
            }

            Alert.alert("Thành công", "Các giảng viên đã được thêm vào khóa luận thành công");
            setisAddLecturer(false); 
        } catch (error) {
            if (error.response) {
                    Alert.alert("Lỗi", `${JSON.stringify(error.response.data).replace(/[{}"]/g, '')}`);
            } else {
                Alert.alert("Lỗi", "Đã xảy ra lỗi khi thêm giảng viên vào khóa luận");
            }
        }
    };
    const addLecturersToThesisSubmit = async (thesisCode, lecturers) => {
        try {
            if (!thesisCode || lecturers.length === 0) {
                throw new Error("Vui lòng chọn mã khóa luận và ít nhất một mã giảng viên");
            }
    
            if (lecturers.length > 2) {
                throw new Error("Bạn chỉ được thêm tối đa 2 giảng viên");
            }
    
            const url = `${endpoints['theses']}${thesisCode}/add_lecturer/`;
    
            for (const lecturer of lecturers) {
                const formData = new FormData();
                formData.append('lecturer_code', lecturer.lecturerCode);
                const res = await APIs.post(url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-CSRFToken': 'your-csrf-token', 
                    }
                });

            }
            setisAddLecturer(false); 
        } catch (error) {
            if (error.response) {
                Alert.alert("Lỗi", `${JSON.stringify(error.response.data).replace(/[{}"]/g, '')}`);
                await deleteThesis(thesisCode, false);
                    throw new Error(`${JSON.stringify(error.response.data)}`);
            } else {
                throw new Error("Đã xảy ra lỗi khi thêm giảng viên vào khóa luận");
            }
        }
    };
    
    const [lecturerCount, setLecturerCount] = useState(0);
    const [formDataLecturers, setFormDataLecturers] = useState([
        { lecturerCode: '' }
    ]);


    const handleChangeLecturer = (index, lecturerCode) => {
        const updatedLecturers = [...formDataLecturers];
        updatedLecturers[index].lecturerCode = lecturerCode;
        setFormDataLecturers(updatedLecturers);
    };

    const addNewLecturerField = () => {
        if (lecturerCount < 2) {
            setFormDataLecturers([...formDataLecturers, { lecturerCode: '' }]);
            setLecturerCount(lecturerCount + 1);
        } else {
            Alert.alert("Thông báo", "Bạn đã thêm tối đa 2 giảng viên.");
        }
    };

    const removeLecturerField = (index) => {
        const updatedLecturers = [...formDataLecturers];
        updatedLecturers.splice(index, 1);
        setFormDataLecturers(updatedLecturers);
        setLecturerCount(lecturerCount - 1);
    };

    const RenderItem = memo(({ item }) => (
        <View style={ManagerStudyStyle.item} key={item.id}>
            <Text style={StyleStudy.itemText}>Code: {item.code}</Text>
            <Text style={StyleStudy.itemText}>Name: {item.name}</Text>
            <Text style={StyleStudy.itemText}>Start Date: {moment(item.start_date).format('DD/MM/YYYY')}</Text>
            <Text style={StyleStudy.itemText}>End Date: {moment(item.end_date).format('DD/MM/YYYY')}</Text>
            <View style={ManagerStudyStyle.buttonDetail2}>
                <Button mode="contained" style={ManagerStudyStyle.closeButton2} onPress={() => handleViewDetails(item)}>
                    Xem Chi Tiết
                </Button>
                <Button mode="contained" style={ManagerStudyStyle.closeButton2} onPress={() => handleExportPDF(item)}>
                    Xuất bảng điểm
                </Button>
            </View>
        </View>
    ));

    const handleViewDetails = (item) => {
        setSelectedThesisDetail(item);
        setDetailModalVisible(true);
    };

    const handleExportPDF = async (item) => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await authApi(token).get(endpoints['these_generate-pdf'](item.code))
            const { file_url } = response.data;
        
            if (file_url) {
                Linking.openURL(file_url);
            } else {
                Alert.alert("Lỗi", "Không tìm thấy đường dẫn file PDF");
            }
        } catch (error) {
            Alert.alert("Lỗi", "Đã xảy ra lỗi khi xuất file PDF");
        }
    };
    
    const { start_date, end_date } = selectedThesisDetail || {};
    const formattedStartDate = start_date ? moment(start_date).format('DD-MM-YYYY') : 'N/A';
    const formattedEndDate = end_date ? moment(end_date).format('DD-MM-YYYY') : 'N/A';

    const [isList, setisList] = useState([]);

    const fetchListLecturer = async (page, query) => {
        if (page > 0) {
            let url = `${endpoints['lecturers']}?q=${query}&page=${page}`;
            try {
                setLoading(true);
                let res = await APIs.get(url);
                if (page === 1)
                    setisList(res.data.results);
                else if (page > 1)
                    setisList(current => [...current, ...res.data.results]);
                if (res.data.next === null)
                    setCurrentPage(0);
            } catch (ex) {
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchListLecturer(currentPage, searchQuery);
    }, [currentPage, searchQuery]);

    const lecturerOptions = isList.map(lecturer => ({
        key: lecturer.code,
        value: lecturer.code,
        text: `${lecturer.code} - ${lecturer.full_name} - ${lecturer.faculty}`
    }));

    const handleAddStudent = async () => {
        try {
            const url = `${endpoints['theses']}${selectedThesis?.code}/add_student/`;
    
            for (const member of formDataMem) {
                const formData = new FormData();
                formData.append('student_id', member.student_id);
    
                const res = await APIs.post(url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
    
                if (res.status === 200 || res.status === 201) {
                } else {
                    const responseData = await res.json();
                    Alert.alert("Lỗi", `Thêm học sinh thất bại: ${responseData.message || 'Lỗi không xác định'}`);
                }
            }
    
            setFormDataMem([{ student_id: "" }]);
            alert('Thêm học sinh thành công');
        } catch (error) {
            if (error.response && error.response.data) {
                Alert.alert("Lỗi", `${JSON.stringify(error.response.data).replace(/[{}"]/g, '')}`);
            } else {
                Alert.alert("Lỗi", `Lỗi khi thêm học sinh: ${error.message}`);
            }
        }
    };

    const handleAddStudentSubmit = async (thesisCode, students) => {
        try {
            const url = `${endpoints['theses']}${thesisCode}/add_student/`;
    
            const promises = students.map(member => {
                const formData = new FormData();
                formData.append('student_id', member.student_id);
    
                return APIs.post(url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
            });
    
            const responses = await Promise.all(promises);
    
            responses.forEach(res => {
                if (res.status === 200 || res.status === 201) {
                } else {
                    const responseData = res.data || {};
                    throw new Error('Thêm học sinh thất bại: ' + (responseData.message || 'Lỗi không xác định'));
                }
            });
    
            setFormDataMem([{ student_id: "" }]); 
        } catch (error) {
            Alert.alert("Lỗi", `${JSON.stringify(error.response.data).replace(/[{}"]/g, '')}`);
            await deleteThesis(thesisCode, false);
            throw new Error('Lỗi khi thêm học sinh: ' + error.message);
        }
    };
    
    const [formDataMem, setFormDataMem] = useState([{ student_id: "" }]);

    const handleChangeMem = (index, field, value) => {
        const updatedMembers = [...formDataMem];
        updatedMembers[index][field] = value;
        setFormDataMem(updatedMembers);
    };
    
    const addNewMemberField = () => {
        setFormDataMem([...formDataMem, { student_id: "" }]);
    };
    
    const removeMemberField = (index) => {
        const updatedMembers = formDataMem.filter((_, i) => i !== index);
        setFormDataMem(updatedMembers);
    };
    
    const handleOpenLink = (url) => {
        if (url) {
            Linking.openURL(url);
        } else {
            Alert.alert("Lỗi", "Link file không tồn tại");
        }
    };

    const [thesisOptions, setThesisOptions] = useState([]);

    useEffect(() => {
        fetchTheses();
        fetchLecturers();
        fetchMajors();
        fetchSchoolYears();
        fetchCouncils();
        fetchStudents();
    }, []);

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

    const [majorOptions, setMajorOptions] = useState([]);

    const fetchSchoolYears = async () => {
        try {
            let allSchoolYears = [];
            let page = 1;
            while (true) {
                let url = `${endpoints['school_years']}?page=${page}`;
                let res = await APIs.get(url);
                let schoolYears = res.data.results.map(item => ({
                    id: item.id,
                    name: item.name
                }));
                allSchoolYears = [...allSchoolYears, ...schoolYears];
                if (!res.data.next) break; 
                page++;
            }
            setSchoolYearOptions(allSchoolYears);
        } catch (error) {
        }
    };

    const fetchMajors = async () => {
        try {
            let allMajors = [];
            let page = 1;
            while (true) {
                let url = `${endpoints['majors']}?page=${page}`;
                let res = await APIs.get(url);
                let majors = res.data.results.map(item => ({
                    code: item.code,
                    name: item.name
                }));
                allMajors = [...allMajors, ...majors];
                if (!res.data.next) break; 
                page++;
            }
            setMajorOptions(allMajors);
        } catch (error) {
        }
    };

    const [schoolYearOptions, setSchoolYearOptions] = useState([]);

    const [councilsOptions, setCouncilsOptions] = useState([]);

    const fetchCouncils = async () => {
        try {
            let allCouncils = [];
            let page = 1;
            while (true) {
                let url = `${endpoints['councils']}?page=${page}`;
                let res = await APIs.get(url);
                let councils = res.data.results.map(item => ({
                    id: item.id,
                    code: item.code,
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

    const [studentsOptions, setStudentsOptions] = useState([]);

    const fetchStudents = async () => {
        try {
            let allStudents = [];
            let page = 1;
            while (true) {
                let url = `${endpoints['students']}?page=${page}`;
                let res = await APIs.get(url);
                let students = res.data.results.map(item => ({
                    user: item.user,
                    code: item.code,
                    name: item.full_name
                }));
                allStudents = [...allStudents, ...students];
                if (!res.data.next) break;
                page++;
            }
            setStudentsOptions(allStudents);
        } catch (error) {
        }
    };
    const [selectedThesisName, setSelectedThesisName] = useState('');
    const [selectedThesisStartDate, setSelectedThesisStartDate] = useState('');
    const [selectedThesisEndDate, setSelectedThesisEndDate] = useState('');
    const [selectedThesisCouncil, setSelectedThesisCouncil] = useState('');
    const [selectedThesisMajor, setSelectedThesisMajor] = useState('');
    const [selectedThesisSchoolYear, setSelectedThesisSchoolYear] = useState('');

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
                    <Text style={StyleStudy.greeting}>QUẢN LÍ KHÓA LUẬN</Text>
                </View>
                <Searchbar placeholder="Tìm kiếm theo tên khóa luận..." value={searchQuery} onChangeText={search} style={ManagerStudyStyle.Search} />
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
                <Modal
                    visible={detailModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setDetailModalVisible(false)}
                >
                    <View>
                        <View style={ListStudyStyle.modalContent}>
                            {selectedThesisDetail && (
                                <>
                                    <View style={ManagerStudyStyle.modalInfo}>
                                        <ScrollView>
                                            <Text style={ListStudyStyle.modalItemText}>Mã: {selectedThesisDetail.code}</Text>
                                            <Text style={ListStudyStyle.modalItemText}>{selectedThesisDetail.name}</Text>
                                            <Text style={ListStudyStyle.modalItemText}>Ngày bắt đầu: {formattedStartDate}</Text>
                                            <Text style={ListStudyStyle.modalItemText}>Ngày kết thúc: {formattedEndDate}</Text>
                                            <Text style={ListStudyStyle.modalItemText}>Tổng điểm: {selectedThesisDetail.total_score}</Text>
                                            <Text style={ListStudyStyle.modalItemText}>Kết quả: {selectedThesisDetail.result ? "Đạt" : "Chưa đạt"}</Text>
                                            <Text style={ListStudyStyle.modalItemText}>Khoa: {selectedThesisDetail.major}</Text>
                                            <Text style={ListStudyStyle.modalItemText}>Năm học: {selectedThesisDetail.school_year}</Text>
                                            <Text style={ListStudyStyle.modalItemText}>Link báo cáo:</Text>
                                            <TouchableOpacity onPress={() => handleOpenLink(selectedThesisDetail.report_file)}>
                                                <Text style={StyleStudy.itemLink}>{selectedThesisDetail.report_file}</Text>
                                            </TouchableOpacity>
                                            <Text style={ListStudyStyle.modalItemText}>Giáo viên hướng dẫn:</Text>
                                            {selectedThesisDetail.lecturers && selectedThesisDetail.lecturers.map((lecturer) => (
                                                <View key={lecturer.code} style={ListStudyStyle.modalItemText}>
                                                    <Text style={ListStudyStyle.modalItemText}>Mã GV: {lecturer.code}</Text>
                                                    <Text style={ListStudyStyle.modalItemText}>Họ và Tên: {lecturer.full_name}</Text>
                                                    <Text style={ListStudyStyle.modalItemText}>Khoa: {lecturer.faculty}</Text>
                                                </View>
                                            ))}
                                            <Text style={ListStudyStyle.modalItemText}>Sinh viên thực hiện:</Text>
                                            {selectedThesisDetail.students && selectedThesisDetail.students.map((students) => (
                                                <View key={students.code} style={ListStudyStyle.modalItemText}>
                                                    <Text style={ListStudyStyle.modalItemText}>Mã SV: {students.code}</Text>
                                                    <Text style={ListStudyStyle.modalItemText}>Họ và Tên: {students.full_name}</Text>
                                                    <Text style={ListStudyStyle.modalItemText}>Ngành: {students.major}</Text>
                                                </View>
                                            ))}
                                            {selectedThesisDetail.reviewer && (
                                                <>
                                                    <Text style={ListStudyStyle.modalItemText}>Giáo viên Phản biện:</Text>
                                                    <View style={ListStudyStyle.modalItemText}>
                                                        <Text style={ListStudyStyle.modalItemText}>Mã GV: {selectedThesisDetail.reviewer.code}</Text>
                                                        <Text style={ListStudyStyle.modalItemText}>Họ và Tên: {selectedThesisDetail.reviewer.full_name}</Text>
                                                        <Text style={ListStudyStyle.modalItemText}>Khoa: {selectedThesisDetail.reviewer.faculty}</Text>
                                                    </View>
                                                </>
                                            )}
                                        </ScrollView>
                                        <Button mode="contained" style={ListStudyStyle.closeButton} onPress={() => setDetailModalVisible(false)}>
                                            Đóng
                                        </Button>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                </Modal>
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
                            <TouchableOpacity style={ManagerStudyStyle.modalFuntion} onPress={() => { setisAddLecturer(true), setisMenu(false) }}>
                                <Text style={ManagerStudyStyle.modalItemText}>Thêm Giảng Viên</Text>
                            </TouchableOpacity>
                            <Button mode="outlined" onPress={() => setisMenu(false)} style={ManagerStudyStyle.closeButton}>
                                <Icon source="close" color="#f3e5e4" size={17} />
                                <Text style={{ color: '#f3e5e4', fontSize: 15 }}> Đóng</Text>
                            </Button>
                        </View>
                    </View>
                </Modal>
                <Modal visible={isPost}>
                    <View style={ManagerStudyStyle.modalContainer}>
                        <View style={ManagerStudyStyle.modalInput}>
                            <Text style={ManagerStudyStyle.modalItemText2}>Thêm khóa luận mới</Text>
                            <ScrollView>
                                <TextInput
                                    placeholder="Mã khóa luận*"
                                    onChangeText={(text) => handleChange('code', text)}
                                    value={formData.code}
                                    style={ManagerStudyStyle.modalTextInput}
                                />
                                <TextInput
                                    placeholder="Tên*"
                                    onChangeText={(text) => handleChange('name', text)}
                                    value={formData.name}
                                    style={ManagerStudyStyle.modalTextInput}
                                />
                                <TouchableOpacity onPress={showStartDatePicker} style={ManagerStudyStyle.modalTextInput2}>
                                    <Text style={{ color: 'black', marginRight: 120 }}>
                                        {formData.startDate || "Ngày bắt đầu*"}
                                    </Text>
                                    <Icon source="calendar-month" color="#da91a4" size={25} />
                                </TouchableOpacity>
                                <DateTimePicker
                                    isVisible={isStartDatePickerVisible}
                                    mode="date"
                                    onConfirm={handleStartDateConfirm}
                                    onCancel={hideStartDatePicker}
                                />
                                <TouchableOpacity onPress={showEndDatePicker} style={ManagerStudyStyle.modalTextInput2}>
                                    <Text style={{ color: 'black', marginRight: 120 }}>
                                        {formData.endDate || "Ngày kết thúc*"}
                                    </Text>
                                    <Icon source="calendar-month" color="#da91a4" size={25} />
                                </TouchableOpacity>
                                <DateTimePicker
                                    isVisible={isEndDatePickerVisible}
                                    mode="date"
                                    onConfirm={handleEndDateConfirm}
                                    onCancel={hideEndDatePicker}
                                />
                                <View style={CriteriaStyle.modalTextInput2}>
                                    <Picker
                                        selectedValue={formData.council}
                                        onValueChange={(itemValue) => handleChange('council', itemValue)}
                                        style={CriteriaStyle.modalTextInput}
                                    >
                                        <Picker.Item label="Chọn mã hội đồng" value="" style={CriteriaStyle.label} />
                                        {councilsOptions.map((council, index) => (
                                            <Picker.Item
                                                key={index}
                                                label={`${council.id} - ${council.name}`}
                                                value={council.id}
                                                style={CriteriaStyle.choice}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                                <View style={CriteriaStyle.modalTextInput2}>
                                    <Picker
                                        selectedValue={formData.major}
                                        onValueChange={(itemValue) => handleChange('major', itemValue)}
                                        style={CriteriaStyle.modalTextInput}
                                    >
                                        <Picker.Item label="Chọn mã khoa*" value="" style={CriteriaStyle.label} />
                                        {majorOptions.map((major, index) => (
                                            <Picker.Item key={index} label={`${major.code} - ${major.name}`} value={major.code} style={CriteriaStyle.choice} />
                                        ))}
                                    </Picker>
                                </View>
                                <View style={CriteriaStyle.modalTextInput2}>
                                    <Picker
                                        selectedValue={formData.schoolYear}
                                        onValueChange={(itemValue) => handleChange('schoolYear', itemValue)}
                                        style={CriteriaStyle.modalTextInput}
                                    >
                                        <Picker.Item label="Chọn năm học*" value="" style={CriteriaStyle.label} />
                                        {schoolYearOptions.map((year, index) => (
                                            <Picker.Item key={index} label={`${year.name}`} value={year.id} style={CriteriaStyle.choice} />
                                        ))}
                                    </Picker>
                                </View>
                                <View>
                                    <Text style={{ marginBottom: 10, alignSelf:'center',color:'grey', fontWeight:15, fontWeight:'bold'}}>Thêm sinh viên</Text>
                                    {formDataMem.map((member, index) => (
                                        <View key={index} style={{ alignItems: 'center' }}>
                                             <View style={CriteriaStyle.modalTextInput2}>
                                            <Picker
                                                selectedValue={member.student_id}
                                                onValueChange={(itemValue) => handleChangeMem(index, 'student_id', itemValue)}
                                                style={CriteriaStyle.modalTextInput}
                                            >
                                                <Picker.Item label="Chọn học sinh" value="" style={CriteriaStyle.label} />
                                                {studentsOptions.map((student, studentIndex) => (
                                                    <Picker.Item
                                                        key={studentIndex}
                                                        label={`${student.code} - ${student.name}`}
                                                        value={student.user}
                                                        style={CriteriaStyle.choice}
                                                    />
                                                ))}
                                            </Picker>
                                        </View>
                                            {formDataMem.length > 1 && (
                                                <TouchableOpacity onPress={() => removeMemberField(index)}>
                                                    <Text style={{color:'#da91a4', marginBottom:10, borderWidth:1,borderColor:'#da91a4', borderRadius:5, padding:5, textAlign:'center'}}>Xóa</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    ))}
                                    {formDataMem.length < 4 && (
                                        <TouchableOpacity onPress={addNewMemberField} style={{ marginTop: 10, margin:40, marginBottom:10 }}>
                                            <Text style={{color:'#da91a4', marginBottom:10, borderWidth:1,borderColor:'#da91a4', borderRadius:5, padding:5, textAlign:'center',fontWeight:'bold'}}>Thêm sinh viên khác</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                                <View>
                                    <Text style={{ marginBottom: 10, alignSelf:'center',color:'grey', fontWeight:15, fontWeight:'bold'}}>Thêm giảng viên</Text>
                                    {formDataLecturers.map((member, index) => (
                                        <View key={index} style={{ alignItems: 'center' }}>
                                            <View style={CriteriaStyle.modalTextInput2}>
                                                <Picker
                                                    selectedValue={member.lecturerCode}
                                                    onValueChange={(itemValue) => handleChangeLecturer(index, itemValue)}
                                                    style={CriteriaStyle.modalTextInput}
                                                >
                                                    <Picker.Item label="Chọn mã giảng viên" value="" style={CriteriaStyle.label} />
                                                    {lecturersOptions.map(option => (
                                                        <Picker.Item
                                                            key={option.id}
                                                            label={`${option.code} - ${option.name}`}
                                                            value={option.code}
                                                            style={CriteriaStyle.choice}
                                                        />
                                                    ))}
                                                </Picker>
                                            </View>
                                            {formDataLecturers.length > 1 && (
                                                <TouchableOpacity onPress={() => removeLecturerField(index)}>
                                                   <Text style={{color:'#da91a4', marginBottom:10, borderWidth:1,borderColor:'#da91a4', borderRadius:5, padding:5, textAlign:'center'}}>Xóa</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    ))}
                                    {formDataLecturers.length < 2 && (
                                        <TouchableOpacity onPress={addNewLecturerField} style={{ marginTop: 10, margin:40, marginBottom:10 }}>
                                            <Text style={{color:'#da91a4', marginBottom:10, borderWidth:1,borderColor:'#da91a4', borderRadius:5, padding:5, textAlign:'center',fontWeight:'bold'}}>Thêm giảng viên khác</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
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
                            {loading && (
                                <View style={ManagerStudyStyle.loadingContainer}>
                                    <ActivityIndicator size="large" color="#0000ff" />
                                </View>
                            )}
                        </View>
                    </View>
                </Modal>
                <Modal visible={isDel}>
                    <View style={ManagerStudyStyle.modalContainer}>
                        <View style={[ManagerStudyStyle.modalInput, { height: 270 }]} >
                            <Text style={ManagerStudyStyle.modalItemText2}>Xóa khóa luận</Text>
                            <View style={CriteriaStyle.modalTextInput2}>
                                <Picker
                                    selectedValue={selectedThesis}
                                    onValueChange={(itemValue) => setSelectedThesis(itemValue)}
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
                            <View style={{ alignSelf: 'center', marginBottom: 20, width: 160 }}>
                                <Button onPress={handleDeleteSubmit} style={ManagerStudyStyle.closeButton}>
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
                            <Text style={ManagerStudyStyle.modalItemText2}>Sửa khóa luận</Text>
                            <ScrollView>
                                <View style={CriteriaStyle.modalTextInput2}>
                                    <Picker
                                        selectedValue={selectedThesis?.code}
                                        onValueChange={(itemValue) => {
                                            handleEditChange('code', itemValue); 
                                            const selectedThesis = thesisOptions.find(option => option.code === itemValue);
                                            if (selectedThesis) {
                                                setSelectedThesisName(selectedThesis.name);
                                                setSelectedThesisStartDate(selectedThesis.start_date);
                                                setSelectedThesisEndDate(selectedThesis.end_date);
                                                setSelectedThesisCouncil(selectedThesis.council);
                                                setSelectedThesisMajor(selectedThesis.major);
                                                setSelectedThesisSchoolYear(selectedThesis.schoolYear);
                                            } else {
                                                setSelectedThesisName('');
                                                setSelectedThesisStartDate('');
                                                setSelectedThesisEndDate('');
                                                setSelectedThesisCouncil('');
                                                setSelectedThesisMajor('');
                                                setSelectedThesisSchoolYear('');
                                            }
                                        }}
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
                                <Text style={ManagerStudyStyle.textOriginal}>Tên khóa luận</Text>
                                <Text style={ManagerStudyStyle.textOriginal2}>{selectedThesisName}</Text>
                                <TextInput
                                    placeholder="Tên khóa luận mới"
                                    onChangeText={(text) => handleEditChange('name', text)}
                                    value={selectedThesis?.name}
                                    style={ManagerStudyStyle.modalTextInput}
                                />
                                <Text style={ManagerStudyStyle.textOriginal}>Ngày bắt đầu</Text>
                                <Text style={ManagerStudyStyle.textOriginal2}>{selectedThesisStartDate}</Text>
                                <TouchableOpacity onPress={showStartDatePicker} style={ManagerStudyStyle.modalTextInput2}>
                                    <Text style={{ color: 'black', marginRight: 100 }}>
                                        {selectedThesis?.start_date || "Ngày bắt đầu mới"}
                                    </Text>
                                    <Icon source="calendar-month" color="#da91a4" size={25} />
                                </TouchableOpacity>
                                <DateTimePicker
                                    isVisible={isStartDatePickerVisible}
                                    mode="date"
                                    onConfirm={handleStartDateConfirm}
                                    onCancel={hideStartDatePicker}
                                />
                                <Text style={ManagerStudyStyle.textOriginal}>Ngày kết thúc</Text>
                                <Text style={ManagerStudyStyle.textOriginal2}>{selectedThesisEndDate}</Text>
                                <TouchableOpacity onPress={showEndDatePicker} style={ManagerStudyStyle.modalTextInput2}>
                                    <Text style={{ color: 'black', marginRight: 100 }}>
                                        {selectedThesis?.end_date || "Ngày kết thúc mới"}
                                    </Text>
                                    <Icon source="calendar-month" color="#da91a4" size={25} />
                                </TouchableOpacity>
                                <DateTimePicker
                                    isVisible={isEndDatePickerVisible}
                                    mode="date"
                                    onConfirm={handleEndDateConfirm}
                                    onCancel={hideEndDatePicker}
                                />
                                <Text style={ManagerStudyStyle.textOriginal4}>Hội đồng</Text>
                                <Text style={ManagerStudyStyle.textOriginal3}>{selectedThesisCouncil}</Text>
                                <View style={CriteriaStyle.modalTextInput2}>
                                    <Picker
                                        selectedValue={selectedThesis?.council}
                                        onValueChange={(itemValue) => handleEditChange('council', itemValue)}
                                        style={CriteriaStyle.modalTextInput}
                                    >
                                        <Picker.Item label="Chọn mã hội đồng mới" value="" style={CriteriaStyle.label} />
                                        {councilsOptions.map((council, index) => (
                                            <Picker.Item
                                                key={index}
                                                label={`${council.id} - ${council.name}`}
                                                value={council.id}
                                                style={CriteriaStyle.choice}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                                <Text style={ManagerStudyStyle.textOriginal4}>Khoa</Text>
                                <Text style={ManagerStudyStyle.textOriginal3}>{selectedThesisMajor}</Text>
                                <View style={CriteriaStyle.modalTextInput2}>
                                    <Picker
                                        selectedValue={selectedThesis?.major}
                                        onValueChange={(itemValue) => handleEditChange('major', itemValue)}
                                        style={CriteriaStyle.modalTextInput}
                                    >
                                        <Picker.Item label="Chọn mã khoa mới" value="" style={CriteriaStyle.label} />
                                        {majorOptions.map((major, index) => (
                                            <Picker.Item key={index} label={`${major.code} - ${major.name}`} value={major.code} style={CriteriaStyle.choice} />
                                        ))}
                                    </Picker>
                                </View>
                                <Text style={ManagerStudyStyle.textOriginal4}>Năm học</Text>
                                <Text style={ManagerStudyStyle.textOriginal3}>{selectedThesisSchoolYear}</Text>
                                <View style={CriteriaStyle.modalTextInput2}>
                                    <Picker
                                        selectedValue={selectedThesis?.school_year}
                                        onValueChange={(itemValue) => handleEditChange('school_year', itemValue)}
                                        style={CriteriaStyle.modalTextInput}
                                    >
                                        <Picker.Item label="Chọn năm học mới" value="" style={CriteriaStyle.label} />
                                        {schoolYearOptions.map((year, index) => (
                                            <Picker.Item key={index} label={`${year.name}`} value={year.id} style={CriteriaStyle.choice} />
                                        ))}
                                    </Picker>
                                </View>
                                {formDataMem.map((member, index) => (
                                    <View key={index}>
                                        <View style={CriteriaStyle.modalTextInput2}>
                                            <Picker
                                                selectedValue={member.student_id}
                                                onValueChange={(itemValue) => handleChangeMem(index, 'student_id', itemValue)}
                                                style={CriteriaStyle.modalTextInput}
                                            >
                                                <Picker.Item label="Chọn học sinh" value="" style={CriteriaStyle.label} />
                                                {studentsOptions.map((student, studentIndex) => (
                                                    <Picker.Item
                                                        key={studentIndex}
                                                        label={`${student.code} - ${student.name}`}
                                                        value={student.user}
                                                        style={CriteriaStyle.choice}
                                                    />
                                                ))}
                                            </Picker>
                                        </View>
                                        {index > 0 && (
                                            <Button onPress={() => removeMemberField(index)}>
                                                <Icon source="minus-circle" color="#da91a4" size={25} />
                                            </Button>
                                        )}
                                    </View>
                                ))}
                                <Button onPress={addNewMemberField}>
                                    <Icon source="plus-circle-outline" color="#da91a4" size={25} />
                                </Button>
                                <Button mode="contained" onPress={handleAddStudent} style={ManagerStudyStyle.addSButton}>
                                    <Text style={{ color: '#da91a4' }}>Thêm học sinh</Text>
                                </Button>
                            </ScrollView>
                            <View style={{ alignSelf: 'center', flexDirection: 'row', marginBottom: 20 }}>
                                <Button mode="contained" onPress={handleEditUpdate} style={[ManagerStudyStyle.closeButton, { marginRight: 20 }]}>
                                    Update
                                </Button>
                                <Button onPress={() => { setEditModalVisible(false), setisMenu(!isMenu) }} style={ManagerStudyStyle.closeButton}>
                                    <Icon source="close" color="#f3e5e4" size={17} />
                                    <Text style={{ color: '#f3e5e4', fontSize: 15 }}> Đóng</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal visible={isAddLecturer}>
                    <View style={ManagerStudyStyle.modalContainer}>
                        <View style={ManagerStudyStyle.modalInput}>
                            <Text style={ManagerStudyStyle.modalItemText2}>Thêm Giảng Viên vào Khóa Luận</Text>
                            <ScrollView>
                                <View style={CriteriaStyle.modalTextInput2}>
                                    <Picker
                                        selectedValue={selectedThesis}
                                        onValueChange={(itemValue) => setSelectedThesis(itemValue)}
                                        style={CriteriaStyle.modalTextInput}
                                    >
                                        <Picker.Item label="Chọn mã khóa luận" value="" style={CriteriaStyle.label} />
                                        {thesisOptions.map(option => (
                                            <Picker.Item
                                                key={option.code}
                                                label={`${option.code} - ${option.name}`}
                                                value={option.code}
                                                style={CriteriaStyle.choice}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                                {formDataLecturers.map((lecturer, index) => (
                                    <View key={index}>
                                        <View style={CriteriaStyle.modalTextInput2}>
                                            <Picker
                                                selectedValue={lecturer.lecturerCode}
                                                onValueChange={(itemValue) => handleChangeLecturer(index, itemValue)}
                                                style={CriteriaStyle.modalTextInput}
                                            >
                                                <Picker.Item label="Chọn mã giảng viên" value="" style={CriteriaStyle.label} />
                                                {lecturersOptions.map(option => (
                                                    <Picker.Item
                                                        key={option.id}
                                                        label={`${option.code} - ${option.name}`}
                                                        value={option.code}
                                                        style={CriteriaStyle.choice}
                                                    />
                                                ))}
                                            </Picker>
                                        </View>
                                        {index > 0 && (
                                            <Button onPress={() => removeLecturerField(index)} style={ManagerCouncilStyle.addButton}>
                                                <Text style={{ color: '#da91a4', fontSize: 12 }}> Xóa</Text>
                                            </Button>
                                        )}
                                    </View>
                                ))}
                            </ScrollView>
                            {lecturerCount < 2 && (
                                <Button onPress={addNewLecturerField}>
                                    <Icon source="plus-circle-outline" color="#da91a4" size={25} />
                                </Button>
                            )}
                            <View style={{ alignSelf: 'center', flexDirection: 'row', marginBottom: 20 }}>
                                <Button mode="contained" onPress={addLecturersToThesis} style={[ManagerStudyStyle.closeButton, { marginRight: 20 }]}>
                                    Thêm
                                </Button>
                                <Button onPress={() => { setisAddLecturer(false); }} style={ManagerStudyStyle.closeButton}>
                                    <Text style={{ color: '#f3e5e4', fontSize: 15 }}> Đóng</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                </Modal>

            </View>
        </TouchableWithoutFeedback>
    );
};

export default ManagerStudy;

