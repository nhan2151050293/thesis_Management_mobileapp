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
        height: 500,
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
    Button: {
        margin: 20,
        backgroundColor: '#da91a4',
    },
});

export default StyleStudy;
