import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import {ReactComponent as MenuIcon} from '../../assets/svg/menu.svg';
import {ReactComponent as ExitIcon} from '../../assets/svg/exit.svg';
import { StoreContext } from '../../stores';
import './navbar.css';

const Navbar = observer(() => {
    const Store = useContext(StoreContext);

  return (
    <nav onClick={e => e.stopPropagation()}>
        <MenuIcon 
            className="svg_menu_icon svg_icon"
            onClick={() => Store.NavbarStore.changeActive()}
        />
        <ExitIcon
            className="svg_exit_icon svg_icon"
            onClick={() => Store.AuthStore.logout()}
        />
    </nav>
  )
})

export default Navbar