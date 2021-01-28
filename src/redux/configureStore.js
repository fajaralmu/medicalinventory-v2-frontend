import { createStore, applyMiddleware } from 'redux'
import { initialState, rootReducer } from './reducers' 
import * as userMiddleware from '../middlewares/UserMiddleware' 
import * as realtimeChatMiddleware from '../middlewares/RealtimeChatMiddleware' 

const POST_METHOD = "POST";

export const configureStore = () => {
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(   

            //user related
            userMiddleware.performLoginMiddleware,
            userMiddleware.performLogoutMiddleware, 
            userMiddleware.requestAppIdMiddleware, 
            userMiddleware.getLoggedUserMiddleware, 
            userMiddleware.setLoggedUserMiddleware,
 

            /*realtime chat*/
            realtimeChatMiddleware.storeChatMessageLocallyMiddleware,
            realtimeChatMiddleware.getMessagesMiddleware,

        )
    );

    return store;
}
   

export default configureStore;