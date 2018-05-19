import * as types from './action-type.js';
import axios from 'axios';

//添加计划
export function addPlan(item){
    return {
        type:types.ADD,
        item
    };
}

//删除计划
export function deletePlan(id){
    return {
        type:types.DELECT,
        id
    };
}

//显示隐藏弹层
export function show(show){
    return {
        type:types.SHOW,
        show
    };
}

export function setKeyword(keyword){
    return {
        type:types.SETKEYWORD,
        keyword
    };
}

export function getNewsList(){
    let linkPage_news='';
    axios.get('http://120.24.2.71:9090/news/list?page=1&limit=6')
    .then(function (response) {
        console.log(response);
        linkPage_news=response.data.rows;
        return {
            type:types.GETNEWSLIST,
            linkPage_news
        };
    })
    .catch(function (error) {
        console.log(error);
    });
}

export function setPathname(pathname){
    return {
        type:types.SETPATHNAME,
        pathname
    };
}

export function setToken(token){
    return {
        type:types.SETTOKEN,
        token
    };
}