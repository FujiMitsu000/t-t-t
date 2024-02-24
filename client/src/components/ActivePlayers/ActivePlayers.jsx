import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../stores';
import Page from '../UI/Page/Page';
import Button from '../UI/Button/Button';
import './activePlayers.css';

const ActivePlayers = observer(() => {
  const Store = useContext(StoreContext);

  return (
    <>
      {
        Store.ActivePlayersStore.activePlayers?.length 
          ?
            <>
              {
                Store.ActivePlayersStore.activePlayers.map(
                  ({userId, status, username}) => 
                    <div key={userId} className="active-players">
                      <div className="text text_bold active-players__login">{username}</div>
                        <div
                          className={`
                            text
                            text_bold
                            active-players__status
                            active-players__status_${status ? 'free' : 'busy'}
                          `}
                        >
                          {status ? "Свободен" : "В игре"}
                        </div>
                        <Button
                          cls={`text button button_secondary active-players__button ${status ? "" : "disabled"}`}
                          text={'Позвать играть'}
                          click={() => Store.ActivePlayersStore.invitePlayer(userId, status)}
                        />
                    </div>
                )
              }
              <div className="pages">
                {
                  Store.ActivePlayersStore.pages.length != (0 || 1)
                  ?
                    Store.ActivePlayersStore.pages.map((page) => (
                      <Page
                        page = {page}
                        get = {() => {
                          Store.ActivePlayersStore.nextPage(10*(page-1), (10*(page)));
                          Store.ActivePlayersStore.togglePage(page);
                        }}
                        act = {Store.ActivePlayersStore.activePage}
                      />
                    ))
                  :
                    ''
                }
              </div>
            </>
          :
            <h2>Никто не онлайн</h2>
      }
    </>
  )
})

export default ActivePlayers