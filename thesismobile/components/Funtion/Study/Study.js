import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert, FlatList, ActivityIndicator, ScrollView, TextInput, Linking } from "react-native";
import { Button, Icon, Modal, Portal, Provider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { MyUserContext } from "../../../configs/Contexts";
import StyleStudy from "./StyleStudy";
import { authApi, endpoints } from "../../../configs/APIs";
import moment from 'moment';

const Study = () => {
    const [thesisData, setThesisData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false);
    const [reportFile, setReportFile] = useState("");
    const [selectedThesis, setSelectedThesis] = useState(null);
    const nav = useNavigation();
    const user = useContext(MyUserContext);

    useEffect(() => {
        const fetchThesisData = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                if (!token) {
                    Alert.alert("Lỗi", "Vui lòng đăng nhập");
                    return;
                }
                const response = await authApi(token).get(endpoints['thesis-by-user-student'](user.student.thesis));
                const thesisArray = Array.isArray(response.data) ? response.data : [response.data];
                
                setThesisData(thesisArray);
            } finally {
                setLoading(false);
            }
        };

        fetchThesisData();
    }, [user.student.thesis]);

    const handleBack = () => {
        nav.navigate('BottomNavigator');
    };

    const openModal = (thesis) => {
        setSelectedThesis(thesis);
        setReportFile(thesis.report_file || "");

        setModalVisible(true);
    };

    const submitReport = async () => {
        if (!reportFile) {
            Alert.alert("Lỗi", "Vui lòng nhập đường dẫn");
            return;
        }
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Lỗi", "Vui lòng đăng nhập");
                return;
            }

            const formData = {
                report_file: reportFile
            };

            const response = await authApi(token).patch(
                endpoints['thesis-by-user-student'](user.student.thesis),
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );
            const updatedThesisData = thesisData.map(thesis =>
                thesis.id === selectedThesis.id ? { ...thesis, report_file: reportFile } : thesis
            );

            setThesisData(updatedThesisData);
            setModalVisible(false);
            Alert.alert("Thông báo", "Báo cáo đã được nộp");
        } catch (error) {
            Alert.alert("Lỗi", "Không thể nộp báo cáo, vui lòng thử lại");
        }
    };

    const handleOpenLink = (url) => {
        if (url) {
            Linking.openURL(url);
        } else {
            Alert.alert("Lỗi", "Link của file không tồn tại");
        }
    };

    const renderItem = ({ item }) => (
        <View style={StyleStudy.item}>
            <ScrollView>
                <Text style={StyleStudy.itemText2}>Mã: {item.code}</Text>
                <Text style={StyleStudy.itemText}>Tên: {item.name}</Text>
                <Text style={StyleStudy.itemText}>Ngày bắt đầu: {moment(item.start_date).format('DD-MM-YYYY')}</Text>
                <Text style={StyleStudy.itemText}>Ngày kết thúc: {moment(item.end_date).format('DD-MM-YYYY')}</Text>
                <Text style={StyleStudy.itemText}>Tổng điểm: {item.total_score}</Text>
                <Text style={StyleStudy.itemText}>Kết quả: {item.result ? "Đạt" : "Chưa đạt"}</Text>
                <Text style={StyleStudy.itemText}>Khoa: {item.major}</Text>
                <Text style={StyleStudy.itemText}>Năm học: {item.school_year}</Text>
                <Text style={StyleStudy.itemText}>Link file báo cáo: </Text>
                <TouchableOpacity onPress={() => handleOpenLink(item.report_file)}>
                    <Text style={StyleStudy.itemLink}>{item.report_file}</Text>
                </TouchableOpacity>

                <Button mode="contained" style={StyleStudy.Button} onPress={() => openModal(item)}>
                    <Text style={{ color: '#f3e5e4', fontSize: 14 }}>Nộp Báo Cáo</Text>
                </Button>
                <Text style={StyleStudy.itemText2}>Sinh viên:</Text>
                {item.students.map((student, index) => (
                    <View key={index} style={StyleStudy.itemText}>
                        <Text style={StyleStudy.itemText}>Mã SV: {student.code}</Text>
                        <Text style={StyleStudy.itemText}>Họ và Tên: {student.full_name}</Text>
                        <Text style={StyleStudy.itemText}>Ngày sinh: {moment(student.birthday).format('DD-MM-YYYY')}</Text>
                        <Text style={StyleStudy.itemText}>Địa chỉ: {student.address}</Text>
                        <Text style={StyleStudy.itemText}>GPA: {student.gpa}</Text>
                        <Text style={StyleStudy.itemText}>Ngành học: {student.major}</Text>
                    </View>
                ))}
                <Text style={StyleStudy.itemText2}>Giáo viên hướng dẫn:</Text>
                {item.lecturers.map((lecturer, index) => (
                    <View key={index} style={StyleStudy.itemText}>
                        <Text style={StyleStudy.itemText}>Mã GV: {lecturer.code}</Text>
                        <Text style={StyleStudy.itemText}>Họ và Tên: {lecturer.full_name}</Text>
                        <Text style={StyleStudy.itemText}>Khoa: {lecturer.faculty}</Text>
                    </View>
                ))}
                {item.reviewer && (
                    <>
                        <Text style={StyleStudy.itemText2}>Người phản biện:</Text>
                        <View style={StyleStudy.itemText}>
                            <Text style={StyleStudy.itemText}>Mã PB: {item.reviewer.code}</Text>
                            <Text style={StyleStudy.itemText}>Họ và Tên: {item.reviewer.full_name}</Text>
                            <Text style={StyleStudy.itemText}>Khoa: {item.reviewer.faculty}</Text>
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );

    return (
        <Provider>
            <View style={StyleStudy.container}>
                <View style={StyleStudy.Square}>
                    <TouchableOpacity style={StyleStudy.backButton} onPress={handleBack}>
                        <Icon source="arrow-left" color="#f3e5e4" size={30} />
                    </TouchableOpacity>
                    <Image
                        style={StyleStudy.Logo}
                        source={{ uri: 'https://res.cloudinary.com/dkmurrwq5/image/upload/v1714062975/logo_kl.png' }}
                    />
                </View>
                <View style={StyleStudy.TopBackGround}>
                    <Text style={StyleStudy.greeting}>THÔNG TIN KHÓA LUẬN</Text>
                </View>
                <View style={StyleStudy.Body}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#f3e5e4" />
                    ) : thesisData.length > 0 ? (
                        <FlatList
                            data={thesisData}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                        />
                    ) : (
                        <Text style={StyleStudy.noDataText}>Không có khóa luận nào</Text>
                    )}
                </View>
                <Portal>
                    <Modal visible={isModalVisible} onDismiss={() => setModalVisible(false)}>
                        <View style={StyleStudy.modalContent}>
                            <Text style={StyleStudy.modalTitle}>Nộp Báo Cáo</Text>
                            <TextInput
                                style={StyleStudy.modalInput}
                                placeholder="Nhập link drive"
                                value={reportFile}
                                onChangeText={setReportFile}
                            />
                            <View style={StyleStudy.modalNote}>
                                <Text style={StyleStudy.modaltext}>- Nộp bằng link drive</Text>
                                <Text style={StyleStudy.modaltext}>- Sinh viên có thể nộp lại chỉ cần gắn link mới và nhấn nộp thì link mới sẽ tự cập nhật</Text>
                            </View>
                            <Button mode="contained" style={StyleStudy.Button} onPress={submitReport}>
                                <Text style={{ color: '#f3e5e4', fontSize: 20, fontWeight: "bold" }}>Nộp</Text>
                            </Button>
                            <Button mode="contained" style={StyleStudy.Button} onPress={() => setModalVisible(false)}>
                                <Text style={{ color: '#f3e5e4', fontSize: 20, fontWeight: "bold" }}>Hủy</Text>
                            </Button>
                        </View>
                    </Modal>
                </Portal>
            </View>
        </Provider>
    );
};

export default Study;
