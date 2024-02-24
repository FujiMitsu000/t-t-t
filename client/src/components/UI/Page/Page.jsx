import React from 'react';
import { observer } from 'mobx-react-lite';
import './page.css';

const Page = observer((props) => {

  return (
    <button
      key={props.page}
      onClick={props.get}
      className={`page ${props.act === props.page ? "page__current" : ""}`}
    >
      {props.page}
    </button>
  )
})

export default Page