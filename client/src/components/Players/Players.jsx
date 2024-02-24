import React, { useContext, useEffect } from 'react';
import { StoreContext } from '../../stores';
import { observer } from 'mobx-react-lite';
import { trackPromise } from "react-promise-tracker";
import Page from '../UI/Page/Page';
import LoadingIndicator from '../UI/LoadingIndicator/LoadIndicator';
import Button from '../UI/Button/Button';
import './players.css';

const Players = observer(() => {
  const Store = useContext(StoreContext);

  useEffect(() => {
    if(!Store.UsersStore.users?.length) {
      trackPromise(
        Store.UsersStore.getUsers(10, 0)
      );
    }
  }, []);

  return (
      <>
        {
          Store.AuthStore.checkAccess() ?
              <button 
                className="text button button_primary players__add-new"
                onClick={() => Store.NavbarStore.displayModal('addUser')}
              >
                  Добавить игрока
              </button>
            :
              ''
        }
        {
          Store.UsersStore.users?.length 
            ?
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th className="text text_bold">Логин</th>
                    <th className="text text_bold">Статус</th>
                    <th className="text text_bold">Создан</th>
                    <th className="text text_bold">Изменен</th>
                    <th className="text text_bold"></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    Store.UsersStore.users
                      ?.map(
                        ({id, username, status, createdAt, updatedAt}) =>
                          <tr key={id}>
                            <td className="text text_bold login td_players">
                              {username}
                            </td>
                            <td className="text text_bold td_players">
                              {
                                status === 'active' 
                                ? 
                                <div className="players__status players__status_active">
                                  Активен
                                </div> 
                                :  
                                <div className="players__status players__status_blocked">
                                  Заблокирован
                                </div>
                              }
                            </td>
                            <td className="text td_players">{new Date(createdAt).toDateString().slice(4)}</td>
                            <td className="text td_players">{new Date(updatedAt).toDateString().slice(4)}</td>
                            <td 
                              className="text td_players"
                            >
                              {
                                Store.AuthStore.checkAccess() ?
                                <Button
                                  cls="text button button_secondary"
                                  text={status === 'active' ? 'Заблокировать' : 'Разблокировать'}
                                  click={
                                    () => 
                                      status === 'active' ?
                                        Store.AdminStore.blockUser(id) 
                                        :
                                        Store.AdminStore.unblockUser(id)
                                  }
                                />
                                :
                                  ''
                              }
                            </td>
                          </tr>
                      )
                    
                  }
                </tbody>
              </table>
              <div className="pages">
                {
                  Store.UsersStore.pages.length != (0 || 1)
                  ?
                    Store.UsersStore.pages.map((page) => (
                      <Page
                        page = {page}
                        get = {() => {
                          Store.UsersStore.getUsers(10, (10*(page-1)));
                          Store.UsersStore.togglePage(page);
                        }}
                        act = {Store.UsersStore.activePage}
                      />
                    ))
                  :
                    ''
                }
              </div>
            </>
            :
              <h2>Игроков пока нет</h2>
        }
        {
          Store.UsersStore.users?.length ?
          '' 
          :
          <LoadingIndicator cls={'page-indicator'}/>
        }
      </>
  )
})

export default Players