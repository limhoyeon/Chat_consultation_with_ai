import React from 'react';
import styles from './styles';
import { Button,withStyles,Typography } from '@material-ui/core';

class ChatViewComponent extends React.Component {

  componentDidMount = () => {
    const container = document.getElementById('chatview-container');
    if(container)
      container.scrollTo(0, container.scrollHeight);
  }
  componentDidUpdate = () => {
    const container = document.getElementById('chatview-container');
    if(container)
      container.scrollTo(0, container.scrollHeight);
  }

  render() {

    const { classes } = this.props;

    if(this.props.chat === undefined) {
      return(<main className={classes.content}></main>);
    } else if(this.props.chat !== undefined) {
      return(
        <div>
          <div className={classes.chatHeader}>
          <Typography variant="h6" className={classes.info} color="third">{this.props.tel}</Typography>
            <Button className={classes.signOut} onClick={this.props.signOutFn} variant="contained" color="secondary">상담 종료</Button>
          </div>
          <main id='chatview-container' className={classes.content}>
            {
              this.props.chat[0].map((_msg, _index) => {
                return(
                <div key={_index} className={_msg.sender === this.props.tel ? classes.userSent : classes.friendSent}>
                {_msg.message}
                </div>
                )
              })
            }
          </main>
        </div>
      );
    } else {
      return (<div className='chatview-container'>상담원을 연결하고 있습니다.</div>);
    }
  }
}

export default withStyles(styles)(ChatViewComponent);