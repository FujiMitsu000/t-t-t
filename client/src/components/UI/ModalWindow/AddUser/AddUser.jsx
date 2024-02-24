import React, { useContext } from 'react';
import { StoreContext } from '../../../../stores';
import { observer } from 'mobx-react-lite';
import Button from '../../Button/Button';
import {ReactComponent as CloseLogo} from '../../../../assets/svg/close.svg';
import './addUser.css';

const AddUser = observer(() => {
    const Store = useContext(StoreContext);
    
    return (
        <>
            <div className="modal__header">
                <CloseLogo
                    className="modal__close-icon"
                    onClick={() => Store.NavbarStore.closeModalWindow()}
                />
            </div>

            <h1 className="text text_title">Добавьте игрока</h1>

            <form className="modal__content form players-create">
                <div className="input">
                    <input
                        type="text"
                        className="text input__textbox players-create__login"
                        placeholder="Логин"
                        onChange={e => Store.AdminStore.setLogin(e.target.value)}
                    />
                </div>
                <span className="text text_bold">Пароль: 123qwe</span>
                <Button
                    type="submit"
                    cls="text button button_primary form__submit"
                    text="Добавить"
                    click={
                        async (e) => {
                            e.preventDefault();
                            await Store.AdminStore.addUser();
                            Store.NavbarStore.closeModalWindow();
                        }
                    }
                />
            </form>
        </>
    )
})

export default AddUser