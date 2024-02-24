import React from 'react';
import {ReactComponent as Cross} from '../../../../../../assets/svg/cross.svg';
import {ReactComponent as Circle} from '../../../../../../assets/svg/circle.svg';
import './cell.css';


const Cell = (props) => {
  return (
    <div className="game-field__cell">
      {props.symbol ?
        props.symbol === 'X' ? 
          <Cross className="cell__symbol cell__cross"/> 
          : 
          <Circle className="cell__symbol cell__circle"/> 
        : 
        ''
      }
    </div>
  )
}

export default Cell;
