import { StyleSheet,transparent } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3e5e4',
    },
    TopBackGround: {
        backgroundColor: '#da91a4',
        height: 120,
    },
    greeting: {
        fontSize: 25,
        marginTop:50,
        marginBottom: 30,
        alignSelf: 'center',
        fontWeight: 'bold',
        color:'#f3e5e4',
    },
    contactItem: {
        padding: 15,
      },
      contactName: {
        fontSize: 18,
    },
    chat: {
        borderWidth: 1,
        borderColor: '#da91a4',
        margin:10,
        borderRadius: 5,
    },
    noDataText: {
        color: 'grey',
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginTop:30
        
    },
    backButton: {
        position: 'absolute',
        left: 20,
        bottom: 40,
    },
    searchInput: {
        height: 40,
        borderColor: '#da91a4',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        margin: 10,
    },
})