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
    ListBanner: {
        flexDirection: 'row',
        padding:10,
        borderWidth: 3,
        borderColor: '#da91a4',
    },
    banner: {
        height: 160,
        width: 160,
        marginHorizontal:15
    },
    ListAccordionGroup: {
        margin: 40,
        backgroundColor: '#f3e5e4',
      
    },
    AccordionContainer: {
        marginBottom:40, 
        backgroundColor: '#f3e5e4',
    },
    Accordion: {
        backgroundColor: '#da91a4', 
    },
    Item: {
        color: '#da91a4',
        fontWeight:'bold',
    }

})