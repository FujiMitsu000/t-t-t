import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Store, StoreContext } from './stores';

const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <StoreContext.Provider value={new Store()}>
      <App />
    </StoreContext.Provider>
);
