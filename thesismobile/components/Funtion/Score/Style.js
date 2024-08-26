import { StyleSheet } from 'react-native';

const Style = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',

    },
    modalContent: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        elevation: 5,
        alignItems: 'center',
        height: '80%',
        width:'80%'
    },
    modalItemText: {
        fontSize: 20,
        textAlign: 'center',
        backgroundColor:'#da91a4',
        color:'#f3e5e4'
    },
    modalItemText2: {
        fontSize: 18,
        textAlign: 'center',
        borderWidth: 1,
        borderTopWidth:0,
        borderColor: '#da91a4',
        color:'grey'
    },
    inputScore: {
        fontSize: 18,
        borderColor: '#da91a4',
        color: 'grey',
        margin: 10,
        borderBottomWidth: 1,
        marginLeft:0
    },
    modalTitle:{
        fontSize: 25,
        fontWeight: 'bold',
        color:'#da91a4',
        marginBottom: 8,
        textAlign: 'center'
    },
});

export default Style;
