import { StyleSheet } from 'react-native';

const ListStudyStyle = StyleSheet.create({
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
        height: 280,
        marginBottom: 30,
    },
    itemCouncil: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#da91a4',
        height: 150,
        marginBottom: 30,
        alignItems:'center'
    },
    itemText: {
        fontSize: 20,
        marginBottom:10
    },
    itemKind: {
        fontSize: 15,
        marginBottom: 10,
        position: 'absolute',
        backgroundColor: '#da91a4',
        color:'#f3e5e4',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#f3e5e4',
        padding: 4,
        bottom: 270,
        right:10
    },
    Button: {
        margin: 20,
        backgroundColor: '#da91a4',
    },
    buttonDetail: {
        alignItems: 'center',
        position: 'absolute',
        top: 210,
        alignSelf:'center'
    },
    buttonCouncilDetail: {
        alignItems: 'center',
        position: 'absolute',
        top: 80,
        alignSelf: 'center',
        flexDirection: 'row',

    },
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
        height:500,
    },
    modalInfo: {
        alignItems: 'center',
        padding:10,
        borderWidth: 2,
        borderColor:'#da91a4',
        borderRadius: 20,
        
    },
    modalItemText: {
        fontSize: 18,
        marginBottom: 8,
        textAlign:'center'
    },
    itemText2: {
        fontSize: 20,
        fontWeight:'bold',
        marginBottom: 10,
        color:'#da91a4',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#da91a4',
    },
    ButtonCouncilDetail: {
        marginTop: 20,
        backgroundColor: '#da91a4',
        marginRight: 20,
        marginLeft:20
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop:10
    },
    filterText: {
        fontSize: 15,
        fontWeight:'bold',
        color: '#da91a4',
    },
});

export default ListStudyStyle;
