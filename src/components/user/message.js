import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import store from '../../redux/store.js';
import {Button,Icon,message,Badge} from 'antd';
import {getJSON,postJSON,getLocalTime} from '../ADS.js';
import Header from '../header.js';
import Footer from '../footer.js';
import UserLeft from './userLeft.js';
import NoData from '../noData.js';

import {getNewsList,setPathname } from '../../actions/plan.js';
import '../css/user.css';

class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId:'',
            genealogyList:'',
            total:0,
            page:1,
            pages:0,
            limit:10,
        }
    }
    componentWillMount(){
        let self=this,userId=localStorage.getItem('userId');
        const {limit} = self.state;
        self.setState({userId:userId});
        let url=this.props.planlist.api+'message/list?userId='+userId+'&page=1&limit='+limit;
        let getGenealogy=function(response){
            console.log(response.data);
            let data=response.data;
            self.setState({genealogyList:data.result,total:data.total,pages:Math.ceil(data.total/limit)});
        }
        getJSON(url,getGenealogy);
    }
    componentDidMount(){
        
    }
    handleGetDataForPage(e,type){
        const {page,total,pages,limit,userId,isAnswer} = this.state;
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

        let url=this.props.planlist.api+'message/list?userId='+userId+'&page='+pager+'&limit='+limit;
        let getGenealogyInit=function(response){
            let data=response.data;
            self.setState({genealogyList:data.result,total:data.total,pages:Math.ceil(data.total/limit)});
        }
        getJSON(url,getGenealogyInit);
    }
    handleRead(e,item){
        var self=this;
        const {userId,genealogyList} = self.state;

        let url=this.props.planlist.api+'message/read';
        let body={id:item._id,userId:userId};
        let getData=function(response){
            let data=response.data;
            message.success(data.msg);

            for(var i=0;i<genealogyList.length;i++){
                if(genealogyList[i]._id == item._id){
                    genealogyList[i].isRead=true;
                }
            }
            self.setState({genealogyList:genealogyList});
        }
        if(!item.isRead){
            postJSON(url,body,getData);
        }
    }
    render() {
        const {genealogyList,pages,total,page}=this.state;
        return (
            <div className="userBox" onLoad={(e)=>{store.dispatch(setPathname('/message'))}}>
                <Header />
                <div className='w_1170 userCenter'>
                    <UserLeft />
                    <div className='userInfo_content' style={{paddingBottom:'66px',position:'relative'}}>
                        <div className='user_title'>
                            <span>消息推送</span>
                        </div>
                        <div className='userInfo_form' style={{paddingTop:'20px'}}>
                        {
                            genealogyList.length ? 
                            genealogyList.map((item,key)=>{
                                return (
                                    <div key={key} className='my_expertConsultation_list' style={{color:(item.isRead ? '#999' : '#333')}} onClick={(e)=>this.handleRead(e,item)}>
                                        <h3>{item.title}{item.isRead ? null : <Badge status="error" style={{float:'left'}} />}</h3>
                                        <Icon type='calendar' />{getLocalTime(item.createTime,'-',1)}
                                        <p>{item.content}</p>
                                    </div>
                                )
                            }) : <NoData />
                        }
                        </div>
                        {
                            pages > 1 ?
                            <div className="pagebox userPage">
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
export default connect(mapStateToProps)(Message);