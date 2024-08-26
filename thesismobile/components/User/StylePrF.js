import { StyleSheet,transparent } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3e5e4',
    },
    TopBackGround: {
        backgroundColor: '#da91a4',
        height: 220,
    },
    greeting: {
        fontSize: 25,
        marginTop:50,
        marginBottom: 30,
        alignSelf: 'center',
        fontWeight: 'bold',
        color:'#f3e5e4',
    },
    avatarContainer: {
        alignSelf: 'center',
        position: 'relative',
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#f3e5e4',
    },
    cameraIconContainer: {
        position: 'absolute',
        right: 130,
        top:230,
        backgroundColor: '#da91a4',
        borderColor: '#f3e5e4',
        borderWidth:1,
        borderRadius: 20,
        padding: 5,
    },
    cameraIcon: {
        marginRight: 5,
        marginBottom: 5,
    },
    ListInfo: {
        marginTop:80,
        margin:50,
        padding: 20,
        height: 380,
        width:320,
        borderColor: '#da91a4',
        borderWidth: 2,
        borderStyle: 'solid',
        alignSelf: 'center',
       
    },
    info: {
        fontSize: 18,
        marginBottom: 10,
        alignSelf: 'center',
    },
    input: {
        height: 40,
        width: 200,
        borderColor:'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    buttonList: {
        alignSelf: 'center',
        flexDirection: 'row',
    },
    button: {
        marginRight: 10,
        marginLeft: 10,
        backgroundColor:'#da91a4'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize:15
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 40,
        borderRadius: 10,
        elevation: 5,
        alignItems:'center'
    },
    modalListButton: {
        alignItems: 'center',
    },
    modalButton1: {
        backgroundColor: '#da91a4',
        margin: 10,
        width:200
    },
    modalButton2: {
       width:200
    },
})