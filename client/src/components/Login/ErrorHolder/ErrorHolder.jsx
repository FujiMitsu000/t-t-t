import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { StoreContext } from '../../../stores'
import './errorHolder.css'

const ErrorHolder = observer(() => {
    const Store = useContext(StoreContext);

    return ( 
        <div className="login_error_msg_holder">
            {Store.AuthStore.displayWarningMsg 
            ?
            <p className=
                {
                    `login_error_msg 
                    ${Store.AuthStore.colorWarningMsg 
                    ?
                    'login_error_msg_good_req'
                    :
                    'login_error_msg_bad_req'}`
                }
            >
                {Store.AuthStore.warningsMessage.map(warning => <span>{warning.msg}<br/></span>)}
            </p>
            :
            ''
            }
        </div>
    )
})

export default ErrorHolder