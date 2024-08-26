import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert, FlatList, ActivityIndicator, Modal, ScrollView, Linking } from "react-native";
import { Button, Icon, RadioButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { MyUserContext } from "../../../configs/Contexts";
import ListStudyStyle from "./ListStudyStyle";
import { authApi, endpoints } from "../../../configs/APIs";
import moment from 'moment';
import StyleStudy from "./StyleStudy";

const ListStudy = () => {
    const [thesisData, setThesisData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedThesis, setSelectedThesis] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [filterType, setFilterType] = useState(1); 
    const nav = useNavigation();
    const user = useContext(MyUserContext);

    useEffect(() => {
        const fetchThesisData = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                if (!token) {
                    Alert.alert("Error", "No token found. Please log in.");
                    return;
                }

                let lecturerThesisEndpoint = endpoints['thesis-by-user-lecturer'](user.id);
                let reviewerThesisEndpoint = endpoints['thesis-by-user-reviewer'](user.id);

                const [lecturerThesisResponse, reviewerThesisResponse] = await Promise.all([
                    authApi(token).get(lecturerThesisEndpoint),
                    authApi(token).get(reviewerThesisEndpoint)
                ]);

                const lecturerTheses = lecturerThesisResponse.data.map(thesis => ({ ...thesis, type: 'Hướng dẫn' }));
                const reviewerTheses = reviewerThesisResponse.data.map(thesis => ({ ...thesis, type: 'Phản biện' }));

                const combinedTheses = [...lecturerTheses, ...reviewerTheses];

                setThesisData(combinedTheses);
            } catch (error) {
                Alert.alert("Lỗi", "Không thể tải tài nguyên, vui lòng thử lại");
            } finally {
                setLoading(false);
            }
        };

        fetchThesisData();
    }, [user.id]);

    const handleBack = () => {
        nav.navigate('BottomNavigator');
    };

    const handleViewDetails = (item) => {
        setSelectedThesis(item);
        setModalVisible(true);
    };

    const filteredThesisData = thesisData.filter(item => {
        if (filterType === 1) return true; 
        if (filterType === 2) return item.type === 'Hướng dẫn'; 
        if (filterType === 3) return item.type === 'Phản biện'; 
    });

    const renderItem = ({ item }) => (
        <View>
            <Text style={ListStudyStyle.itemKind}>{item.type}</Text>
            <View style={ListStudyStyle.item}>
                <Text style={ListStudyStyle.itemText}>Mã: {item.code}</Text>
                <Text style={ListStudyStyle.itemText}>Tên: {item.name}</Text>
                <Text style={ListStudyStyle.itemText}>Khoa: {item.major}</Text>
                <Text style={ListStudyStyle.itemText}>Năm học: {item.school_year}</Text>
            </View>
            <View style={ListStudyStyle.buttonDetail}>
                <Button mode="contained" style={ListStudyStyle.closeButton} onPress={() => handleViewDetails(item)}>
                    Xem Chi Tiết
                </Button>
            </View>
        </View>
    );

    const handleFilterChange = (type) => {
        setFilterType(type);
    };


    const handleOpenLink = (url) => {
        if (url) {
            Linking.openURL(url);
        } else {
            Alert.alert("Lỗi", "Link file không tồn tại");
        }
    };
    

    const { start_date, end_date } = selectedThesis || {};
    const formattedStartDate = start_date ? moment(start_date).format('DD-MM-YYYY') : 'N/A';
    const formattedEndDate = end_date ? moment(end_date).format('DD-MM-YYYY') : 'N/A';

    return (
        <View style={ListStudyStyle.container}>
            <View style={ListStudyStyle.Square}>
                <TouchableOpacity style={ListStudyStyle.backButton} onPress={handleBack}>
                    <Icon source="arrow-left" color="#f3e5e4" size={30} />
                </TouchableOpacity>
                <Image
                    style={ListStudyStyle.Logo}
                    source={{ uri: 'https://res.cloudinary.com/dkmurrwq5/image/upload/v1714062975/logo_kl.png' }}
                />
            </View>
            <View style={ListStudyStyle.TopBackGround}>
                <Text style={ListStudyStyle.greeting}>DANH SÁCH KHÓA LUẬN</Text>
            </View>
            <View style={ListStudyStyle.filterContainer}>
                <RadioButton
                    value="1"
                    status={filterType === 1 ? 'checked' : 'unchecked'}
                    onPress={() => handleFilterChange(1)}
                    color="#da91a4"
                    uncheckedColor="#da91a4"
                />
                <Text style={ListStudyStyle.filterText}>Tất cả</Text>

                <RadioButton
                    value="2"
                    status={filterType === 2 ? 'checked' : 'unchecked'}
                    onPress={() => handleFilterChange(2)}
                    color="#da91a4"
                    uncheckedColor="#da91a4"
                />
                <Text style={ListStudyStyle.filterText}>Hướng dẫn</Text>

                <RadioButton
                    value="3"
                    status={filterType === 3 ? 'checked' : 'unchecked'}
                    onPress={() => handleFilterChange(3)}
                    color="#da91a4"
                    uncheckedColor="#da91a4"
                />
                <Text style={ListStudyStyle.filterText}>Phản biện</Text>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#f3e5e4" />
            ) : (
                <FlatList
                    contentContainerStyle={ListStudyStyle.Body}
                    data={filteredThesisData}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                />
            )}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={ListStudyStyle.modalContainer}>
                    <View style={ListStudyStyle.modalContent}>
                        {selectedThesis && (
                            <>
                                <View style={ListStudyStyle.modalInfo}>
                                    <ScrollView>
                                        <Text style={ListStudyStyle.modalItemText}>Mã: {selectedThesis.code}</Text>
                                        <Text style={ListStudyStyle.modalItemText}>{selectedThesis.name}</Text>
                                        <Text style={ListStudyStyle.modalItemText}>Ngày bắt đầu: {formattedStartDate}</Text>
                                        <Text style={ListStudyStyle.modalItemText}>Ngày kết thúc: {formattedEndDate}</Text>
                                        <Text style={ListStudyStyle.modalItemText}>Tổng điểm: {selectedThesis.total_score}</Text>
                                        <Text style={ListStudyStyle.modalItemText}>Kết quả: {selectedThesis.result ? "Đạt" : "Chưa đạt"}</Text>
                                        <Text style={ListStudyStyle.modalItemText}>Khoa: {selectedThesis.major}</Text>
                                        <Text style={ListStudyStyle.modalItemText}>Năm học: {selectedThesis.school_year}</Text>
                                        <Text style={ListStudyStyle.modalItemText}>Link báo cáo:</Text>
                                            <TouchableOpacity onPress={() => handleOpenLink(selectedThesis.report_file)}>
                                                <Text style={StyleStudy.itemLink}>{selectedThesis.report_file}</Text>
                                            </TouchableOpacity>
                                        <Text style={ListStudyStyle.modalItemText}>Giáo viên hướng dẫn:</Text>
                                        {selectedThesis.lecturers && selectedThesis.lecturers.map((lecturer) => (
                                            <View key={lecturer.code} style={ListStudyStyle.modalItemText}>
                                                <Text style={ListStudyStyle.modalItemText}>Mã GV: {lecturer.code}</Text>
                                                <Text style={ListStudyStyle.modalItemText}>Họ và Tên: {lecturer.full_name}</Text>
                                                <Text style={ListStudyStyle.modalItemText}>Khoa: {lecturer.faculty}</Text>
                                            </View>
                                        ))}
                                        <Text style={ListStudyStyle.modalItemText}>Sinh viên thực hiện:</Text>
                                        {selectedThesis.students && selectedThesis.students.map((students) => (
                                             <View key={students.code} style={ListStudyStyle.modalItemText}>
                                                    <Text style={ListStudyStyle.modalItemText}>Mã SV: {students.code}</Text>
                                                    <Text style={ListStudyStyle.modalItemText}>Họ và Tên: {students.full_name}</Text>
                                                    <Text style={ListStudyStyle.modalItemText}>Ngành: {students.major}</Text>
                                                </View>
                                        ))}
                                        {selectedThesis.reviewer && (
                                            <>
                                                <Text style={ListStudyStyle.modalItemText}>Giáo viên Phản biện:</Text>
                                                <View style={ListStudyStyle.modalItemText}>
                                                    <Text style={ListStudyStyle.modalItemText}>Mã GV: {selectedThesis.reviewer.code}</Text>
                                                    <Text style={ListStudyStyle.modalItemText}>Họ và Tên: {selectedThesis.reviewer.full_name}</Text>
                                                    <Text style={ListStudyStyle.modalItemText}>Khoa: {selectedThesis.reviewer.faculty}</Text>
                                                </View>
                                            </>
                                        )}
                                    </ScrollView>
                                    <Button mode="contained" style={ListStudyStyle.closeButton} onPress={() => setModalVisible(false)}>
                                        Đóng
                                </Button>
                                </View>
                                
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ListStudy;
