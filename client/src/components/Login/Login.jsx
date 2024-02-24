import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { StoreContext } from '../../stores'
import ErrorHolder from './ErrorHolder/ErrorHolder'
import './login.css'

const Login = observer(() => {
const Store = useContext(StoreContext);

  return (
    <div className="container">
      <main className="login__wrapper">
        <h1 className="login__header">Вход</h1>
        <p className="login__notice login__text">
          Введите логин и пароль в поля ниже для входа или регистрации аккаунта
        </p>
        
        <ErrorHolder/>
        
        <form className="login__form login__text">
          <input 
            className="login__form-field" 
            type="text" 
            name="username" 
            placeholder="Логин"
            onChange={e => Store.AuthStore.setLogin(e.target.value)}
          />
          <input 
            className="login__form-field" 
            type="password" 
            name="password" 
            placeholder="Пароль"
            onChange={e => Store.AuthStore.setPassword(e.target.value)}
          />
          <input 
            className="button__form-submit" 
            type="submit" 
            value="Вход"
            onClick={(e) => {
              e.preventDefault(); 
              Store.AuthStore.getToken();
            }}
          />
          <p>или</p>
          <input 
            className="button__form-submit"
            type="submit" 
            value="Регистрация"
            onClick={(e) => {
              e.preventDefault(); 
              Store.AuthStore.registration();
            }}
          />
        </form>
      </main>
    </div>
  )
})

export default Login