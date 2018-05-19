import {combineReducers} from 'redux';

//Reducers
import planlist from './planlist.js';

//Combine Reducers
var reducers=combineReducers({
    planlist:planlist
});

export default reducers;