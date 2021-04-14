import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import userReducer from '../reducers/userReducer'
import workReducer from '../reducers/workReducer'
import orderReducer from '../reducers/orderReducer'

const configureStore = () =>{ 
    const store = createStore(combineReducers({
        user:userReducer,
        work:workReducer,
        order:orderReducer
    }),applyMiddleware(thunk))

return store

}

export default configureStore

