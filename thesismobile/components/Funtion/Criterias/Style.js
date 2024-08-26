import { StyleSheet } from 'react-native';

const CriteriaStyle = StyleSheet.create({
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
        height: 150,
        margin:20,
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
    modalContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        height: '100%',
        justifyContent: 'center',
    },
    modalItemText: {
        fontSize: 20,
        fontWeight: "bold",
        alignSelf: 'center',
        color: '#f3e5e4',
        textAlign: 'center'
    },
    modalTextInput: {
        borderWidth: 1,
        borderColor: '#da91a4',
        alignSelf: 'center',
        width: 250,
        marginBottom: 20,
        padding: 5
    },
    modalTextInput2: {
        borderWidth: 1,
        borderColor: '#da91a4',
        alignSelf: 'center',
        width: 250,
        height:55,
        marginBottom: 20,
        alignContent: 'center'
    },
    itemID: {
        fontSize: 20,
        fontWeight:'bold',
        marginBottom: 10,
        position: 'absolute',
        right:0,
        top: 0,
        padding:5,
        backgroundColor: '#da91a4',
        color: '#f3e5e4',
        borderBottomLeftRadius:5,
    },
    Button: {
        margin: 20,
        backgroundColor: '#da91a4',
    },
    modalContainerMenu: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'space-around'
    },
    modalMenu: {
        backgroundColor: '#f3e5e4',
        padding: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        elevation: 5,
        height: 800,
        marginLeft: 200,
        
    },
    modalFuntion: {
        backgroundColor: '#da91a4',
        margin: 20,
        padding: 10,
        borderRadius: 15
    },
    modalInput: {
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5,
        height: '60%',
        borderWidth: 1,
        margin: 30,
        borderColor: '#da91a4',
        paddingTop:30,
    },
    modalInput2: {
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5,
        height: 300,
        borderWidth: 1,
        margin: 30,
        borderColor: '#da91a4',
        paddingTop:30,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#da91a4',
    },
    DrawerButton: {
        position: 'absolute',
        right: 20,
        bottom: 70,
    },
    textmodal: {
        color: 'grey',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom:20,
    },
    choice: {
        backgroundColor: '#da91a4',
        color: '#f3e5e4',
        height:50,
    },
    label: {
        backgroundColor: '#da91a4',
        color: '#f3e5e4',
    },
    search: {
        backgroundColor: '#f3e5e4',
        margin: 15,
        marginBottom: 0,
        borderWidth: 1,
        borderColor:'#da91a4',
    },
    addButton: {
        borderWidth: 1,
        borderColor: '#da91a4',
        alignSelf:'center'
    },
    list:{
    padding: 20,
    borderBottomWidth: 1,
    borderWidth: 1,
    borderColor: '#da91a4',
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 10,
    marginTop:10,
    },
});

export default CriteriaStyle;
