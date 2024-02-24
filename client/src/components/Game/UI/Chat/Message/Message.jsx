import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import './message.css';
import { StoreContext } from '../../../../../stores';


const Message = observer((props) => {
  const Store = useContext(StoreContext);
  
  return (
    <div className={
      props.userId === "server" ? 
        "server-message" 
        : 
        `message 
         message__${props.userId === Store.AuthStore.thisUser.userId ? 'sender' : 'recipient'}-player`
    }>
      {props.messageText}
    </div>
  )
})

export default Message