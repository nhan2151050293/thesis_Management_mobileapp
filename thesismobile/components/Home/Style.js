import { StyleSheet, transparent } from "react-native";
import { Avatar } from "react-native-paper";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:  '#f3e5e4',
  },
  TopBackGround: {
    backgroundColor: '#da91a4',
    height: '12%',
    flexDirection:'row'
  },
  TopIcon: {
    left: '200%',
    top: '50%',
    marginRight:20
  },
  greeting: {
    fontSize: 25,
    top:'12%',
    alignItems: 'center',
    fontWeight: 'bold',
    color: '#f3e5e4',
    marginLeft:30,
  },
  postContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  postContent: {
    fontSize: 16,
  },
  postDate: {
    fontSize: 12,
    color: '#888',
  },
  itemText: {
    fontSize: 20,
    marginBottom: 10,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderWidth: 1,
    borderColor: '#da91a4',
    height: 280,
    marginLeft: 30,
    marginRight:30,
  },
  account: {
    flexDirection: 'row',
    margin: 30,
    marginBottom: 10,
    alignItems:'center'
  },
  Username: {
    fontSize: 18,
    paddingLeft:'3%'
  },
  accountcmt: {
    flexDirection: 'row',
    margin: 20,
    marginBottom: 10,
    marginLeft:10
  },
  Usernamecmt: {
    fontSize: 12,
    fontWeight:'bold',
    paddingLeft:10
  },
  textcmt: {
    fontSize: 16,
    paddingTop:2,
    paddingLeft:10,
  },
  textcmttime: {
    fontSize: 10,
    paddingTop: 2,
    paddingLeft:'2%',
    color:'grey',
  },
  IconTop: {
    position: 'absolute',
    left:'90%'
  },
  IconTop2: {
    position: 'absolute',
    left:'95%'
  },
  Icon: {
    bottom: '6%',
    paddingRight:'5%',
  },
  like: {
    fontWeight: 'bold',
    color: 'grey',
    bottom: '4%',
    marginLeft:'10%'
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
    height: '50%',
    top:'50%'
  },
  modalContent2: {
    backgroundColor: 'white',
    padding: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    elevation: 5,
    height: '77%',
    top:'22%'
  },
  modalContent3: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius:10,
    elevation: 5,
    height: '30%',
    width: '50%',
    top:'40%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  modalContent4: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius:10,
    elevation: 5,
    height: '60%',
    width: '70%',
    top:'20%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  Post: {
    flexDirection: 'row',
    borderBottomWidth: 10,
    borderColor: '#da91a4',
    padding:20,
  },
  postButton: {
    alignSelf: 'center',
    marginLeft: 15
  },
  textPost: {
    color: 'grey',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign:'center',
  },
  Avatar: {
    width: 60,
    height: 60,
    borderRadius: 150,
  },
  buttonPost: {
    backgroundColor: '#da91a4',
  },
  buttonClose: {
    borderColor: '#da91a4',
    margin: 10,
    marginTop: 30,
  },
  comment: {
    flexDirection: 'row',
    borderTopWidth: 2,
    borderColor: '#da91a4',
    paddingTop: 10,
    paddingBottom:10,
  },
  postcomment: {
    backgroundColor: '#da91a4',
    left: '60%',
    alignItems: 'center',
    position:'absolute',
    left: "80%",
    top:'20%',
  },
  input: {
    marginLeft: '1%',
    marginRight:'21%',
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    minHeight: 10,
    maxHeight: 20,  
    textAlignVertical: 'center',
    paddingLeft: 15,
    paddingRight:15,
  },
  input2: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#da91a4',
    borderRadius: 20,
    width:'100%',
    minHeight: '65%',
    maxHeight: 30,  
    textAlignVertical: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    fontSize:20,
  },
  minimenu: {
    left: '10%',
  },
  minimenu2: {
    right:'50%',
    top: '10%',
    marginBottom:10,
  },
  minimenuIcon: {
    backgroundColor: '#da91a4',
    padding:10
  },
  minimenuText: {
    color: 'white',
    fontSize: 15,
  },
})