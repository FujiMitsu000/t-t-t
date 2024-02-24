import React, { useContext } from 'react';
import { StoreContext } from '../../../../stores';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import Button from '../../Button/Button';
import './gameInfo.css';


const GameInfo = observer(() => {
    const Store = useContext(StoreContext);

    return (
        <>
            <span className="text_wrapper modal-window__text">
                {Store.NavbarStore.textModal}
            </span>
            <Button
                cls={"modal-window__button game-info_button modal-window__button_text"}
                click={() => Store.NavbarStore.closeModalWindow()}
                text={
                    !Store.ActivePlayersStore.error
                    ? 
                        <Link 
                            className="link"
                            to={`${Store.GameStore.finished ? '/active' : `/game/${Store.GameStore.game?.id}`}`}
                            onClick={() => {
                                if(Store.GameStore.finished) {
                                    Store.GameStore.finishGame();
                                    Store.ChatStore.clearChat();
                                    Store.GameStore.getGames();
                                    Store.RatingStore.getStatistics();
                                }
                            }}
                        >
                            Ок
                        </Link>
                    :
                        <span
                            className="link"
                            onClick={() => Store.ActivePlayersStore.dispalyError()}
                        >
                            Ок
                        </span>
                }
            />
        </>
    )
})

export default GameInfo