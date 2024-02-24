import React from 'react'
import Chat from './UI/Chat/Chat'
import PlayArea from './UI/PlayArea/PlayArea';
import './game.css';
import ModalWindow from '../UI/ModalWindow/ModalWindow';
import { observer } from 'mobx-react-lite';


const Game = observer(() => {

  return (
    <div className="game">
      <PlayArea />
      <Chat />
      <ModalWindow />
    </div>
  )
})

export default Game