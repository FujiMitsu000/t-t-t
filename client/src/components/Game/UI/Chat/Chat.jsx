import React, { useContext, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import './chat.css';
import Message from './Message/Message';
import { StoreContext } from '../../../../stores';


const Chat = observer(() => {
  const Store = useContext(StoreContext);
  const chatInput = useRef();

  return (
    <div className="chat">
      
      <div className="chatWindow">
        {Store.ChatStore.messages.map((msg) => 
          <Message 
            key={msg.id}
            userId={msg.userId} 
            messageText={msg.text}
          />
        )}
      </div>
      <div>
        <div className="chatInputs">
          <input 
            className="chatText"
            ref={chatInput}
            type="text" 
            placeholder='. . .'
          />
          <input 
            className="chatSubmit"
            onClick={() => {
              Store.ChatStore.handleSendMessage(chatInput, Store.GameStore.game?.id);
              chatInput.current.value = ''
            }} 
            type="submit" 
            value='Отправить'
          />
        </div>
      </div>
    </div>
  )
})   

export default Chat