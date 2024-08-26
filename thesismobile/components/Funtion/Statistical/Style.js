import { StyleSheet } from 'react-native';


const StatisticalStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3e5e4',
    },
    Square: {
        height: 150,
        backgroundColor: '#da91a4',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
    },
    Logo: {
        width: 100,
        height: 100,
    },
    TopBackGround: {
        height: 60,
        backgroundColor: '#da91a4',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: 20,
        bottom: 70,
    },
    greeting: {
        fontSize: 23,
        color: '#f3e5e4',
        fontWeight: 'bold',
    },
    tableContainer: {
        borderWidth: 1,
        borderColor: '#da91a4',
        borderRadius: 5,
        marginBottom: 30,
        marginTop:10,
        margin: 10,
        height:200,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#da91a4',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#da91a4',
    },
    columnHeader: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        color: '#f3e5e4',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
    },
    chartContainer2: {
        borderWidth: 1,
        borderColor:'#da91a4',
        width: '95%',
        height:'40%',
        marginLeft: 10,
    },
    chart: {
        alignSelf: 'center',
        borderWidth: 1,
        borderColor:'#da91a4',
    },
    chart2: {
        alignSelf: 'center',
        paddingRight: 540,
    },
    textchart: {
        alignSelf: 'center',
        color: 'black',
        fontSize: 15,
        marginTop: 10,
        textAlign:'center',
    },
    radioContainer: {
        marginTop: 20,
        marginLeft:10,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendContainer: {
       // flexDirection: 'row',
       // flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
        marginBottom: 10,
    },
    legendColorBox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 8,
    },
    legendText: {
        fontSize: 14,
    },
})

export default StatisticalStyle;
