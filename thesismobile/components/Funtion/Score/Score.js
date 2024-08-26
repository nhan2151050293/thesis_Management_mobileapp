import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert, FlatList, ActivityIndicator, Modal, TextInput, ScrollView } from "react-native";
import { Button, Icon } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { MyUserContext } from "../../../configs/Contexts";
import ListStudyStyle from "../Study/ListStudyStyle";
import CouncilStyle from "../Council/CouncilStyle";
import StyleStudy from "../Study/StyleStudy";
import { authApi, endpoints } from "../../../configs/APIs";
import moment from 'moment';
import Style from "./Style";

const Score = () => {
    const [theses, setTheses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedThesis, setSelectedThesis] = useState(null);
    const [criteria, setCriteria] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [scores, setScores] = useState({});
    const [allScoresEntered, setAllScoresEntered] = useState(false);
    const [token, setToken] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const nav = useNavigation();
    const user = useContext(MyUserContext);
    const [editCriteria, setEditCriteria] = useState([]);
    const [editScores, setEditScores] = useState({});
    const [modalVisible2, setModalVisible2] = useState(false);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem("token");
                if (!storedToken) {
                    Alert.alert("Lỗi", "Vui lòng đăng nhập");
                    return;
                }
                setToken(storedToken);
            } catch (error) {
                Alert.alert("Lỗi", "Không thể lấy tài nguyên");
            }
        };

        fetchToken();
    }, []);

    useEffect(() => {
        const fetchTheses = async () => {
            try {
                if (!token) {
                    return;
                }

                const councilResponse = await authApi(token).get(endpoints['Council-by-user-lecturer'](user.id));
                const councils = councilResponse.data;

                let allTheses = [];

                for (const council of councils) {
                    const thesesResponse = await authApi(token).get(endpoints['council-theses'](council.council_id));
                    allTheses = [...allTheses, ...thesesResponse.data];
                }

                setTheses(allTheses);
            } catch (error) {
                Alert.alert("Lỗi", "Không thể tải tài nguyêhn");
            } finally {
                setLoading(false);
            }
        };

        fetchTheses();
    }, [user.id, token]);

    const handleBack = () => {
        nav.navigate('BottomNavigator');
    };

    const handleViewDetails = async (item) => {
        setSelectedThesis(item);

        try {
            if (!token) {
                Alert.alert("Lỗi", "Vui lòng đăng nhập");
                return;
            }
            const criteriaResponse = await authApi(token).get(endpoints['theses-criteria'](item.code));
            const fetchedCriteria = criteriaResponse.data;
            setCriteria(fetchedCriteria);
            setModalVisible(true);
        } catch (error) {
            Alert.alert("Lỗi", "Không thể tải tài nguyên");
        }
    };

    const handleScoreChange = (criteriaId, score) => {
        const criteriaIdInt = parseInt(criteriaId);
        if (isNaN(criteriaIdInt)) {
            return;
        }
        setScores(prevScores => ({
            ...prevScores,
            [criteriaIdInt]: score
        }));
    };

    useEffect(() => {
        const checkAllScoresEntered = () => {
            const allEntered = criteria.every(criterion => scores[criterion.id] !== undefined && scores[criterion.id] !== '');
            setAllScoresEntered(allEntered);
        };

        checkAllScoresEntered();
    }, [scores, criteria]);

    const addScore = async (thesisId, scoresData, token) => {
        try {
            let allSuccess = true;
            let errorMessagesSet = new Set();
            for (const scoreData of scoresData) {
                const formData = new FormData();
                const thesisCriteriaId = scoreData.thesis_criteria;
                formData.append('thesis_criteria', thesisCriteriaId);
                formData.append('score_number', scoreData.score_number);
                try {
                    const res = await authApi(token).post(endpoints['score'], formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                } catch (error) {
                    const errorMessage = JSON.stringify(error.response.data).replace(/[{}"]/g, '');
                    if (!errorMessagesSet.has(errorMessage)) {
                        errorMessagesSet.add(errorMessage);
                    }
                    allSuccess = false;
                }
            }
            if (errorMessagesSet.size > 0) {
                Alert.alert("Lỗi", Array.from(errorMessagesSet)[0]);
            }
            return allSuccess;
        } catch (error) {
            return false;
        }
    };

    const isScoreValid = (score) => {
        const parsedScore = parseFloat(score); 
        return !isNaN(parsedScore) && parsedScore >= 0 && parsedScore <= 10;
    };
    
    
    const handleSubmitScores = async () => {
        try {
            const formDataArray = criteria.map(criterion => ({
                thesis_criteria: criterion.id,
                score_number: scores[criterion.id] || 0
            }));
    
            const allScoresValid = formDataArray.every(formData => isScoreValid(formData.score_number));
    
            if (allScoresValid && token) {
                const success = await addScore(selectedThesis.id, formDataArray, token);
                if (success) {
                    Alert.alert("Thông báo", "Tất cả điểm được thêm thành công");
                    setModalVisible(false);
                }
            } else {
                Alert.alert("Lỗi", "Vui lòng nhập điểm từ 0 đến 10.");
            }
        } catch (error) {
        }
    };
    
    const handleEditDetails = async (item) => {
        setSelectedThesis(item);
        try {
            if (!token) {
                Alert.alert("Lỗi", "Vui lòng đăng nhập");
                return;
            }
            const criteriaResponse = await authApi(token).get(endpoints['these_lecturer-scores'](item.code));
            const fetchedCriteria = criteriaResponse.data;
            setEditCriteria(fetchedCriteria);
            setEditModalVisible(true);
        } catch (error) {
            Alert.alert("Lỗi", "Không thể tải tài nguyên");
        }
    };

    const handleEditScoreChange = (criteriaId, score) => {
        const criteriaIdInt = parseInt(criteriaId);
        if (isNaN(criteriaIdInt)) {
            return;
        }
        setEditScores(prevScores => ({
            ...prevScores,
            [criteriaIdInt]: score
        }));
    };

    const editScore = async (scoresData, token) => {
        try {
            let allSuccess = true;
            let errorMessagesSet = new Set();
    
            for (const scoreData of scoresData) {
                const formData = new FormData();
                const scoreId = scoreData.id;
                formData.append('score_number', scoreData.score_number);
    
                try {
                    const res = await authApi(token).patch(endpoints['score_id'](scoreId), formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                } catch (error) {
                    const errorMessage = JSON.stringify(error.response.data).replace(/[{}"]/g, '');
                    if (!errorMessagesSet.has(errorMessage)) {
                        errorMessagesSet.add(errorMessage);
                    }
                    allSuccess = false;
                }
            }
    
            if (errorMessagesSet.size > 0) {
                Alert.alert("Lỗi", Array.from(errorMessagesSet)[0]);
            }
    
            return allSuccess;
        } catch (error) {
            return false;
        }
    };
    
    const handleSubmitEditScores = async () => {
        try {
            const formDataArray = editCriteria
                .filter(item => editScores[item.id] !== undefined && editScores[item.id] !== item.score_number)
                .map(item => ({
                    id: item.id,
                    score_number: editScores[item.id]
                }));
    
            if (formDataArray.length === 0) {
                Alert.alert("Thông báo", "Không có điểm nào được thay đổi.");
                return;
            }
    
            if (token) {
                const success = await editScore(formDataArray, token);
                if (success) {
                    Alert.alert("Thông báo", "Điểm sửa thành công.");
                    setEditModalVisible(false);
                }
            }
        } catch (error) {
            Alert.alert("Lỗi", "Vui lòng thử lại");
        }
    };
    
    const handleViewDetails2 = (item) => {
        setSelectedThesis(item);
        setModalVisible2(true);
    };

    const renderItem = ({ item }) => (
        <View style={CouncilStyle.modalInfo}>
            <Text style={ListStudyStyle.modalItemText}>Mã: {item.code}</Text>
            <Text style={ListStudyStyle.modalItemText}>Tên: {item.name}</Text>
            <Text style={ListStudyStyle.modalItemText}>Ngày bắt đầu: {moment(item.start_date).format('DD-MM-YYYY')}</Text>
            <Text style={ListStudyStyle.modalItemText}>Ngày kết thúc: {moment(item.end_date).format('DD-MM-YYYY')}</Text>
            <Text style={ListStudyStyle.modalItemText}>Khoa: {item.major}</Text>
            <Button mode="contained" style={ListStudyStyle.closeButton} onPress={() => handleViewDetails2(item)}>
                    Xem Chi Tiết
                </Button>
            <View style={{ flexDirection: 'row' }}>
                <Button mode="contained" style={ListStudyStyle.ButtonCouncilDetail} onPress={() => handleViewDetails(item)}>
                    Chấm điểm
                </Button>
                <Button mode="contained" style={ListStudyStyle.ButtonCouncilDetail} onPress={() => handleEditDetails(item)}>
                    Sửa điểm
                </Button>
            </View>
        </View>
    );

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
            {loading ? (
                <ActivityIndicator size="large" color="#f3e5e4" />
            ) : (
                <FlatList
                    contentContainerStyle={ListStudyStyle.Body}
                    data={theses}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                />
            )}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={Style.modalContainer}>
                    <View style={Style.modalContent}>
                        <Text style={Style.modalTitle}>Tiêu chí của khóa luận</Text>
                        <FlatList
                            data={criteria}
                            renderItem={({ item }) => (
                                <View>
                                    <Text style={Style.modalItemText}>{item.criteria.name}</Text>
                                    <Text style={Style.modalItemText2}>{item.criteria.evaluation_method}</Text>
                                    <TextInput
                                        style={Style.inputScore}
                                        placeholder="Nhập điểm 1-10"
                                        keyboardType="numeric"
                                        onChangeText={(text) => handleScoreChange(item.id, text)}
                                    />
                                </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        {allScoresEntered && (
                            <Button mode="contained" style={ListStudyStyle.ButtonCouncilDetail} onPress={handleSubmitScores}>Chấm điểm</Button>
                        )}
                        <Button mode="contained" style={ListStudyStyle.ButtonCouncilDetail} onPress={() => setModalVisible(false)}>Đóng</Button>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={editModalVisible}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={Style.modalContainer}>
                    <View style={Style.modalContent}>
                        <Text style={Style.modalTitle}>Sửa điểm tiêu chí của khóa luận</Text>
                        <FlatList
                            data={editCriteria}
                            renderItem={({ item }) => (
                                <View>
                                    <Text style={Style.modalItemText}>{item.criteria_name}</Text>
                                    <Text style={Style.modalItemText2}>{item.evaluation_method}</Text>
                                    <Text style={Style.modalItemText2}>Điểm: {item.score_number}</Text>
                                    <TextInput
                                        style={Style.inputScore}
                                        placeholder="Nhập điểm mới: "
                                        keyboardType="numeric"
                                        onChangeText={(text) => handleEditScoreChange(item.id, text)} 
                                    />
                                </View>
                            )}
                            keyExtractor={(item, index) => item.id.toString()}
                        />

                        <Button mode="contained" style={ListStudyStyle.ButtonCouncilDetail} onPress={handleSubmitEditScores}>Sửa điểm</Button>
                        <Button mode="contained" style={ListStudyStyle.ButtonCouncilDetail} onPress={() => setEditModalVisible(false)}>Đóng</Button>
                    </View>
                </View>
            </Modal>
            <Modal
                visible={modalVisible2}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible2(false)}
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
                                    <Button mode="contained" style={ListStudyStyle.closeButton} onPress={() => setModalVisible2(false)}>
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

export default Score;
