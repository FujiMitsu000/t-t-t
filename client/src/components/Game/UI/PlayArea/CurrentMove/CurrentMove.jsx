import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../../../../stores'
import {ReactComponent as Cross} from '../../../../../assets/svg/cross.svg';
import {ReactComponent as Circle} from '../../../../../assets/svg/circle.svg';
import './currentMove.css';

const CurrentMove = observer((props) => {
  const Store =  useContext(StoreContext);
  let symbol = '';
  let name = '';

  if (Store.GameStore.game.thisPlayer?.symbol === props.symbol && Store.GameStore.game.id) {
    name = 'Ваш ход';
  } else if (Store.GameStore.game.id) {
    name = 'Ход соперника';
  }

  symbol = props.symbol;

  return (
    <div className="current-move">
        {
          symbol ?
            symbol === 'X' ? 
              <Cross className="symbol cross"/> 
              : 
              <Circle className="symbol circle"/> 
          : 
          ''
        }
        <div className="current-player">
            {name}
        </div>
    </div>
  )
})

export default CurrentMove;