import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Dimensions, ScrollView } from "react-native";
import { Icon, RadioButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Style from './Style';
import APIs, { endpoints } from "../../../configs/APIs";
import { BarChart, PieChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Statistical = () => {
    const nav = useNavigation();
    const [avgScores, setAvgScores] = useState([]);
    const [theses, setThese] = useState([]);
    const [selectedView, setSelectedView] = useState('avgScores'); 
    const [thesesChartData, setThesesChartData] = useState([]);

    const fetchData = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await APIs.get(endpoints.stats,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }

            });
            if (response.status === 200) {
                setAvgScores(response.data.avg_score_by_school_year);
                setThese(response.data.thesis_major_count);

                const chartData = response.data.thesis_major_count.map(item => ({
                    name: item.major_name,
                    count: item.thesis_count,
                    color: generateRandomColor()
                }));
                setThesesChartData(chartData);
            } else {
            }
        } catch (error) {
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleBack = () => {
        nav.navigate('BottomNavigator');
    };

    const chartConfig = {
        backgroundGradientFrom: "#f3e5e4",
        backgroundGradientTo: "#f3e5e4",
        color: () => '#da91a4',
        strokeWidth: 2,
    };

    const generateRandomColor = () => {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        return `#${randomColor.padStart(6, '0')}`; 
    };

    const toggleView = (value) => {
        setSelectedView(value);
    };

    return (
        <View style={Style.container}>
            <View style={Style.Square}>
                <TouchableOpacity style={Style.backButton} onPress={handleBack}>
                    <Icon source="arrow-left" color="#f3e5e4" size={30} />
                </TouchableOpacity>
                <Image
                    style={Style.Logo}
                    source={{ uri: 'https://res.cloudinary.com/dkmurrwq5/image/upload/v1714062975/logo_kl.png' }}
                />
            </View>
            <View style={Style.TopBackGround}>
                <Text style={Style.greeting}>THỐNG KÊ</Text>
            </View>
            <View style={Style.radioContainer}>
                <View style={Style.radioButton}>
                    <RadioButton
                        value="avgScores"
                        status={selectedView === 'avgScores' ? 'checked' : 'unchecked'}
                        onPress={() => toggleView('avgScores')}
                        color="#da91a4"
                        uncheckedColor="#da91a4"
                    />
                    <Text style={[Style.radioText, selectedView === 'avgScores' && Style.selectedText]}>Điểm khóa luận qua từng năm</Text>
                </View>
                <View style={Style.radioButton}>
                    <RadioButton
                        value="theses"
                        status={selectedView === 'theses' ? 'checked' : 'unchecked'}
                        onPress={() => toggleView('theses')}
                        color="#da91a4"
                        uncheckedColor="#da91a4"
                    />
                    <Text style={[Style.radioText, selectedView === 'theses' && Style.selectedText]}>Tần xuất tham gia làm khóa luận của từng ngành</Text>
                </View>
            </View>
            {selectedView === 'avgScores' ? (
                <View>
                    <View style={Style.tableContainer}>
                        <View style={Style.tableHeader}>
                            <Text style={Style.columnHeader}>Năm học</Text>
                            <Text style={Style.columnHeader}>Điểm trung bình</Text>
                        </View>
                        {avgScores.map((item, index) => (
                            <View key={index} style={Style.tableRow}>
                                <Text style={Style.tableCell}>{item.start_year} - {item.end_year} </Text>
                                <Text style={Style.tableCell}>{item.avg_score}</Text>
                            </View>
                        ))}
                    </View>
                    <View style={Style.chartContainer}>
                        <BarChart
                            data={{
                                labels: avgScores.map(item => `${item.start_year}-${item.end_year}`),
                                datasets: [{
                                    data: avgScores.map(item => item.avg_score)
                                }]
                            }}
                            width={Dimensions.get('window').width - 20}
                            height={270}
                            chartConfig={chartConfig}
                            bezier
                            style={Style.chart}
                        />
                    </View>
                    <Text style={Style.textchart}>Biểu đồ thống kê điểm trung bình qua từng năm</Text>
                </View>
            ) : (
                <View>
                    <View style={Style.tableContainer}>
                        <ScrollView>
                            <View style={Style.tableHeader}>
                                <Text style={Style.columnHeader}>Ngành học</Text>
                                <Text style={Style.columnHeader}>Số khóa luận</Text>
                            </View>
                            {theses.map((item, index) => (
                                <View key={index} style={Style.tableRow}>
                                    <Text style={Style.tableCell}>{item.major_name}</Text>
                                    <Text style={Style.tableCell}>{item.thesis_count}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                    <View style={Style.chartContainer2}>
                        <ScrollView horizontal={false}>
                            <PieChart
                                data={thesesChartData}
                                width={Dimensions.get('window').width}
                                height={300}
                                chartConfig={chartConfig}
                                accessor="count"
                                backgroundColor="transparent"
                                style={Style.chart2}
                                paddingLeft="170"
                            />
                            <View style={Style.legendContainer}>
                                {thesesChartData.map((item, index) => (
                                    <View key={index} style={Style.legendItem}>
                                        <View style={[Style.legendColorBox, { backgroundColor: item.color }]} />
                                        <Text style={Style.legendText}>{item.name} - {item.count}</Text>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                    <Text style={Style.textchart}>Biểu đồ thống kê tần xuất tham gia làm khóa luận của từng ngành</Text>
                </View>
            )}
        </View>
    );
};

export default Statistical;
