import { StyleSheet } from 'react-native';

const StyleStudy = StyleSheet.create({
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
    Body: {
        padding: 20,
        marginTop:20
    },
    item: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#da91a4',
        height: 580,
    },
    itemText: {
        fontSize: 20,
        marginBottom: 10,
    },
    itemText2: {
        fontSize: 20,
        fontWeight:'bold',
        marginBottom: 10,
        color:'#da91a4',
    },
    itemLink: {
        fontSize: 20,
        fontWeight:'bold',
        marginBottom: 10,
        color:'#da91a4',
    },
    Button: {
        margin: 20,
        marginBottom: 10,
        marginTop:10,
        backgroundColor: '#da91a4',
    },
    modalContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        height:800,
      },
    modalContent: {
        backgroundColor: 'white',
        padding: 10,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        elevation: 5,
        height: 380,
    },
    modalTitle: {
        color: 'grey',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign:'center',
    },
    modalInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingLeft: 15,
        paddingRight: 15,
        maxHeight: 40,
        marginTop: 20,
        marginBottom:20,
    },
    modalNote: {
        borderWidth: 1,
        borderRadius: 15,
        borderColor:  '#da91a4',
        margin: 5,
        padding: 15,
        marginBottom:20,
    },
    modaltext: {
        color: 'black',
        fontSize: 16,
    },
    noDataText: {
        color: 'grey',
        fontSize: 25,
        fontWeight: 'bold',
        alignSelf: 'center'
        
    },
});

export default StyleStudy;
