import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, ScrollView, TextInput } from "react-native";
import { MyUserContext } from "../../configs/Contexts";
import ContactListStyle from "./Style";
import APIs, { endpoints } from "../../configs/APIs";
import { useNavigation } from '@react-navigation/native';

const ContactList = () => {
    const [theses, setTheses] = useState([]);
    const [filteredTheses, setFilteredTheses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isStudent, setIsStudent] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const user = useContext(MyUserContext);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchTheses = async () => {
            setLoading(true);
            try {
                let response;
                if (user.role === 'student') {
                    if (user.student && user.student.thesis) {
                        response = await APIs.get(endpoints['thesis-by-user-student'](user.student.thesis));
                        if (response.data && !Array.isArray(response.data)) {
                            response.data = [response.data];
                        }
                    } else {
                        setLoading(false);
                        return;
                    }
                } else {
                    response = await APIs.get(endpoints['thesis-by-user-lecturer'](user.id));
                }

                if (response.data && Array.isArray(response.data)) {
                    setTheses(response.data);
                    setFilteredTheses(response.data); 
                } else {
                    setTheses([]);
                    setFilteredTheses([]); 
                }
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        fetchTheses();
    }, [user.role, user.id, user.student]);

    useEffect(() => {
        setIsStudent(user.role === 'student');
    }, [user.role]);

    useEffect(() => {
        if (searchQuery === "") {
            setFilteredTheses(theses);
        } else {
            setFilteredTheses(
                theses.filter(item =>
                    item.code.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }
    }, [searchQuery, theses]);

    const handleChat = (item) => {
        navigation.navigate('Chat', { thesesCode: item.code });
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#da91a4" />;
    }

    if (theses.length === 0) {
        return (
            <View style={ContactListStyle.container}>
                <View style={ContactListStyle.TopBackGround}>
                    <Text style={ContactListStyle.greeting}>CHAT</Text>
                </View>
                <Text style={ContactListStyle.noDataText}>Chưa có đoạn hội thoại nào.</Text>
            </View>
        );
    }

    return (
        <View style={ContactListStyle.container}>
            <View style={ContactListStyle.TopBackGround}>
                <Text style={ContactListStyle.greeting}>CHAT</Text>
            </View>
            <TextInput
                style={ContactListStyle.searchInput}
                placeholder="Tìm kiếm nhóm..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <FlatList
                data={filteredTheses}
                keyExtractor={(item) => item.code || item.id}
                renderItem={({ item }) => {
                    if (!item) {
                        return null;
                    }

                    return (
                        <ScrollView>
                            <View style={ContactListStyle.chat}>
                                <TouchableOpacity
                                    style={ContactListStyle.contactItem}
                                    onPress={() => handleChat(item)}
                                >
                                    <Text style={ContactListStyle.contactName}>Group {item.code}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    );
                }}
            />
        </View>
    );
};

export default ContactList;
