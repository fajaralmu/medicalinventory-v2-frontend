import React from 'react'
import App from './App'
import configureStore from './redux/configureStore'
import { HashRouter, BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Provider as InversifyProvider } from 'inversify-react';
import { container } from './inversify.config';

const Root = (props: any) => {

    const store = configureStore();

    return (
        <Provider store={store}>
            <InversifyProvider container={container} >
                {/* <BrowserRouter basename="/medicalinventory">
                <App/>
            </BrowserRouter> */}
                <HashRouter>
                    <App />
                </HashRouter>
            </InversifyProvider>
        </Provider>

    );
}


export default Root;