import React, { useContext } from 'react';
import { StoreContext } from '../../../stores';
import { observer } from 'mobx-react-lite';
import AddUser from './AddUser/AddUser';
import GameInfo from './GameInfo/GameInfo';
import Invitation from './Invitation/Invitation';
import './modalWindow.css';


const ModalWindow = observer(() => {
    const Store = useContext(StoreContext);

    return (
        <div
            className={Store.NavbarStore.isVisibleModal ? "modal.active" : "modal"}
        >
            <div className="overlay">
                <div className="modal-window">
                    {Store.NavbarStore.activeModal === 'addUser' ? <AddUser /> : ''}
                    {Store.NavbarStore.activeModal === 'gameInfo' ? <GameInfo /> : ''}
                    {Store.NavbarStore.activeModal === 'invitation' ? <Invitation /> : ''}
                </div>
            </div>
        </div>
    );
});

export default ModalWindow;

