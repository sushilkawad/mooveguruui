import {
    createStore, combineReducers, applyMiddleware, compose,
  } from 'redux';
  import thunk from 'redux-thunk';
  import utilsReducer from '../reducers';

const middlewares = [thunk];

const middleware = applyMiddleware(...middlewares);
const enhancers = [middleware];


export const store = createStore(combineReducers({
  utilsReducer,
}), compose(...enhancers));

export default store;