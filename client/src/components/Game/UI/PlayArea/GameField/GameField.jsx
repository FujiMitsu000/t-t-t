import React, { useRef, useContext } from 'react'
import Cell from './Cell/Cell';
import './gameField.css';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../../../../stores';


const GameField = observer(() => {
  const Store = useContext(StoreContext);
  const gameFieldRef = useRef();

  function renderCell(symbol, id) {
    return (
      <Cell 
        key={id}
        symbol={symbol}
      />
    );
  }

  return (
    <div className="game_field" ref={gameFieldRef} onClick={(e) => Store.GameStore.makeMove(e, gameFieldRef)}>
        {Store.GameStore.field.map((symbol, index) => renderCell(symbol, index))}
    </div>
  )
})

export default GameField;