import { StyleSheet } from 'react-native';

const StyleStudy = StyleSheet.create({
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderWidth: 1,
        borderColor: '#da91a4',
        height: 330,
        margin: 30,
        alignItems: 'center',
        paddingTop:20
    },
    modalContainer: {
       // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      //  backgroundColor: 'rgba(0, 0, 0, 0.5)',

    },
    modalInfo: {
        alignItems: 'center',
        padding:10,
        borderWidth: 2,
        borderColor:'#da91a4',
        borderRadius: 20,
        marginBottom: 20,
    },
    modalContent: {
        width: '70%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        borderWidth: 1,
        borderColor: '#da91a4',
        height:700,
    },
    scrollContainer: {
        maxHeight: '80%',  // Adjust this value as needed

    },
    closeButton: {
        marginTop: 10,
        backgroundColor: '#da91a4',
        width: 250,
    },
    DeleteButton: {
        marginTop: 10,
        backgroundColor: '#da91a4',
    },
    addButton: {
        borderWidth: 1,
        borderColor:'#da91a4',
        alignSelf: 'center',
        
    },
    textOriginal: {
        backgroundColor:'#da91a4',
        borderWidth: 1,
        borderColor:'#da91a4',
        color: '#f3e5e4',
        fontSize: 15,
        padding: 10,
        margin: 40,
        marginTop:10,
        marginBottom:0
    }
});

export default StyleStudy;
