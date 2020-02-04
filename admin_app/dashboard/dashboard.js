import React from 'react';
import NewChatComponent from '../NewChat/newChat';
import ChatListComponent from '../ChatList/chatList';
import ChatViewComponent from '../ChatView/chatView';
import ChatTextBoxComponent from '../ChatTextBox/chatTextBox';
import styles from './styles';
import { Button, withStyles } from '@material-ui/core';
const firebase = require("firebase");

// I need to investigate why sometimes
// two messages will send instead of just
// one. I dont know if there are two instances
// of the chat box component or what...

// I will be using both .then and async/await
// in this tutorial to give a feel of both.

class DashboardComponent extends React.Component {

  constructor() {
    super();
    this.state = {
      selectedChat: null,
      email: null,
      friends: [],
      chats: []
    };
  }

  render() {

    const { classes } = this.props;

    if(this.state.email) {
      return(
        <div className='dashboard-container' id='dashboard-container'>
          <ChatListComponent history={this.props.history} 
            userEmail={this.state.email} 
            selectChatFn={this.selectChat} 
            chats={this.state.chats} 
            selectedChatIndex={this.state.selectedChat}>
          </ChatListComponent>
          {
            <ChatViewComponent 
              user={this.state.email} 
              chat={this.state.chats[this.state.selectedChat]}>
            </ChatViewComponent>
          }
          { 
            this.state.selectedChat !== null && !this.state.newChatFormVisible ? <ChatTextBoxComponent userClickedInputFn={this.messageRead} submitMessageFn={this.submitMessage}></ChatTextBoxComponent> : null 
          }
          <Button onClick={this.signOut} className={classes.signOutBtn}>Sign Out</Button>
        </div>
      );
    } else {
      return(<div>LOADING....</div>);
    }
  }

  signOut = () => firebase.auth().signOut();

  submitMessage = (msg) => {
    var chat=this.state.chats[this.state.selectedChat]
    firebase
      .firestore()
      .collection('chats')
      .doc(chat.tel)
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion({
          sender: 'admin',
          message: msg,
          timestamp: Date.now(),
          manager : this.state.email
        })
      });
  }

  selectChat = async (chatIndex) => {
    await this.setState({ selectedChat: chatIndex});
    this.messageRead();
  }

  messageRead = () => {
    const chatIndex = this.state.selectedChat;
      firebase
        .firestore()
        .collection('chats')
        .doc(this.state.chats[chatIndex].tel)
        .update({ isRead: true });
  }

  componentWillMount = () => {
      firebase.auth().onAuthStateChanged(async _usr => {
        if(!_usr)
          this.props.history.push('/login');
        else {
          await firebase
            .firestore()
            .collection('chats')
            .onSnapshot(async res => {
              const chats = res.docs.map(_doc => _doc.data());
              await this.setState({
                email: _usr.email,
                chats: chats,
                friends: []
              });
            })
        }
    });
  }
}

export default withStyles(styles)(DashboardComponent);