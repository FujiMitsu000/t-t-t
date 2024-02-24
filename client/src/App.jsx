import React, { useContext } from 'react';
import { BrowserRouter, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { StoreContext } from './stores';
import Game from './components/Game/Game';
import Rating from './components/Rating/Rating';
import ActivePlayers from './components/ActivePlayers/ActivePlayers';
import Players from './components/Players/Players';
import History from './components/History/History';
import NotFound from './components/404/404';
import AppRouter from './components/AppRouter/AppRouter';
import './assets/style/App.css';

const App = observer(() => {
  const Store = useContext(StoreContext);

  const routes = [
    {
      path: '/game/:id',
      getParam: () => (Store.GameStore.game?.id || 'field'),
      title: 'Игровое поле',
      component: <Game/>
    },
    {
      path: '/active',
      title: 'Активные игроки',
      component: <ActivePlayers/>
    },
    {
      path: '/rating',
      title: 'Рейтинг',
      component: <Rating/>
    },
    {
      path: '/history',
      title: 'История игр',
      component: <History/>
    },
    {
      path: '/players',
      title: 'Список игроков',
      component: <Players/>
    },
    {
      path: '/',
      component: <Navigate replace to="/active"/>,
      loader: Store.AuthStore.isAuthorized(),
    },
    {
      path: '*',
      component: <NotFound/>,
    }
  ];


  return (
    <div className="App">
        <BrowserRouter>
            
            <AppRouter routes={routes} />
            
        </BrowserRouter>
    </div>
  );
})

export default App;
