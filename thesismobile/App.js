import React, { useReducer, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MyDispatchContext, MyUserContext } from './configs/Contexts';
import { MyUserReducer } from './configs/Reducers';
//import { firebase } from './configs/Firebase'; // Import your firebase config
import Login from './components/User/Login';
import BottomNavigator from './Navigator/BottomNavigator';
import Study from './components/Funtion/Study/Study';
import Council from './components/Funtion/Council/Council';
import ListStudy from './components/Funtion/Study/ListStudy';
import ManagerStudy from './components/Funtion/Manager/ManagerStudy';
import Lecturers from './components/Funtion/List/Lecturers';
import Students from './components/Funtion/List/Students';
import MenuCouncil from './components/Funtion/Manager/ManagerCouncil';
import Criterias from './components/Funtion/Criterias/Criterias';
import Score from './components/Funtion/Score/Score';
import Profile from './components/User/Profile';
import Statistical from './components/Funtion/Statistical/Statistical';
import Chat from './components/Chat/Chat';
import ContactList from './components/Chat/ContactList';

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name='Login' component={Login}  />
      <Stack.Screen name='BottomNavigator' component={BottomNavigator}  />
      <Stack.Screen name='Study' component={Study} />
      <Stack.Screen name='Council' component={Council} />
      <Stack.Screen name='ListStudy' component={ListStudy} />
      <Stack.Screen name='ManagerStudy' component={ManagerStudy} />
      <Stack.Screen name='Lecturers' component={Lecturers} />
      <Stack.Screen name='Students' component={Students} />
      <Stack.Screen name='MenuCouncil' component={MenuCouncil} />
      <Stack.Screen name='Criterias' component={Criterias} />
      <Stack.Screen name='Score' component={Score} />
      <Stack.Screen name='Profile' component={Profile} />
      <Stack.Screen name='Statistical' component={Statistical} />
      <Stack.Screen name='Chat' component={Chat} />
      <Stack.Screen name='ContactList' component={ContactList} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [user, dispatch] = useReducer(MyUserReducer, null);

  return (
    <NavigationContainer>
      <MyUserContext.Provider value={user}>
        <MyDispatchContext.Provider value={dispatch}>
          <MyStack />
        </MyDispatchContext.Provider>
      </MyUserContext.Provider>
    </NavigationContainer>
  );
}
