import React, { useContext } from 'react';
import { StoreContext } from '../../../../stores';
import { observer } from 'mobx-react-lite';
import Button from '../../Button/Button';
import { Link } from 'react-router-dom';
import './invitation.css';

const Invitation = observer(() => {
    const Store = useContext(StoreContext);

    return (
        <>
            <span className="text_wrapper invitation_text">
                Вас приглашает в игру

                <span className="invitation_text name">
                    &nbsp;{Store.NavbarStore.textModal}
                </span>
            </span>
            <div className="invitation_buttons">
                <Button
                    cls={"modal-window__button invitation_button accept_button"}
                    text={<Link className="link modal-window__button_text" to={`/game/${Store.GameStore.game?.id}`}>Принять</Link>}
                    click={() => {
                        Store.ActivePlayersStore.acceptInvite();
                    }} 
                />
                <Button
                    cls={"modal-window__button modal-window__button_text invitation_button decline_button"}
                    text={"Отклонить"}
                    click={
                        () => Store.ActivePlayersStore.declineInvite()
                    }
                />
            </div>
        </>
    )
})

export default Invitation