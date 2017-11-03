/* eslint-env browser */
import { createStore } from 'redux';
import reducer from './reducers';

/* eslint-disable no-underscore-dangle */
const reduxStore = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

/* eslint-enable */
export default reduxStore;
