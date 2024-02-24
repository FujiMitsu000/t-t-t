import React from 'react';
import { usePromiseTracker } from "react-promise-tracker";
import './loadingIndicator.css'

const LoadingIndicator = (props) => {
    const { promiseInProgress } = usePromiseTracker();

    return (
      promiseInProgress && 
      <div className={props.cls}>
            
        <h1>Загрузка данных...</h1>
      </div>
  
    );  
  }

export default LoadingIndicator;
