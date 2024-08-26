import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert, FlatList, ActivityIndicator, Modal, ScrollView } from "react-native";
import { Button, Icon } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { MyUserContext } from "../../../configs/Contexts";
import ListStudyStyle from "../Study/ListStudyStyle";
import CouncilStyle from "./CouncilStyle";
import { authApi, endpoints } from "../../../configs/APIs";
import moment from 'moment';

const Council = () => {
    const [thesisData, setThesisData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedThesis, setSelectedThesis] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [councilMembers, setCouncilMembers] = useState([]);
    const [councilTheses, setCouncilTheses] = useState([]);
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
                
                const response = await authApi(token).get(endpoints['Council-by-user-lecturer'](user.id));
                setThesisData(response.data);
            } catch (error) {
                Alert.alert("Lỗi", "Không thể thêm tài nguyên");
            } finally {
                setLoading(false);
            }
        };

        fetchThesisData();
    }, [user.id]);

    const handleBack = () => {
        nav.navigate('BottomNavigator');
    };

    const handleViewDetails = async (item) => {
        setSelectedThesis(item);
        setModalVisible(true);
        setModalLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await authApi(token).get(endpoints['council-members'](item.council_id));
            setCouncilMembers(response.data);
        } catch (error) {
            Alert.alert("Lỗi", "Không tải được tài nguyên");
        } finally {
            setModalLoading(false);
        }
    };
    const handleViewTheses = async (item) => {
        
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await authApi(token).get(endpoints['council-theses'](item.council_id));
            setCouncilTheses(response.data);
        } catch (error) {
            Alert.alert("Lỗi", "Không tải được tài nguyên");
        }
    };

    const renderItem = ({ item }) => (
        <View>
            <View style={ListStudyStyle.itemCouncil}>
                <Text style={ListStudyStyle.itemText}>{item.council_name}</Text>
                <Text style={ListStudyStyle.itemText}>Vị trí: {item.position}</Text>
            </View>
            <View style={ListStudyStyle.buttonCouncilDetail}>
                <Button mode="contained" style={ListStudyStyle.ButtonCouncilDetail} onPress={() => handleViewDetails(item)}>
                    Thành viên
                </Button>
                <Button mode="contained" style={ListStudyStyle.ButtonCouncilDetail} onPress={() => handleViewTheses(item)}>
                    DS khóa luận
                </Button>
            </View>
        </View>
    );


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
                <Text style={ListStudyStyle.greeting}>DANH SÁCH HỘI ĐỒNG</Text>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#f3e5e4" />
            ) : (
                <FlatList
                    contentContainerStyle={ListStudyStyle.Body}
                    data={thesisData}
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
                    <View style={CouncilStyle.modalContent}>
                        {modalLoading ? (
                            <ActivityIndicator size="large" color="#f3e5e4" />
                        ) : (
                            <ScrollView>
                                {councilMembers.map((member, index) => (
                                    <View key={index} style={CouncilStyle.modalInfo}>
                                        <Text style={ListStudyStyle.modalItemText}>{member.full_name}</Text>
                                        <Text style={ListStudyStyle.modalItemText}>{member.position}</Text>
                                    </View>
                                ))}
                                <Button mode="contained" style={ListStudyStyle.closeButton} onPress={() => setModalVisible(false)}>
                                    Đóng
                                </Button>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
            <Modal
                visible={councilTheses.length > 0} 
                transparent={true}
                animationType="slide"
                onRequestClose={() => setCouncilTheses([])}
            >
                <View style={ListStudyStyle.modalContainer}>
                    <View style={CouncilStyle.modalContent}>
                        <ScrollView>
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
                        <Button mode="contained" style={ListStudyStyle.closeButton} onPress={() => setCouncilTheses([])}>
                                Đóng
                            </Button>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Council;

