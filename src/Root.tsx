import React from 'react'
import App from './App'
import configureStore from './redux/configureStore'
import { HashRouter, BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
 
const Root = (props:any)  => {

    const store = configureStore();

    return (
        <Provider store={store}>
            {/* <BrowserRouter basename="/medicalinventory">
                <App/>
            </BrowserRouter> */}
            <HashRouter>
                <App/>
            </HashRouter>
        </Provider>  

    );
}


export default Root;