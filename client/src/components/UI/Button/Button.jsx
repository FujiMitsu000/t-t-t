import React from 'react';
import { observer } from 'mobx-react-lite';
import './button.css';

const Button = observer((props) => {

  return (
    <button 
      className={props.cls}
      onClick={props.click}
    >
        {props.text}
    </button>
  )
})

export default Button