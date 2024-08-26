import { StyleSheet,transparent } from "react-native";

export default StyleSheet.create({
    container: {
        backgroundColor: '#da91a4',
        flex:1
    }, Square: {
        backgroundColor: '#f3e5e4',
        height: 300,
        borderBottomLeftRadius: 120,
        borderBottomRightRadius: 120,
        justifyContent: "center",
        alignItems: "center"
    }, Logo: {
        height: 150,
        width: 150,
    }, Body: {
        marginTop: 50,
        marginLeft: 50,
        marginRight: 50,
    }, Input: {
        backgroundColor: transparent,
        fontSize: 15,
        alignContent: "center",
        paddingHorizontal: 0,
    }, Text: {
        color: "#f3e5e4",
        textAlign: "center",
        fontSize: 50,
        fontWeight: "bold",
        marginBottom:20
    }, Forgot: {
        alignItems: 'center',
    }, Login: {
        alignItems: "center",
        backgroundColor: '#f3e5e4',
        padding: 5,
        borderRadius: 20,
        margin: 40,
        marginTop:25,
        marginBottom: 10,
    }, TOR: {
        flexDirection: "row",
        alignItems: "center",
        margin:40
    },
    OR: {
        flexDirection: "row",
        justifyContent: "center"
    }
})