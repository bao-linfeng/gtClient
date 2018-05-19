import * as types from '../actions/action-type.js';
import data from '../data/db.js';
const initialState={
    show:false,
    planlist:data.data,
    keyword:'',
    linkPage_news:'',
    api:'http://127.0.0.1:8081/',
    userId:'5ad83669bb6e7a9ec02c87e1',
    pathname:'/',
    token:'',
};

const planReducer=function(state=initialState,action){
    let list=state.planlist;
    switch(action.type){
        case types.ADD:
            list.push(action.item);
            return Object.assign({},state,{planlist:list});
        case types.DELECT:
            let newstate=list.filter((item)=>item.id !=action.id);
            return Object.assign({},state,{planlist:newstate});
        case types.SHOW:
            return Object.assign({},state,{show:action.show});
        case types.SETKEYWORD:
            return Object.assign({},state,{keyword:action.keyword});
        case types.GETNEWSLIST:
            return Object.assign({},state,{linkPage_news:action.linkPage_news});
        case types.SETPATHNAME:
            return Object.assign({},state,{pathname:action.pathname});
        case types.SETTOKEN:
            return Object.assign({},state,{token:action.token});
    }
    return state;
}

export default planReducer;