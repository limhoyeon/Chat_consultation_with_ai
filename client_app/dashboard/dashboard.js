import React from 'react';
import ChatViewComponent from '../ChatView/chatView';
import ChatTextBoxComponent from '../ChatTextBox/chatTextBox';
import styles from './styles';
import { Button, withStyles } from '@material-ui/core';
const firebase = require("firebase");

class DashboardComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            tel: null
        };
    }

    render() {

        const { classes } = this.props;

        if (this.state.tel) {
            return (
                <div className='dashboard-container' id='dashboard-container'>
                    {
                        <ChatViewComponent
                            tel={this.state.tel}
                            chat={this.state.messages}
                            signOutFn={this.signOut}>
                        </ChatViewComponent>
                    }
                    <ChatTextBoxComponent submitMessageFn={this.submitMessage}></ChatTextBoxComponent>
                </div>
            );
        } else {
            return (<div>상담원을 연결하고 있습니다.</div>);
        }
    }

    signOut = () => firebase.auth().signOut();

    submitMessage = (msg) => {
        firebase
            .firestore()
            .collection('chats')
            .doc(this.state.tel)
            .update({
                messages: firebase.firestore.FieldValue.arrayUnion({
                    sender: this.state.tel,
                    message: msg,
                    timestamp: Date.now(),
                    complain: 100
                }), isRead: false,
                is_complain: false
            })
    };

    componentWillMount = () => {
        firebase.auth().onAuthStateChanged(async _usr => {
            if (!_usr)
                this.props.history.push('/login');
            else {
                await firebase
                    .firestore()
                    .collection('chats')
                    .where('tel', '==', _usr.displayName)
                    .onSnapshot(res => {
                        console.log(res)
                        const chats = res.docs.map(_doc => _doc.data());
                        console.log(chats)
                        if (chats[0]) {
                            console.log(chats[0].messages)
                            console.log(this.state)
                            this.setState({
                                tel: _usr.displayName,
                                messages: [chats[0].messages],
                                friends: []
                            });
                        }
                        console.log(this.state)
                    })
            }
        });
    }
}

export default withStyles(styles)(DashboardComponent);