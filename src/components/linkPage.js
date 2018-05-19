import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import store from '../redux/store.js';
import {Button,Icon} from 'antd';
import data from "../data/db.js";
import axios from 'axios';
import {getLocalTime,substrAndReplaceToEllipsis,getJSON} from './ADS.js';
import Header from './header.js';

import { show, deletePlan,setKeyword,getNewsList,setPathname} from '../actions/plan.js';
import './css/linkPage.css';

class LinkPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
            title: '1',
            content: '1',
            linkPage_news:''
        }
    }
    componentDidMount(){
        let self=this;

        let uri=self.props.planlist.api+('news/list?keyword=&type='+encodeURI('资讯')+'&sort=createTime&page=1&limit=6');
        let getConsultation=function(response){
            console.log(response);
            self.setState({linkPage_news:response.data.result});
        }
        getJSON(uri,getConsultation);
    }
    handleChange(e){
        this.setState({keyword:e.target.value});
        store.dispatch(setKeyword(e.target.value));
    }
    render() {
        const {linkPage_news}=this.state;
        return (
            <div className="linkPage" onLoad={(e)=>{store.dispatch(setPathname('/'))}}>
                <Header />
                <div className="linkPage_content">
                    <div className="linkPage_banner" style={{backgroundImage:'url(./images/index_banner.jpg)'}}>
                        <h1>家之有谱 犹国之有史也</h1>
                        <p>一部家谱就是一段被封存的家族历史回忆,传承历史文化翻阅家谱,</p>
                        <p>开始追寻家族在历史长河中遗留的足迹吧！</p>
                        <div className="linkPage_input">
                            <input value={this.state.keyword} onChange={this.handleChange.bind(this)} placeholder="请输入家谱名/姓氏/谱籍地等关键字" />
                            <Button type="primary" icon="search" style={{width:'150px',height:'50px',fontSize:'20px',borderRadius:0,float:'left'}}>Search</Button>
                        </div>
                    </div>
                    <div className="linkPage_nav w_1170">
                       {
                           (data.linkPage_nav).map((item,key)=>{
                                return (
                                    <Link to={item.url} key={key}>
                                        <div className="linkPage_img" style={{backgroundImage:'url(./images/index_qian.png)'}}><img src={"./images/index_"+(key+1)+".png"} alt="谱牒文化" /></div>
                                        <h3>{item.title}</h3>
                                        <p>{item.content_1}</p>
                                        <p>{item.content_2}</p>
                                    </Link>
                                )
                           })
                       }
                    </div>
                    <div className="linkPage_news w_1170">
                        <div className="linkPage_news_header">
                            <p>新闻咨询</p>
                            <Link to="/news">查看更多»</Link>
                        </div>
                        {
                            linkPage_news.length ?
                            linkPage_news.map((item,key)=>{
                                return (
                                    <Link className="linkPage_new" to={'/newsDetail:'+item._id} key={key}>
                                        <h3>{item.title}</h3>
                                        <p><Icon type="calendar" />{getLocalTime(item.createTime,'-',1)}</p>
                                        <p>{substrAndReplaceToEllipsis(item.content,80)}</p>
                                    </Link>
                                )
                            }) : null
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
export default connect(mapStateToProps)(LinkPage);