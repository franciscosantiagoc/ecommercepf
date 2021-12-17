import { combineReducers } from 'redux';
import {productsReducer} from './products.reducer'
import {usersReducer} from './users.reducer'

export default combineReducers({
   productsReducer,
   usersReducer,
});