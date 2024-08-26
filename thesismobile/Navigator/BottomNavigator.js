import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-paper";
import Profile from "../components/User/Profile";
import Home from "../components/Home/Home";
import Menu from "../components/Menu/Menu";
import ContactList from "../components/Chat/ContactList";
import { MyUserContext } from "../configs/Contexts";

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
    const user = useContext(MyUserContext);

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarActiveBackgroundColor: '#da91a4',
                tabBarInactiveBackgroundColor: '#daafb6'
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon source="home" color={'#f3e5e4'} size={30} />
                    ),
                }}
            />
                <Tab.Screen
                    name="ContactList"
                    component={ContactList}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Icon source="chat" color={'#f3e5e4'} size={30} />
                        ),
                    }}
                />
            <Tab.Screen
                name="Menu"
                component={Menu}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon source="menu" color={'#f3e5e4'} size={30} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon source="account-circle-outline" color={'#f3e5e4'} size={30} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default BottomNavigator;
