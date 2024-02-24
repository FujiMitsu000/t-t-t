import React from 'react';
import { observer } from 'mobx-react-lite';
import './main.css';
import '../assets/style/table.css';

const main = observer((props) => {

  return (
    <div className="main">
        <h1 className="text_title title">{props.title}</h1>
        <div className="content">
            {props.component}
        </div>
    </div>
  )
})

export default main