import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { trackPromise } from "react-promise-tracker";
import { StoreContext } from '../../stores';
import {ReactComponent as Cross} from '../../assets/svg/cross.svg';
import {ReactComponent as Circle} from '../../assets/svg/circle.svg';
import Trophy from '../../assets/img/trophy.png';
import Page from '../UI/Page/Page';
import LoadingIndicator from '../UI/LoadingIndicator/LoadIndicator';
import './history.css';

const History = observer(() => {
  const Store = useContext(StoreContext);

  useEffect(() => {
    if(!Store.GameStore.games?.length) {
      trackPromise(
        Store.GameStore.getGames(10, 0)
      );
    }
  }, []);

  return (
    <>
      {
        Store.GameStore.games?.length 
          ?
          <>
            <table>
              <thead>
                <tr>
                  <th className="text text_bold th_history"></th>
                  <th className="text text_bold th_history">Игроки</th>
                  <th className="text text_bold th_history"></th>
                  <th className="text text_bold th_history">Дата</th>
                  <th className="text text_bold th_history">Время игры</th>
                </tr>
              </thead>
              <tbody>
                {
                  Store.GameStore.games
                    ?.map(
                      ({id, winner, playerOne, playerTwo, createdAt, finishedAt}) => (
                        <tr key={id}>
                          <td className={`history__player-one td_history text_bold ${winner === 1 ? "winner": ""}`}>
                          {<Cross className="player-row__icon player-row__icon_cross"/>}
                            {playerOne}
                            {
                              winner === 1 &&
                              <img className="history__trophy" src={Trophy} alt="Победитель"/>
                            }
                          </td>
                          <td className="history__versus text_bold td_history">против</td>
                          <td className={`history__player-two td_history text_bold ${winner === 2 ? "winner": ""}`}>
                          {<Circle className="player-row__icon player-row__icon_circle"/>}
                            {playerTwo}
                            {
                              winner === 2 &&
                              <img className="history__trophy" src={Trophy} alt="Победитель"/>
                            }
                          </td>
                          <td className="text td_history">{new Date(createdAt).toDateString().slice(4)}</td>
                          <td className="text td_history">
                            {
                              finishedAt ?
                                new Date(new Date(finishedAt) - new Date(createdAt)).toISOString().slice(11, 19) 
                              :
                                new Date(createdAt).toISOString().slice(11, 19)
                            }
                          </td>
                        </tr>
                      ),
                    )
                  
                }
              </tbody>
            </table>
            <div className="pages">
              {
                Store.GameStore.pages.length != (0 || 1)
                ?
                  Store.GameStore.pages.map((page) => (
                    <Page
                      page = {page}
                      get = {() => {
                        Store.GameStore.getGames(10, (10*(page-1)));
                        Store.GameStore.togglePage(page);
                      }}
                      act = {Store.GameStore.activePage}
                    />
                  ))
                :
                  ''
              }
            </div>
          </>
          :
            <h2>Игр пока нет</h2>
      }
      {
        Store.GameStore.games?.length ?
        ''
        :
        <LoadingIndicator cls={'page-indicator'}/>
      }
    </>
  );
});

export default History;