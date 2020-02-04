const styles = theme => ({
    info:{
      position : 'absolute',
      left:'calc(2%)',
      paddingTop: '5px',
    },
    signOut:{
      position : 'absolute',
      right: 'calc(2%)',
      paddingTop: '10px',
    },  
    content: {
      height: 'calc(100vh - 100px)',
      overflow: 'auto',
      padding: '25px',
      margin: 'auto',
      boxSizing: 'border-box',
      overflowY: 'scroll',
      top: '50px',
      width: 'calc(100%)'
    },
  
    userSent: {
      float: 'right',
      clear: 'both',
      padding: '20px',
      boxSizing: 'border-box',
      wordWrap: 'break-word',
      marginTop: '10px',
      backgroundColor: '#707BC4',
      color: 'white',
      width: '200px',
      borderRadius: '10px'
    },
  
    friendSent: {
      float: 'left',
      clear: 'both',
      padding: '20px',
      boxSizing: 'border-box',
      wordWrap: 'break-word',
      marginTop: '10px',
      backgroundColor: '#afd700',
      color: 'white',
      width: '200px',
      borderRadius: '10px'
    },
  
    chatHeader: {
      width: 'calc(100%)',
      height: '50px',
      backgroundColor: '#d7af00',
      margin: 'auto',
      fontSize: '18px',
      color: 'white',
      paddingTop: '5px',
      boxSizing: 'border-box'
    }
  
  });
  
  export default styles;