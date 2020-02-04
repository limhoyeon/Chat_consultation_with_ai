const styles = theme => ({

    sendBtn: {
      color: 'blue',
      cursor: 'pointer',
      '&:hover': {
        color: 'gray'
      }
    },
  
    chatTextBoxContainer: {
      bottom: '15px',
      boxSizing: 'border-box',
      overflow: 'auto',
      width: 'calc(100%)'
    },
  
    chatTextBox: {
      width: 'calc(100% - 25px)'
    }
  
  });
  
  export default styles;