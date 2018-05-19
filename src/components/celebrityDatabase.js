import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import store from '../redux/store.js';
import {Button,Icon,Checkbox} from 'antd';
import data from "../data/db.js";
import {getJSON} from './ADS.js';
import Header from './header.js';
import NoData from './noData.js';

import {getNewsList,setPathname } from '../actions/plan.js';
import './css/genealogyDatabase.css';

class CelebrityDatabase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            surname:'',
            name:'',
            total:0,
            pages:0,
            page:1,
            celebrityTitle:'',
            celebrityList:'',
        }
    }
    componentDidMount(){
        let self=this;
        let url=this.props.planlist.api+'famous/list?page=1&limit=20';
        let getCelebrityInit=function(response){
            let pages=0,data=response.data.data;
            pages=Math.ceil(data.total/20);
            self.setState({celebrityTitle:data.fields,celebrityList:data.famous,total:data.total,pages:pages});
        }
        getJSON(url,getCelebrityInit);
    }
    getDataForSearch(e,type){
        const {surname,name} = this.state;
        let self=this;
        let url=(this.props.planlist.api+'famous/list?surname='+surname+'&pname='+name+'&page=1&limit=20');
        let getCelebrityInit=function(response){
            let pages=0,data=response.data.data;
            pages=Math.ceil(data.total/20);
            self.setState({celebrityTitle:data.fields,celebrityList:data.famous,total:data.total,pages:pages});
        }
        switch(type){
            case 1:
                getJSON(url,getCelebrityInit);
                break;
            case 2:
                if(e.keyCode == 13){
                    getJSON(url,getCelebrityInit);
                }
                break;
        }
    }
    handleGetDataForPage(e,type){
        const {page,total,pages,surname,name} = this.state;
        let pager=0,self=this;
        switch(type){
            case 1:
                if(page <= 1){
                    return false;
                }else{
                    pager=1;
                }
                break;
            case 2:
                if(page <= 1){
                    return false;
                }else{
                    pager=page-1;
                }
                break;
            case 3:
                if(page >= pages){
                    return false;
                }else{
                    pager=page+1;
                }
                break;
            case 4:
                if(page >= pages){
                    return false;
                }else{
                    pager=pages;
                }
                break;
        }
        this.setState({page:pager});

        let url=(this.props.planlist.api+'famous/list?surname='+surname+'&pname='+name+'&page='+pager+'&limit=20');;
        let getGenealogyInit=function(response){
            let data=response.data.data;
            self.setState({celebrityList:data.famous});
        }
        getJSON(url,getGenealogyInit);
    }
    render() {
        const {surname,name,total,pages,page,celebrityTitle,celebrityList}=this.state;
        return (
            <div className="genealogyDatabase" onLoad={(e)=>{store.dispatch(setPathname('/genealogyDatabase'))}}>
                <Header />
                <div className="genealogyDatabase_search" style={{backgroundImage:'url(./images/genealogyCulture_banner.jpg)'}}>
                    <div className="genealogyDatabase_search_title">
                         {
                             data.genealogyDatabase.map((item,key)=>{
                                 return (
                                     <Link to={item.url} key={key} className={key==2 ? 'active' :''}><img src={'./images/genealogyCulture_'+key+'.png'} />{item.title}</Link>
                                 )
                             })
                         }
                    </div>
                    <div className="genealogyDatabase_search_btn w_1170" onKeyUp={(e)=>this.getDataForSearch(e,2)}>
                        <div className="input_group margin_left160">
                            <input type="text" value={surname} onChange={(e)=>{this.setState({surname:e.target.value})}} placeholder="请选择姓氏"  />
                            <Icon type="caret-down" style={{position:'absolute',top:'10px',right:'10px'}} />
                        </div>
                        <div className="input_group">
                            <input type="text" value={name} onChange={(e)=>{this.setState({name:e.target.value})}} placeholder="请输入人名"  />
                        </div>
                        <div className="input_group">
                            <a href="javascript:;" onClick={(e)=>this.getDataForSearch(e,1)}>搜索</a>
                        </div>
                    </div>
                </div>
                <div className='w_1170 celebrityContent'>
                    {
                        celebrityList.length ?
                        <table className='celebrityContentTable'>
                            <thead>
                                <tr>
                                    {
                                        celebrityTitle.length ?
                                        celebrityTitle.map((item,key)=>{
                                            return (
                                                <th key={key}>{item.title}</th>
                                            )
                                        }) : null
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    celebrityList.length ?
                                    celebrityList.map((item,key)=>{
                                        return (
                                            <tr key={key}>
                                            {
                                                item.map((item2,key2)=>{
                                                    return (
                                                        key2<12 ? <td key={key2}>{item2 ? item2 : '--'}</td> : null
                                                    )
                                                })
                                            }
                                            </tr>
                                        )
                                    }) : null
                                }
                            </tbody>
                        </table> : <NoData />
                    }
                    
                    {
                        pages > 1 ?
                        <div className="pagebox">
                            <div className="pageleft">
                                <span className="active" onClick={(e)=>this.handleGetDataForPage(e,1)} style={{marginRight:'10px'}}><Icon type="step-backward" />首页</span>
                                <span onClick={(e)=>this.handleGetDataForPage(e,2)}><Icon type="caret-left" />上一页</span>
                            </div>
                            <div className="pagenum">
                                当前第<input type="text" value={page} onChange={(e)=>{this.setState({page:e.target.value})}} />页，共{pages}页，{total}条搜索结果
                            </div>
                            <div className="pageright">
                                <span onClick={(e)=>this.handleGetDataForPage(e,4)}>末页<Icon type="step-forward" /></span>
                                <span onClick={(e)=>this.handleGetDataForPage(e,3)}  style={{marginRight:'10px'}}>下一页<Icon type="caret-right" /></span>
                            </div>
                        </div> : null
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = function (store) {
    return {
        planlist: store.planlist
    };
};
export default connect(mapStateToProps)(CelebrityDatabase);