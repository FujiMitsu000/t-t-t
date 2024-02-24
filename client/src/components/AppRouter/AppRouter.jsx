import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom';
import { trackPromise } from "react-promise-tracker";
import { StoreContext } from '../../stores';
import Login from '../Login/Login';
import ModalInvitation from '../UI/ModalWindow/ModalWindow.jsx';
import Menu from '../Navbar/Menu/Menu';
import Navbar from '../Navbar/Navbar';
import Main from '../Main.jsx';
import Game from '../Game/Game.jsx';
import LoadingIndicator from '../UI/LoadingIndicator/LoadIndicator.jsx';

const AppRouter = observer((props) => {
  const Store = useContext(StoreContext);
  
  useEffect(() => {
    if(Store.AuthStore.token) {
      trackPromise(
        Store.AuthStore.isAuthorized()
      );
    }
  }, []);


  return (
    <>
      <Routes>
        {props.routes.map(route =>
            <Route
              key={route.path}
              path={route.path}
              element={
                  (Store.AuthStore.Authorized
                    ?
                      <>
                        <Navbar />
                        <Menu routes={props.routes} />  
                        {route.title === 'Игровое поле' 
                          ? 
                          <Game/> 
                          : 
                          <Main
                            title={route.title}
                            component={route.component}
                            
                          />
                        }
                        <ModalInvitation/>
                      </>
                    :
                      <Login/>
                  )
              }
            />
        )}
      </Routes>
      {
        Store.AuthStore.Authorized
        ? 
        ''
        : 
        <LoadingIndicator cls={'site-indicator'}/>
      }
    </>
  )
})

export default AppRouter