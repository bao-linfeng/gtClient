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

class SurnameDatabase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            char:'A',
            surnames:['敖','安','艾'],
            surname:'敖'
        }
    }
    componentDidMount(){
        let self=this;
        let url=this.props.planlist.api+'famous/list?page=1&limit=20';
        let getCelebrityInit=function(response){
            let data=response.data.data;
            
        }
        getJSON(url,getCelebrityInit);
    }
    handleClickChar(e,item){
        let self=this;

        let url=('http://120.24.2.71:8530/_db/arango_gpro/my/gpro/surname?alpha='+item.toLowerCase());
        let getCharInit=function(response){
            let data=response.data;
            self.setState({char:item,surnames:data.result,surname:data.result[0]});
        }
        getJSON(url,getCharInit);
    }
    render() {
        const {surnames,char,surname}=this.state;
        console.log(data.charSet);
        return (
            <div className="genealogyDatabase" onLoad={(e)=>{store.dispatch(setPathname('/genealogyDatabase'))}}>
                <Header />
                <div className="genealogyDatabase_search" style={{backgroundImage:'url(./images/genealogyCulture_banner.jpg)'}}>
                    <div className="genealogyDatabase_search_title">
                         {
                             data.genealogyDatabase.map((item,key)=>{
                                 return (
                                     <Link to={item.url} key={key} className={key==1 ? 'active' :''}><img src={'./images/genealogyCulture_'+key+'.png'} />{item.title}</Link>
                                 )
                             })
                         }
                    </div>
                    <div className="genealogyDatabase_search_btn w_1170">
                        <div className='surnameDatabaseChar'>
                            {
                                data.charSet.map((item,key)=>{
                                    return (
                                        <span key={key} className={item == char ? 'active' : ''} onClick={(e)=>this.handleClickChar(e,item)}>{item}</span>
                                    )
                                })
                            }
                        </div>
                        <div className='surnameDatabaseChar surnameDatabaseName'>
                            {
                                surnames.length ?
                                surnames.map((item,key)=>{
                                    return (
                                        <span key={key} className={item == surname ? 'active' : ''} onClick={(e)=>{this.setState({surname:item})}} style={{width:(item.length > 1 ? '72px' : '36px')}}>{item}</span>
                                    )
                                }) : null
                            }
                        </div>
                    </div>
                </div>
                <div className='w_1170 celebrityContent'>
                    
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
export default connect(mapStateToProps)(SurnameDatabase);