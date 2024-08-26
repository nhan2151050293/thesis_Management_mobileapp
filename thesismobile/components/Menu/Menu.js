import React, { useContext } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import {  List } from "react-native-paper";
import {  MyUserContext } from "../../configs/Contexts";
import Style from "./Style";
import { useNavigation } from '@react-navigation/native';

const Menu = () => {
    const user = useContext(MyUserContext);
    const nav = useNavigation();
    const [expandedAccordion, setExpandedAccordion] = React.useState(null);

    const handleItemPressStudy = () => {
        nav.navigate('Study');
    };

    const handleItemPressCouncil= () => {
        nav.navigate('Council');
    };

    const handleItemPressListStudy= () => {
        nav.navigate('ListStudy');
    };

    const handleItemPressManagerStudy= () => {
        nav.navigate('ManagerStudy');
    };
    
    const handleItemPressLecturer= () => {
        nav.navigate('Lecturers');
    };

    const handleItemPressStudents= () => {
        nav.navigate('Students');
    };

    const handleItemPressMenuCouncils= () => {
        nav.navigate('MenuCouncil');
    };

    const handleItemPressCriterias= () => {
        nav.navigate('Criterias');
    };

    const handleItemPressCore= () => {
        nav.navigate('Score');
    };

    const handleStatistical= () => {
        nav.navigate('Statistical');
    };
    
    const handleAccordionPress = (accordionId) => {
        setExpandedAccordion(expandedAccordion === accordionId ? null : accordionId);
    };

    return (
            <View style={Style.container}>
                <View style={Style.TopBackGround}>
                    <Text style={Style.greeting}>CHỨC NĂNG</Text>
                </View>
                <View style={Style.ListBanner}>
                    <Image
                        style={Style.banner}
                        source={{uri: 'https://res.cloudinary.com/dkmurrwq5/image/upload/v1716607536/banner1.png'}}
                    />
                    <Image
                        style={Style.banner}
                        source={{uri: 'https://res.cloudinary.com/dkmurrwq5/image/upload/v1716607535/banner2.png'}}
                     />
                </View>
                {user.role === "ministry" && (
                    <ScrollView style={Style.ListAccordionGroup}>
                        <List.AccordionGroup expandedId={expandedAccordion} onAccordionPress={handleAccordionPress}>
                            <View style={Style.AccordionContainer}>
                                <List.Accordion
                                    title="QUẢN LÍ" id="1"
                                    style={Style.Accordion}
                                    titleStyle={{ color: expandedAccordion === "1" ? 'grey' : '#f3e5e4', fontWeight: 'bold' }}
                                
                                >
                                    <List.Item title="Quản lí khóa luận" titleStyle={Style.Item} onPress={handleItemPressManagerStudy}/>
                                    <List.Item title="Quản lí hội đồng" titleStyle={Style.Item} onPress={handleItemPressMenuCouncils}/>
                                </List.Accordion>
                            </View>
                            <View style={Style.AccordionContainer}>
                                <List.Accordion title="THỐNG KÊ" id="2" style={Style.Accordion} titleStyle={{ color: expandedAccordion === "2" ? 'grey' : '#f3e5e4', fontWeight: 'bold' }}>
                                    <List.Item title="Thống kê điểm" titleStyle={Style.Item} onPress={handleStatistical}/>
                                </List.Accordion>
                            </View>
                            <View style={Style.AccordionContainer}>
                                <List.Accordion title="DANH SÁCH" id="3" style={Style.Accordion} titleStyle={{ color: expandedAccordion === "3" ? 'grey' : '#f3e5e4', fontWeight: 'bold' }}>
                                <List.Item title="Danh sách giảng viên" titleStyle={Style.Item} onPress={handleItemPressLecturer} />
                                    <List.Item title="Danh sách sinh viên" titleStyle={Style.Item} onPress={handleItemPressStudents} />
                                </List.Accordion>
                            </View>
                            <View style={Style.AccordionContainer}>
                                <List.Accordion title="TIÊU CHÍ" id="4" style={Style.Accordion} titleStyle={{ color: expandedAccordion === "4" ? 'grey' : '#f3e5e4', fontWeight: 'bold' }}>
                                    <List.Item title="List tiêu chí" titleStyle={Style.Item} onPress={handleItemPressCriterias}/> 
                                </List.Accordion>
                            </View>
                        </List.AccordionGroup>
                    </ScrollView >
            )}
             {user.role === "lecturer" && (
                     <ScrollView style={Style.ListAccordionGroup}>
                     <List.AccordionGroup expandedId={expandedAccordion} onAccordionPress={handleAccordionPress}>
                         <View style={Style.AccordionContainer}>
                             <List.Accordion
                                 title="ĐIỂM" id="1"
                                 style={Style.Accordion}
                                 titleStyle={{ color: expandedAccordion === "1" ? 'grey' : '#f3e5e4', fontWeight: 'bold' }}
                             
                             >
                                 <List.Item title="Chấm điểm khóa luận" titleStyle={Style.Item} onPress={handleItemPressCore}/>
                             </List.Accordion>
                         </View>
                         <View style={Style.AccordionContainer}>
                             <List.Accordion title="DANH SÁCH" id="2" style={Style.Accordion} titleStyle={{ color: expandedAccordion === "2" ? 'grey' : '#f3e5e4', fontWeight: 'bold' }}>
                                <List.Item title="Danh sách hội đồng tham gia" titleStyle={Style.Item} onPress={handleItemPressCouncil}/>
                                <List.Item title="Danh sách khóa luận" titleStyle={Style.Item} onPress={handleItemPressListStudy}/>
                             </List.Accordion>
                         </View>
                     </List.AccordionGroup>
                 </ScrollView >
            )}
            {user.role === "student" && (
                      <ScrollView style={Style.ListAccordionGroup}>
                      <List.AccordionGroup expandedId={expandedAccordion} onAccordionPress={handleAccordionPress}>
                          <View style={Style.AccordionContainer}>
                              <List.Accordion
                                  title="KHÓA LUẬN" id="1"
                                  style={Style.Accordion}
                                  titleStyle={{ color: expandedAccordion === "1" ? 'grey' : '#f3e5e4', fontWeight: 'bold' }}
                              
                              >
                                <List.Item title="Thông tin" titleStyle={Style.Item} onPress={handleItemPressStudy}/>
                              </List.Accordion>
                          </View>
                          <View style={Style.AccordionContainer}>
                              <List.Accordion title="BÁO CÁO" id="2" style={Style.Accordion} titleStyle={{ color: expandedAccordion === "2" ? 'grey' : '#f3e5e4', fontWeight: 'bold' }}>
                                  <List.Item title="Nộp file" titleStyle={Style.Item} onPress={handleItemPressStudy}/>
                              </List.Accordion>
                          </View>
                      </List.AccordionGroup>
                  </ScrollView >
                )}
        </View>
        );
    }

export default Menu;