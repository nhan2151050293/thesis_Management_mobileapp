import React, { useContext, useEffect } from "react";
import { View, Text, Keyboard, Image, TouchableOpacity, TouchableWithoutFeedback, Alert } from "react-native";
import { Button, TextInput } from "react-native-paper";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MyDispatchContext } from "../../configs/Contexts";
import Style from "./Style";

const Login = () => {
    const [user, setUser] = React.useState({});
    const [visible, setVisible] = React.useState(false);
    const [error, setError] = React.useState("");
    const [isInfoEntered, setIsInfoEntered] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const nav = useNavigation();
    const dispatch = useContext(MyDispatchContext);

    const fields = [{
        "label": "Tên đăng nhập",
        "icon": "account",
        "name": "username"
    }, {
        "label": "Mật khẩu",
        "icon": !visible ? "eye-off" : "eye",
        "name": "password",
        "secureTextEntry": !visible,
    }];

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                try {
                    let user = await authApi(token).get(endpoints['current-user']);
                    dispatch({
                        'type': "login",
                        'payload': user.data
                    });
                    nav.navigate('BottomNavigator');
                } catch (error) {
                }
            }
        };
        checkLoginStatus();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            setUser({});
            setError("");
            setIsInfoEntered(false);
        }, [])
    );

    const updateState = (field, value) => {
        setUser(current => ({
            ...current,
            [field]: value
        }));
    }

    const login = async () => {
        setLoading(true);
        try {
            if (!isInfoEntered) {
                throw new Error("Vui lòng nhập đầy đủ thông tin đăng nhập");
            }
            let res = await APIs.post(endpoints['login'], {
                ...user,
                'client_id': 'dgUWVUFcjUa5a96UG1EThst7K2akAWfMDcZKjSOt',
                'client_secret': 'YhpIccJIWQUVwDqAAoAWbKOOlCwieC1ZURuov8i7HB0bKos6KMLt9ku5ZquXZhiOxJ1LM4gQSJRxwBcSjnyRY7mpiOxXX9b3JOr0TMeigyXD7ZpEz82o5z96qWWH5TH3',
                'grant_type': 'password'
            });
            pw=user.password
            await AsyncStorage.setItem("token", res.data.access_token);

            setTimeout(async () => {
                let user = await authApi(res.data.access_token).get(endpoints['current-user']);
                nav.navigate('BottomNavigator');
                dispatch({
                    'type': "login",
                    'payload': user.data
                });
            }, 100);
        } catch (ex) {
            if (ex.message === "Vui lòng nhập đầy đủ thông tin đăng nhập") {
                Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin đăng nhập');
            } else {
                Alert.alert('Thông báo', 'Tên đăng nhập hoặc mật khẩu không đúng!');
            }
            setError(ex.message);
        } finally {
            setLoading(false);
        }
    }

    const onFieldChange = (field, value) => {
        updateState(field, value);
        if (value.trim() !== "") {
            setIsInfoEntered(true);
        } else {
            setIsInfoEntered(false);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={Style.container}>
                <View style={Style.Square}>
                    <Image
                        style={Style.Logo}
                        source={{ uri: 'https://res.cloudinary.com/dkmurrwq5/image/upload/v1714062975/logo_kl.png' }}
                    />
                </View>
                <View style={Style.Body}>
                    <Text style={Style.Text}>LOGIN</Text>
                    {fields.map(c =>
                        <TextInput
                            secureTextEntry={c.secureTextEntry}
                            value={user[c.name]}
                            style={Style.Input}
                            onChangeText={(t) => onFieldChange(c.name, t)}
                            key={c.name}
                            label={c.label}
                            right={<TextInput.Icon icon={c.icon} color="#f3e5e4" onPress={() => {
                                if (c.name === 'password') {
                                    setVisible(!visible);
                                }
                            }} />}
                            error={!isInfoEntered && error ? error : null}
                        />
                    )}
                </View>
                <Button loading={loading} mode="contained" style={Style.Login} onPress={login}>
                    {!loading && (
                        <Text style={{ color: '#da91a4', fontSize: 20, fontWeight: "bold" }}>Đăng Nhập</Text>
                    )}
                </Button>
                <View style={Style.Forgot}>
                        <Text style={{ color: '#f3e5e4'}}>Quên mật khẩu vui lòng liên hệ với Admin</Text>
                </View>
                <View style={Style.TOR}>
                    <View style={{ flex: 1, height: 1, backgroundColor: "white" }} />
                    <View>
                        <Text style={{ width: 50, textAlign: "center", color: 'white' }}>OR</Text>
                    </View>
                    <View style={{ flex: 1, height: 1, backgroundColor: "white" }} />
                </View>
                <View style={Style.OR}>
                    <TouchableOpacity>
                        <Image
                            style={{ height: 50, width: 50, marginRight: 100 }}
                            source={{ uri: 'https://res.cloudinary.com/dkmurrwq5/image/upload/v1714062975/logo_fb.png' }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image
                            style={{ height: 50, width: 50 }}
                            source={{ uri: 'https://res.cloudinary.com/dkmurrwq5/image/upload/v1714062975/logo_gg.png' }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

export default Login;
