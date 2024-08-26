import React, { useContext, useEffect, useState, memo } from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator, TouchableWithoutFeedback, Keyboard, RefreshControl, ScrollView, TextInput, Alert } from "react-native";
import { Icon, Modal, Searchbar, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { MyUserContext } from "../../../configs/Contexts";
import StyleStudy from "../Study/StyleStudy";
import ManagerStudyStyle from "../Manager/ManagerStudyStyle"
import APIs, { endpoints } from "../../../configs/APIs";
import moment from 'moment';
import { SelectList } from 'react-native-dropdown-select-list';

const Lecturers = () => {
    const [thesisData, setThesisData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const nav = useNavigation();
    const user = useContext(MyUserContext);
    const [selectedThesisDetail, setSelectedThesisDetail] = useState(null);



    const handleChange = (fieldName, value) => {
        setFormData({ ...formData, [fieldName]: value });
    };

    const fetchThesisData = async (page, query) => {
        if (page > 0) {
            let url = `${endpoints['lecturers']}?q=${query}&page=${page}`;
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

    const RenderItem = memo(({ item }) => (
        <View style={ManagerStudyStyle.item} key={item.id}>
            <Text style={StyleStudy.itemText}>Mã giảng viên: {item.code}</Text>
            <Text style={StyleStudy.itemText}>Họ & Tên: {item.full_name}</Text>
            <Text style={StyleStudy.itemText}>Năm sinh: {moment(item.birthday).format('DD/MM/YYYY')}</Text>
            <Text style={StyleStudy.itemText}>Quê quán: {item.address}</Text>
            <Text style={StyleStudy.itemText}>Khoa: {item.faculty}</Text>
            <View style={ManagerStudyStyle.buttonDetail}>
            </View>
        </View>
    ));
    const handleViewDetails = (item) => {
        setSelectedThesisDetail(item);
        setDetailModalVisible(true);
    };

    const { start_date, end_date } = selectedThesisDetail || {};
    const formattedStartDate = start_date ? moment(start_date).format('DD-MM-YYYY') : 'N/A';
    const formattedEndDate = end_date ? moment(end_date).format('DD-MM-YYYY') : 'N/A';

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                    <TouchableOpacity onPress={handleBack}>
                        <Icon icon="arrow-left" size={30} color="#f3e5e4" />
                    </TouchableOpacity>
                    <Text style={StyleStudy.greeting}>DANH SÁCH GIẢNG VIÊN</Text>
                </View>
                <Searchbar placeholder="Tìm kiếm theo tên giảng viên..." value={searchQuery} onChangeText={search} style={ManagerStudyStyle.Search} />
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
            </View>
        </TouchableWithoutFeedback>
    );
};

export default Lecturers;

