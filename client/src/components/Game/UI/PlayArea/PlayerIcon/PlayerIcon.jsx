import React from 'react';
import { observer } from 'mobx-react-lite';
import './playerIcon.css';

const PlayerIcon = observer((props) => {
  let color = '';

  if (props.color == 'win') {
    color = 'background_winner';
  } else if (props.color == 'draw') {
    color = 'background_draw';
  } else if (props.color) {
    color = 'background_current_move'
  } else {
    color = '';
  }

  return (
    <div className={`player ${color}`}>
        <p>{props.username}</p>
        <p>{props.symbol}</p>
    </div>
  )
})

export default PlayerIcon
