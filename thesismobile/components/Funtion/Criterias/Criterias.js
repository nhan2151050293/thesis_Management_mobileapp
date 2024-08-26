import React, { useContext, useEffect, useState, memo } from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator, RefreshControl, ScrollView, TextInput, Alert, KeyboardAvoidingView } from "react-native";
import { Icon, Modal, Searchbar, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { MyUserContext } from "../../../configs/Contexts";
import HomeStyle from "./Style";
import CriteriaStyle from "./Style";
import APIs, { endpoints } from "../../../configs/APIs";
import { Picker } from '@react-native-picker/picker';

const Criterias = () => {
    const [CriteriasData, setCriteriasData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const nav = useNavigation();
    const user = useContext(MyUserContext);
    const [selectedCriterias, setSelectedCriterias] = useState(null);
    const [isMenu, setisMenu] = useState(false);
    const [isPost, setisPost] = useState(false);
    const [isAdd, setIsAdd] = useState(false);
    const [formDataArray, setFormDataArray] = useState([{ criteria_id: "", weight: "" }]);
    const [thesisOptions, setThesisOptions] = useState([]);
    const [selectedThesis, setSelectedThesis] = useState(null);
    const [newCriteria, setNewCriteria] = useState({ name: "", evaluation_method: "" });
    const [criteriaOptions, setCriteriaOptions] = useState([]);
    const [criteriaNames, setCriteriaNames] = useState([]);



    const fetchCriteriaOptions = async () => {
        try {
            let allCriteriaOptions = [];
            let page = 1;
            while (true) {
                let url = `${endpoints['criterias']}?page=${page}`;
                let res = await APIs.get(url);
                let criteriaOptions = res.data.results.map(item => ({
                    id: item.id,
                    name: item.name
                }));
                allCriteriaOptions = [...allCriteriaOptions, ...criteriaOptions];
                if (!res.data.next) break; 
                page++;
            }
            setCriteriaOptions(allCriteriaOptions);
            setCriteriaNames(allCriteriaOptions.reduce((map, obj) => {
                map[obj.id] = obj.name;
                return map
            }, {}));
        } catch (error) {
        }
    };

    const fetchTheses = async () => {
        try {
            let allTheses = [];
            let page = 1;
            while (true) {
                let url = `${endpoints['theses']}?page=${page}`;
                let res = await APIs.get(url);
                let theses = res.data.results.map(item => ({
                    id: item.id,
                    code: item.code,
                    name: item.name
                }));
                allTheses = [...allTheses, ...theses];
                if (!res.data.next) break; 
                page++;
            }
            setThesisOptions(allTheses);
        } catch (error) {
        }
    };
    

    useEffect(() => {
        fetchTheses();
        fetchCriteriaOptions();
    }, []);

    const handleChange = (index, fieldName, value) => {
        const updatedFormDataArray = formDataArray.map((item, idx) => {
            if (idx === index) {
                return { ...item, [fieldName]: value };
            }
            return item;
        });
        setFormDataArray(updatedFormDataArray);
    };

    const addCriteriaField = () => {
        setFormDataArray([...formDataArray, { criteria_id: "", weight: "" }]);
    };

    const removeCriteriaField = (index) => {
        const updatedFormDataArray = formDataArray.filter((_, idx) => idx !== index);
        setFormDataArray(updatedFormDataArray);
    };

    const fetchCriterias = async (page, query) => {
        if (page > 0) {
            let url = `${endpoints['criterias']}?q=${query}&page=${page}`;
            try {
                setLoading(true);
                let res = await APIs.get(url);
                if (page === 1)
                    setCriteriasData(res.data.results);
                else if (page > 1)
                    setCriteriasData(current => [...current, ...res.data.results]);
                if (res.data.next === null)
                    setCurrentPage(0);
            } catch (ex) {
            } finally {
                setLoading(false);
            }
        }
    };
    useEffect(() => {
        fetchCriterias(currentPage, searchQuery);
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

    const RenderItem = memo(({ item }) => (
        <View style={CriteriaStyle.list} key={item.id}>
            <Text style={HomeStyle.itemText}>Tiêu chí: {item.name}</Text>
            <Text style={HomeStyle.itemText}>Phương pháp đánh giá: {item.evaluation_method}</Text>
            <Text style={HomeStyle.itemID}>{item.id}</Text>
        </View>
    ));

    const handleViewDetails = (item) => {
        setSelectedCriterias(item);
        setDetailModalVisible(true);
    };

    const addCouncil = async (thesisCode, dataArray) => {
        try {
            for (const data of dataArray) {
                const formData = new FormData();
                formData.append('thesis', thesisCode);
                formData.append('criteria', data.criteria_id);
                formData.append('weight', data.weight);

                try {
                    const res = await APIs.post(endpoints['thesis_criterias'], formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'X-CSRFToken': 'vWqCuUGs9m5sk9AilAnHUhyuGzbzopDCAxGGAqa00wD8Lllj5Urd01zgWN51d0Hc'
                        }
                    });
                } catch (error) {
                
                    if (error.response && error.response.status === 400 && error.response.data.code) {
                        Alert.alert(
                            "Lỗi",
                            `Mã Tiêu chí ${data.criteria_id} đã tồn tại`,
                        );
                    } else {
                        Alert.alert(
                            "Lỗi",
                            "Nhập đầy đủ các thông tin bắt buộc",
                        );
                    }
                }
            }
            Alert.alert("Thành công", "Tiêu chí đã được thêm thành công");
            setFormDataArray([{ criteria_id: "", weight: "" }]);
        } catch (error) {
        }
    };

    const handleSubmit = () => {
        const totalWeight = formDataArray.reduce((total, item) => total + parseFloat(item.weight || 0), 0);
        if (totalWeight !== 1) {
            Alert.alert("Lỗi", "Tổng trọng số phải bằng 1 (~100%)");
            return;
        }
        addCouncil(selectedThesis, formDataArray);
        setisPost(false);
        setisMenu(false);
    };

    const handleAddCriteria = async () => {
        const { name, evaluation_method } = newCriteria;
        if (!name || !evaluation_method) {
            Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('evaluation_method', evaluation_method);

        try {
            const res = await APIs.post(endpoints['criterias'], formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRFToken': 'vWqCuUGs9m5sk9AilAnHUhyuGzbzopDCAxGGAqa00wD8Lllj5Urd01zgWN51d0Hc'
                }
            });
            Alert.alert("Thành công", "Tiêu chí đã được thêm thành công");
            setNewCriteria({ name: "", evaluation_method: "" });
            setIsAdd(false);
            fetchCriterias(1, searchQuery); 
        } catch (error) {
            Alert.alert(
                "Lỗi",
                "Có lỗi xảy ra khi thêm tiêu chí",
            );
        }
    };

    return (
        <View style={HomeStyle.container}>
            <View style={HomeStyle.Square}>
                <TouchableOpacity style={HomeStyle.backButton} onPress={handleBack}>
                    <Icon source="arrow-left" color="#f3e5e4" size={30} />
                </TouchableOpacity>
                <TouchableOpacity style={HomeStyle.DrawerButton} onPress={() => setisMenu(!isMenu)}>
                    <Icon source="menu-open" color="#f3e5e4" size={30} />
                </TouchableOpacity>
                <Image
                    style={HomeStyle.Logo}
                    source={{ uri: 'https://res.cloudinary.com/dkmurrwq5/image/upload/v1714062975/logo_kl.png' }}
                />
            </View>
            <View style={HomeStyle.TopBackGround}>
                <Text style={HomeStyle.greeting}>DANH SÁCH TIÊU CHÍ</Text>
            </View>
            <Searchbar placeholder="Tìm kiếm ..." value={searchQuery} onChangeText={search} style={CriteriaStyle.search} />
            <ScrollView
                onScroll={loadMore}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl
                        onRefresh={() => fetchCriterias(1, searchQuery)} refreshing={loading} />
                }
            >
                {loading && currentPage === 1 && <ActivityIndicator />}
                {CriteriasData.map(item => (
                    <RenderItem key={item.id} item={item} />
                ))}
                {loading && currentPage > 1 && <ActivityIndicator />}
            </ScrollView>
            <Modal visible={isMenu}>
                <View style={HomeStyle.modalContainerMenu}>
                    <View style={HomeStyle.modalMenu}>
                        <TouchableOpacity style={HomeStyle.modalFuntion} onPress={() => { setisPost(true); setisMenu(false); }}>
                            <Text style={HomeStyle.modalItemText}>Gán tiêu chí cho khóa luận</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={HomeStyle.modalFuntion} onPress={() => { setIsAdd(true); setisMenu(false); }}>
                            <Text style={HomeStyle.modalItemText}>Thêm tiêu chí</Text>
                        </TouchableOpacity>
                        <Button mode="outlined" onPress={() => setisMenu(false)} style={HomeStyle.closeButton}>
                            <Icon source="close" color="#f3e5e4" size={17} />
                            <Text style={{ color: '#f3e5e4', fontSize: 15 }}> Đóng</Text>
                        </Button>
                    </View>
                </View>
            </Modal>
            <Modal visible={isPost}>
                <View style={CriteriaStyle.modalContainer}>
                    <View style={CriteriaStyle.modalInput}>
                        <Text style={CriteriaStyle.textmodal}>Gán tiêu chí cho khóa luận</Text>
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
                                        key={option.id}
                                        label={`${option.code} - ${option.name}`}
                                        value={option.code}
                                        style={CriteriaStyle.choice}
                                    />
                                ))}
                                </Picker>
                                </View>
                            {formDataArray.map((formData, index) => (
                                <View key={index} >
                                    <View style={CriteriaStyle.modalTextInput2}>
                                        <Picker
                                            selectedValue={formData.criteria_id}
                                            onValueChange={(itemValue) => handleChange(index, 'criteria_id', itemValue)}
                                            style={CriteriaStyle.modalTextInput}
                                        >
                                            <Picker.Item label="Chọn mã tiêu chí" value="" style={CriteriaStyle.label} />
                                            {criteriaOptions.map(option => (
                                                <Picker.Item key={option.id} label={`${option.id} - ${option.name}`} value={option.id.toString()} style={CriteriaStyle.choice} />
                                            ))}
                                        </Picker>
                                    </View>
                                    <TextInput
                                        placeholder="Tỉ trọng 0.1-1 (~100%)"
                                        onChangeText={(text) => handleChange(index, 'weight', text)}
                                        value={formData.weight}
                                        style={HomeStyle.modalTextInput}
                                    />
                                    {index > 0 && (
                                        <Button onPress={() => removeCriteriaField(index)} style={HomeStyle.removeButton}>
                                            <Text style={{ color: '#f3e5e4', fontSize: 15 }}>Xóa</Text>
                                        </Button>
                                    )}
                                </View>
                            ))}
                            <Button onPress={addCriteriaField} style={CriteriaStyle.addButton}>
                                <Text style={{ color: '#da91a4', fontSize: 15 }}>Thêm Tiêu Chí</Text>
                            </Button>
                        </ScrollView>
                        <View style={{ alignSelf: 'center', flexDirection: 'row', marginBottom: 20 }}>
                            <Button mode="contained" onPress={handleSubmit} style={[HomeStyle.closeButton, { marginRight: 20 }]}>
                                Submit
                            </Button>
                            <Button onPress={() => { setisPost(false); setisMenu(false); }} style={HomeStyle.closeButton}>
                                <Icon source="close" color="#f3e5e4" size={17} />
                                <Text style={{ color: '#f3e5e4', fontSize: 15 }}> Đóng</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal visible={isAdd}>
                <View style={CriteriaStyle.modalContainer}>
                    <View style={CriteriaStyle.modalInput2}>
                        <Text style={CriteriaStyle.textmodal}>Thêm tiêu chí mới</Text>
                        <TextInput
                            placeholder="Tên tiêu chí*"
                            onChangeText={(text) => setNewCriteria({ ...newCriteria, name: text })}
                            value={newCriteria.name}
                            style={HomeStyle.modalTextInput}
                        />
                        <TextInput
                            placeholder="Phương pháp*"
                            onChangeText={(text) => setNewCriteria({ ...newCriteria, evaluation_method: text })}
                            value={newCriteria.evaluation_method}
                            style={HomeStyle.modalTextInput}
                        />
                        <View style={{ alignSelf: 'center', flexDirection: 'row', marginBottom: 20 }}>
                            <Button mode="contained" onPress={handleAddCriteria} style={[HomeStyle.closeButton, { marginRight: 20 }]}>
                                Submit
                            </Button>
                            <Button onPress={() => { setIsAdd(false); setisMenu(false); }} style={HomeStyle.closeButton}>
                                <Icon source="close" color="#f3e5e4" size={17} />
                                <Text style={{ color: '#f3e5e4', fontSize: 15 }}> Đóng</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Criterias;