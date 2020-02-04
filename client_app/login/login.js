import { Link } from 'react-router-dom';
import React from 'react';
import styles from './styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const firebase = require("firebase");

class LoginComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            tel: null,
            serverError: false
        };
    }

    render() {

        const { classes } = this.props;

        return (
            <main className={classes.main}>
                <CssBaseline />
                <Paper className={classes.paper}>
                    <Typography align="center" component="h2" variant="h4">
                        반갑습니다!<br />
                    </Typography>
                    <Typography align="left" component="h4" variant="p">
                        이전 상담내역 확인을 위해<br />
                        핸드폰 번호를 입력해주세요.
                    </Typography>
                    <form onSubmit={(e) => this.submitLogin(e)} className={classes.form}>
                        <FormControl required fullWidth margin='normal'>
                            <InputLabel htmlFor='login-tel-input'>핸드폰 번호</InputLabel>
                            <Input autoComplete="tel-national" type="tel" onChange={(e) => this.userTyping('tel', e)} id='login-tel-input'></Input>
                        </FormControl>
                        <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>상담 시작하기</Button>
                    </form>
                    {this.state.serverError ?
                        <Typography className={classes.errorText} component='h5' variant='h6'>
                            정보 입력에 문제가 발생했습니다. 다시 시도해주세요.
            </Typography> :
                        null
                    }
                </Paper>
            </main>
        );
    }

    chatExists = async (tel) => {
        const chat = await
            firebase
                .firestore()
                .collection('chats')
                .doc(tel)
                .get();
        console.log(chat.exists);
        return chat.exists;
    }
    userTyping = (whichInput, event) => {
        this.setState({ tel: event.target.value });
    }

    submitLogin = async (e) => {
        var tel = this.state.tel
        e.preventDefault(); // This is to prevent the automatic refreshing of the page on submit.
        await firebase
            .auth()
            .signInAnonymously()
            .then(anonyUser => {
                var user = firebase.auth().currentUser;
                user.updateProfile({
                    displayName: tel
                }).then(() => {
                    console.log("phone information is saved")
                    this.props.history.push('/dashboard');
                }).catch((error) => {
                    console.log(error)
                });
            })
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
            .then(() => {
                console.log("persistence changed")
            })
            .catch((error) => {
                console.log(error.code, error.message)
            });
            console.log(this.chatExists(tel))
        if (await this.chatExists(tel) === true) {
            await firebase
                .firestore()
                .collection('chats')
                .doc(tel)
                .update({
                    messages: firebase.firestore.FieldValue.arrayUnion({
                        sender: 'admin',
                        message: "안녕하세요! 무엇이 궁금하세요?",
                        timestamp: Date.now()
                    })
                });
        }
        else {
            await firebase
                .firestore()
                .collection('chats')
                .doc(tel)
                .set({
                    messages: [{
                        sender: 'admin',
                        message: "안녕하세요! 무엇이 궁금하세요?",
                        timestamp: Date.now()
                    }], tel: tel
                });
        }
    }
};

export default withStyles(styles)(LoginComponent);