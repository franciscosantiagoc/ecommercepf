import { combineReducers } from 'redux';
import {productsReducer} from './products.reducer'
import {ordenReducer} from './orden.reducer'
import {usersReducer} from './users.reducer'
import  reviewReducer  from './review.reducer'

export default combineReducers({
   productsReducer,
   ordenReducer,
   usersReducer,
   reviewReducer
});