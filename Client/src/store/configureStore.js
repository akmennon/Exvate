import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import userReducer from '../reducers/userReducer'
import workReducer from '../reducers/workReducer'
import orderReducer from '../reducers/orderReducer'
import profileReducer from '../reducers/profileReducer'

const configureStore = () =>{ 
    const store = createStore(combineReducers({
        user:userReducer,
        work:workReducer,
        order:orderReducer,
        profile:profileReducer
    }),applyMiddleware(thunk))

return store

}

export default configureStore

