import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { StoreContext } from '../../../../stores'
import GameField from './GameField/GameField'
import PlayerIcon from './PlayerIcon/PlayerIcon'
import CurrentMove from './CurrentMove/CurrentMove'
import './playArea.css'

const PlayArea = observer(() => {
    const Store =  useContext(StoreContext);

    return (
        <div className="play_area">
            <div className="wrapper">
                <PlayerIcon 
                    username={Store.GameStore.game.thisPlayer?.username} 
                    symbol={Store.GameStore.game.thisPlayer?.symbol} 
                    color={Store.GameStore.game.thisPlayer?.color}
                />

                <GameField/>

                <PlayerIcon 
                    username={Store.GameStore.game.secondPlayer?.username} 
                    symbol={Store.GameStore.game.secondPlayer?.symbol} 
                    color={Store.GameStore.game.secondPlayer?.color}
                />
            </div>

            <CurrentMove
                symbol={Store.GameStore.game?.symbol}
                playerOne={Store.GameStore.game.thisPlayer?.username}
                playerTwo={Store.GameStore.game.secondPlayer}
            />
        </div>
    )
})

export default PlayArea