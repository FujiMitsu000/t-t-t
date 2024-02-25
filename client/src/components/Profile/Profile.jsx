import React, { useContext } from 'react';
import { StoreContext } from '../../stores';
import { observer } from 'mobx-react-lite';
import Button from '../UI/Button/Button';
import './profile.css';

const Profile = observer(() => {
    const Store = useContext(StoreContext);

  return (
    <div>
      <Button
        cls={'text button button_primary'}
        click={() => Store.AdminStore.makeMeAdmin()}
        text={'Сделать меня админом'}
      />
      <span className={`text`}>
        {Store.AdminStore.msg}
      </span>
    </div>
  )
})

export default Profile