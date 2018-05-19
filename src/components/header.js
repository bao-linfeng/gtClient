import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import store from '../redux/store.js';
import {Button,Icon} from 'antd';
import data from "../data/db.js";
import {getLocalTime,substrAndReplaceToEllipsis} from './ADS.js';

import { show, deletePlan,setKeyword,getNewsList,setToken } from '../actions/plan.js';
import './css/header.css';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
            title: '1',
            content: '1',
            linkPage_news:'',
            token:'',
            avatar:'./images/ava.png',
        }
    }
    componentDidMount(){
        let self=this,token,username,avatar=localStorage.getItem('avatar');
        
        token=localStorage.getItem('token');
        username=localStorage.getItem('username');
        self.setState({token:token,avatar:(avatar && avatar != 'undefined' ? avatar : './images/ava.png')});
        data.header_nav_user[0].title='用户名:'+username;
    }
    handleLogout(){
        this.setState({token:''});
        this.props.history.push('/');
        localStorage.setItem('token','');
        localStorage.setItem('username','');
        localStorage.setItem('userId','');
        localStorage.setItem('avatar','');
        store.dispatch(setToken(''));
    }
    render() {
        const {linkPage_news,token,avatar}=this.state;
        return (
            <div className="header">
                <div className="header_content w_1170">
                    <Link to="/"><img src="./images/header_logo.png" alt="logo" /></Link>
                    <div className="header_nav">
                        {
                            data.header_nav.map((item,key)=>{
                                return (
                                  (key >= 6 && token) ? null : <Link className={this.props.planlist.pathname == item.url ? "active" : ''} to={item.url} key={key}>{item.title}</Link>
                                )
                            })
                        }
                        {
                            token ? 
                            <div className="header_nav_user">
                                <Link to="/"><img src={avatar} alt="avatar" /></Link>
                                <div className="header_user_list">
                                    {
                                        data.header_nav_user.map((item,key)=>{
                                            return (
                                                <Link to={item.url} key={key} style={{borderBottom:(key == 0 ? '1px solid #ddd' : 'none')}}>{item.title}</Link>
                                            )
                                        })
                                    }
                                    <a href="javascript:;" onClick={(e)=>this.handleLogout(e)}>退出</a>
                                </div>
                            </div> : null
                        }
                        
                    </div>
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
export default connect(mapStateToProps)(Header);