import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import store from '../../redux/store.js';
import {Button,Icon,message} from 'antd';
import moment from 'moment';
import data from "../../data/db.js";
import {getJSON,postJSON,getLocalTime} from '../ADS.js';
import Header from '../header.js';
import Footer from '../footer.js';
import UserLeft from './userLeft.js';
import NoData from '../noData.js';

import {getNewsList,setPathname } from '../../actions/plan.js';
import '../css/user.css';

class LogDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId:'',
            genealogyDetail:'',
            id:'',
            likeCount:0,
            collectCount:0,
            islike:false,
            iscollect:false
        }
    }
    componentWillMount(){
        let self=this,userId=localStorage.getItem('userId'),id=this.props.history.location.pathname.substring(11);

        self.setState({userId:userId,id:id});
        let url=this.props.planlist.api+'log/detail?id='+id+'&userId='+userId;
        let getGenealogy=function(response){
            console.log(response.data);
            let data=response.data;
            self.setState({genealogyDetail:data.result,likeCount:data.result.likeCount,collectCount:data.result.collectCount,islike:data.islike,iscollect:data.isCollect});
        }
        getJSON(url,getGenealogy);
    }
    componentDidMount(){
        
    }
    handleClickHabit(e,serviceType,operateType,collection){
        let url=(this.props.planlist.api+'habit/toggle'),self=this,likeFlag=false;
        let body={id:self.state.id,userId:self.state.userId,serviceType:serviceType,operateType:operateType,collection:collection}
        let getData=function(response){
            console.log(response);
            if(response.data.msg){
                console.log(response.data.msg);
            }else{
                likeFlag=true;
                self.setState({['is'+operateType]:response.data['is'+operateType],[operateType+'Count']:response.data[operateType+'Count']});
            }
        }
        postJSON(url,body,getData);
        if(self.state.userId){
            if(likeFlag){
                postJSON(url,body,getData);
            }
        }else{
            alert('请先登录');
        }
        return false;
    }
    render() {
        const {genealogyDetail,likeCount,collectCount,islike,iscollect}=this.state;
        return (
            <div className="userBox" onLoad={(e)=>{store.dispatch(setPathname(''))}}>
                <Header />
                <div className='w_1170 userCenter'>
                    <UserLeft />
                    <div className='userInfo_content' style={{paddingBottom:'66px',position:'relative'}}>
                        <div className='user_title'>
                            <span>日志详情</span>
                        </div>
                        {
                            genealogyDetail ? 
                            <div className='genealogyDetail'>
                                <h3>{genealogyDetail.title}</h3>
                                <p><Icon type='calendar' />{getLocalTime(genealogyDetail.createTime,'-',1)}</p>
                                <p>{genealogyDetail.content}</p>
                                <div className='action_view'>
                                    <Icon type='eye-o' style={{margin:'0 5px 0 20px',color:'blue'}} />{genealogyDetail.seeCount}查看
                                    <Icon type={islike ? 'like' : 'like-o'} onClick={(e)=>this.handleClickHabit(e,5,'like','log')} style={{margin:'0 5px 0 20px',color:'orange',cursor:'pointer'}} />{likeCount}赞
                                    <Icon type={iscollect ? 'heart' : 'heart-o'} onClick={(e)=>this.handleClickHabit(e,5,'collect','log')} style={{margin:'0 5px 0 20px',color:'#f00',cursor:'pointer'}} />{collectCount}收藏
                                </div>
                            </div> : <NoData />
                        }
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

const mapStateToProps = function (store) {
    return {
        planlist: store.planlist
    };
};
export default connect(mapStateToProps)(LogDetail);