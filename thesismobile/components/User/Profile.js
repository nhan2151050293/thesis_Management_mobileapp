import React, { useContext, useState,useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Alert, TextInput, Modal} from "react-native";
import { Button, Icon } from "react-native-paper";
import { MyDispatchContext, MyUserContext } from "../../configs/Contexts";
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIs, { authApi, endpoints } from "../../configs/APIs";
import StylePrF from "./StylePrF";
import moment from 'moment';


const Profile = () => {
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);
    const nav = useNavigation();
    const [avatar, setAvatar] = useState(user.avatar);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [avatarModalVisible, setAvatarModalVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [visible, setVisible] = React.useState(false);
    const [visible2, setVisible2] = React.useState(false);
    const [visible3, setVisible3] = React.useState(false);

  useEffect(() => {
        const fetchUserData = async () => {
            const username = await AsyncStorage.getItem("username");
            const password = await AsyncStorage.getItem("password");
            setUsername(username || "");
            setPassword(password || "");
        };

        fetchUserData();
    }, []); 

    const handleLogout = () => {

        AsyncStorage.removeItem("username");
        AsyncStorage.removeItem("password");
        dispatch({ type: "logout" });
        nav.navigate('Login');
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            const localUri = result.assets[0].uri;
            setAvatar(localUri);
            uploadAvatar(localUri);
        }
    };

    const uploadAvatar = async (uri) => {
        const formData = new FormData();
        formData.append('avatar', {
            uri,
            name: 'avatar.jpg',
            type: 'image/jpeg'
        });

        try {
            const token = await AsyncStorage.getItem("token");
            const api = authApi(token);
            const response = await api.patch(endpoints['current-user'], formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                setAvatar(response.data.avatar);
                Alert.alert('Thông báo', 'Cập nhật Avatar thành công');
            } else {
                Alert.alert('Lỗi', 'Cập nhật Avatar không thành công');
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Cập nhật ảnh không thành công');
        }
    };
    
    const handleChangePassword = async () => {
        if (oldPassword === "" || newPassword === "" || confirmPassword === "" ) {
            Alert.alert('Error', 'Vui lòng nhập đủ nội dung');
            return;
        }

        if (oldPassword !== pw) {
            Alert.alert('Lỗi', 'Mật khẩu cũ không đúng');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Lỗi', 'Mật khẩu mới với xác nhận mật khẩu không khớp');
            return;
        }

        const formData = new FormData();
        formData.append('password', newPassword); 
     
        try {
            const token = await AsyncStorage.getItem("token");
            const api = authApi(token);
            const response = await api.patch(endpoints['current-user'], formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                Alert.alert('Thông báo', 'Mật khẩu đã được đổi');
                pw = newPassword;
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setModalVisible(false);
            } else {
                Alert.alert('Lỗi', 'Đổi mật khẩu không thành công');
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Có lỗi trong quá trình đổi mật khẩu');
        }
    };

    const dateInput = user.role === 'student' ? user.student.birthday : 
                 user.role === 'lecturer' ? user.lecturer.birthday :
                 user.role === 'ministry' ? user.ministry.birthday :
                 null; 

const formattedDate = dateInput ? moment(dateInput).format('DD-MM-YYYY') : 'N/A';

    return (
        <View style={StylePrF.container}>
            <View style={StylePrF.TopBackGround}>
            <Text style={StylePrF.greeting}>PROFILE</Text>
            <TouchableOpacity onPress={() => setAvatarModalVisible(true)} style={StylePrF.avatarContainer}>
                    <Image source={{ uri: avatar }} style={StylePrF.avatar} />
                </TouchableOpacity>
            <TouchableOpacity onPress={pickImage} style={StylePrF.cameraIconContainer}>
                        <Icon source="camera" size={24} color="#f3e5e4" style={StylePrF.cameraIcon} />
            </TouchableOpacity>
             <Modal
                animationType="slide"
                transparent={true}
                visible={avatarModalVisible}
                onRequestClose={() => {
                    setAvatarModalVisible(!avatarModalVisible);
                }}
                 >
                <View style={StylePrF.modalContainer}>
                    <View style={StylePrF.modalContent}>
                        <Image source={{ uri: avatar }} style={{ width: 300, height: 300, borderRadius: 150,marginBottom:20 }} />
                        <Button icon="close" mode="contained" onPress={() => setAvatarModalVisible(false)} style={StylePrF.modalButton1}>
                        <Text style={{fontSize:15}}> Đóng</Text> 
                        </Button>
                    </View>
                </View>
                    </Modal>
            </View>
            {user.role === "student" && (
                <View style={StylePrF.ListInfo}>
                    <Text style={StylePrF.info}>Họ và tên: {user.student.full_name}</Text>
                    <Text style={StylePrF.info}>Mã SV: {user.student.code}</Text>
                    <Text style={StylePrF.info}>Ngày sinh: {formattedDate}</Text>
                    <Text style={StylePrF.info}>Giới tính: {user.gender}</Text>
                    <Text style={StylePrF.info}>SĐT: {user.phone}</Text>
                    <Text style={StylePrF.info}>Email: </Text>
                    <Text style={StylePrF.info}>{user.email}</Text>
                    <Text style={StylePrF.info}>Địa chỉ: {user.student.address}</Text>
                    <Text style={StylePrF.info}>GPA: {user.student.gpa}</Text>
                    <Text style={StylePrF.info}>Chuyên ngành: {user.student.major}</Text>
                </View>
            )}
             {user.role === "lecturer" && (
                <View style={StylePrF.ListInfo}>
                    <Text style={StylePrF.info}>Họ và tên: {user.lecturer.full_name}</Text>
                    <Text style={StylePrF.info}>Mã GV: {user.lecturer.code}</Text>
                    <Text style={StylePrF.info}>Ngày sinh: {formattedDate}</Text>
                    <Text style={StylePrF.info}>Giới tính: {user.gender}</Text>
                    <Text style={StylePrF.info}>SĐT: {user.phone}</Text>
                    <Text style={StylePrF.info}>Email: </Text>
                    <Text style={StylePrF.info}>{user.email}</Text>
                    <Text style={StylePrF.info}>Địa chỉ: {user.lecturer.address}</Text>
                    <Text style={StylePrF.info}>khoa:</Text>
                    <Text style={StylePrF.info}>{user.lecturer.faculty}</Text>
                </View>
            )}
            {user.role === "ministry" && (
                <View style={StylePrF.ListInfo}>
                    <Text style={StylePrF.info}>Họ và tên: {user.ministry.full_name}</Text>
                    <Text style={StylePrF.info}>Mã GVU: {user.ministry.code}</Text>
                    <Text style={StylePrF.info}>Ngày sinh: {formattedDate}</Text>
                    <Text style={StylePrF.info}>Giới tính: {user.gender}</Text>
                    <Text style={StylePrF.info}>SĐT: {user.phone}</Text>
                    <Text style={StylePrF.info}>Email: </Text>
                    <Text style={StylePrF.info}>{user.email}</Text>
                    <Text style={StylePrF.info}>Địa chỉ: {user.ministry.address}</Text>
                </View>
            )}
            <View style={StylePrF.buttonList}>
            <Button style={StylePrF.button} icon="key" mode="contained" onPress={() => setModalVisible(true)}>
                <Text style={StylePrF.buttonText}>Đặt lại mật khẩu</Text> 
            </Button>

            <Button style={StylePrF.button} icon="logout" mode="contained" onPress={handleLogout}>
               <Text style={StylePrF.buttonText}> Đăng xuất</Text> 
            </Button>
            </View>
            <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <View style={StylePrF.modalContainer}>
                <View style={StylePrF.modalContent}>
                    <Text style={{ fontSize: 30, marginBottom: 30, color: '#da91a4', fontWeight: 'bold' }}>Đặt lại mật khẩu</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                            style={[StylePrF.input, { flex: 1 }]}
                            secureTextEntry={visible}
                            placeholder="Mật khẩu cũ"
                            onChangeText={setOldPassword}
                            value={oldPassword}
                        />
                        <TouchableOpacity onPress={() => setVisible(!visible)} style={{position:'absolute', right:5}}>
                            <Icon
                                source={visible ? "eye" : "eye-off"}
                                color="#da91a4"
                                size={20}
                             
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                            style={[StylePrF.input, { flex: 1 }]}
                            secureTextEntry={!visible2}
                            placeholder="Mật khẩu mới"
                            onChangeText={setNewPassword}
                            value={newPassword}
                        />
                        <TouchableOpacity onPress={() => setVisible2(!visible2)} style={{position:'absolute', right:5}}>
                            <Icon
                                source={visible2 ? "eye" : "eye-off"}
                                color="#da91a4"
                                size={20}
                              
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                            style={[StylePrF.input, { flex: 1 }]}
                            secureTextEntry={!visible3}
                            placeholder="Xác nhận mật khẩu mới"
                            onChangeText={setConfirmPassword}
                            value={confirmPassword}
                        />
                        <TouchableOpacity onPress={() => setVisible3(!visible3)} style={{position:'absolute', right:5}}>
                            <Icon
                                source={visible3 ? "eye" : "eye-off"}
                                color="#da91a4"
                                size={20}
                               
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={StylePrF.modalListButton}>
                        <Button icon="check" mode="contained" onPress={handleChangePassword} style={StylePrF.modalButton1}>
                            <Text style={{ fontSize: 15 }}> Xác nhận</Text>
                        </Button>
                        <Button mode="outlined" onPress={() => setModalVisible(false)} style={StylePrF.modalButton2}>
                            <Icon name="close" color="#da91a4" size={17} />
                            <Text style={{ color: '#da91a4', fontSize: 15 }}> Hủy</Text>
                        </Button>
                    </View>
                </View>
            </View>
        </Modal>
        </View>
    );
};

export default Profile;
