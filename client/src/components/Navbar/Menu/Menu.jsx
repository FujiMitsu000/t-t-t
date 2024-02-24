import React, { useContext } from 'react';
import { StoreContext } from '../../../stores';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import './menu.css';

const Menu = observer((props) => {
    const Store = useContext(StoreContext);

    return (
        <div 
            className={Store.NavbarStore.activeMenu ? "menu_active" : "menu_disable"}
            onClick={() => Store.NavbarStore.changeActive()}
        >
            <div className="menu_content" onClick={e => e.stopPropagation()}>   
                <ul>
                    {props.routes.map(route => 
                        <li key={route.path}>
                            <Link 
                                className="link_navigation_menu"
                                to={route.getParam ? route.path.replace(':id', route.getParam() || '') : route.path}
                                onClick={() => Store.NavbarStore.changeActive()}
                            >
                                {route.title}
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
})

export default Menu