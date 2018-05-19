import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import store from '../../redux/store.js';
import {Button,Icon,message,Badge,Tag} from 'antd';
import {getJSON,postJSON,getLocalTime} from '../ADS.js';
import Header from '../header.js';
import Footer from '../footer.js';
import UserLeft from './userLeft.js';
import NoData from '../noData.js';

import {getNewsList,setPathname } from '../../actions/plan.js';
import '../css/user.css';

function changeAgree(agree){
    switch(agree){
        case '0':
            return '已拒绝';
            break;
        case '1':
            return '待同意';
            break;
        case '2':
            return '已同意';
            break;
    }
}

class RelativeFriend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId:'',
            genealogyList:'',
            total:0,
            page:1,
            pages:0,
            limit:10,
            isShow:false,
            username:'',
            serviceType:0,
        }
    }
    componentWillMount(){
        let self=this,userId=localStorage.getItem('userId');
        const {limit} = self.state;
        self.setState({userId:userId});
        let url=this.props.planlist.api+'relativeFriend/list?userId='+userId+'&serviceType=0&page=1&limit='+limit;
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
        const {page,total,pages,limit,userId,serviceType} = this.state;
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

        let url=this.props.planlist.api+'relativeFriend/list?userId='+userId+'&serviceType='+serviceType+'&page='+pager+'&limit='+limit;
        let getGenealogyInit=function(response){
            let data=response.data;
            self.setState({genealogyList:data.result,total:data.total,pages:Math.ceil(data.total/limit)});
        }
        getJSON(url,getGenealogyInit);
    }
    handleAdd(e){
        let self=this;
        const {userId,username,serviceType} = self.state;

        let url=this.props.planlist.api+'relativeFriend/add';
        let body={username:username,userId:userId};
        let getData=function(response){
            let data=response.data;
            message.success(data.msg);

            self.setState({isShow:false,username:''});
        }
        if(username && userId){
            postJSON(url,body,getData);
        }
    }
    handleGetRelativeFriend(e,key){
        let self=this;
        const {limit,userId,serviceType} = self.state;

        self.setState({serviceType:key});
        let url=this.props.planlist.api+'relativeFriend/list?userId='+userId+'&serviceType='+key+'&page=1&limit='+limit;
        let getGenealogy=function(response){
            console.log(response.data);
            let data=response.data;
            self.setState({genealogyList:data.result,total:data.total,pages:Math.ceil(data.total/limit)});
        }
        getJSON(url,getGenealogy);
    }
    handleUpdateAgree(e,isAgree,id){
        let self=this;

        let url=this.props.planlist.api+'relativeFriend/update';
        let body={id:id,isAgree:isAgree};
        let getData=function(response){
            let data=response.data;
            message.success(data.msg);
        }
        postJSON(url,body,getData);
    }
    handleDelete(e,id){
        let url=this.props.planlist.api+'relativeFriend/delete';
        let body={id:id};
        let getData=function(response){
            let data=response.data;
            message.success(data.msg);
        }
        postJSON(url,body,getData);
    }
    render() {
        const {genealogyList,pages,total,page,username,isShow,serviceType}=this.state;
        return (
            <div className="userBox" onLoad={(e)=>{store.dispatch(setPathname('/message'))}}>
                <Header />
                <div className='w_1170 userCenter'>
                    <UserLeft />
                    <div className='userInfo_content' style={{paddingBottom:'66px',position:'relative'}}>
                        <div className='user_title'>
                        {
                            ['我的亲友','我的邀请','邀请我的'].map((item,key)=>{
                                return (
                                    <i key={key} className={key == serviceType ? 'active' : ''} onClick={(e)=>this.handleGetRelativeFriend(e,key)}>{item}</i>
                                )
                            })
                        }
                            <label className='updateGenBtn' onClick={(e)=>{this.setState({isShow:true})}}>邀请亲友</label>
                        </div>
                        <div className='userInfo_form' style={{paddingTop:'20px'}}>
                        {
                            genealogyList.length ? 
                            genealogyList.map((item,key)=>{
                                return (
                                    <div key={key} className='relativeFriend_list'>
                                        <img src={item.avatar && item.avatar != 'undefined' ? item.avatar : './images/ava.png'} />
                                        <h3>{item.username}</h3>
                                        <p><Icon type='calendar' />{item.tel}</p>
                                        <p><Icon type='mobile' />{getLocalTime(item.createTime,'-',1)}</p>
                                        {
                                            item.isAgree == 2 || item.isAgree == 0 ? <div className='relativeFriend_list_del' onClick={(e)=>this.handleDelete(e,item.relativeFriendId)}><Icon type='delete' /></div> : null
                                        }
                                        {
                                            (serviceType == 2 && item.isAgree == 1) ? 
                                            <div className='relativeFriend_list_agree'>
                                                <span onClick={(e)=>this.handleUpdateAgree(e,'2',item.relativeFriendId)} style={{borderRight:'1px solid #fff'}}>同意</span>
                                                <span onClick={(e)=>this.handleUpdateAgree(e,'0',item.relativeFriendId)}>拒绝</span>
                                            </div> : null
                                        }
                                        {
                                            serviceType >=1 ? <Tag style={{position:'absolute',top:'20px',right:'10px'}}>{changeAgree(item.isAgree)}</Tag> : null
                                        }
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
                {
                    isShow ? 
                    <div className='addFriend'>
                        <div className='addFriendBox'>
                            <div className='addFriend_title'>
                                <h3>邀请好友</h3>
                                <Icon type='close' className='addFriend_close' onClick={(e)=>{this.setState({isShow:false})}} />
                            </div>
                            <input type='text' value={username} onChange={(e)=>{this.setState({username:e.target.value})}} placeholder='请输入手机号、邮箱、账号名' />
                            <div className='addFriend_btn'>
                                <Button size='large' type='primary' style={{marginRight:'20px',width:'100px'}} onClick={(e)=>this.handleAdd(e)}>确定</Button>
                                <Button size='large' style={{width:'100px'}} onClick={(e)=>{this.setState({isShow:false})}}>取消</Button>
                            </div>
                        </div>
                    </div> : null
                }
            </div>
        )
    }
}

const mapStateToProps = function (store) {
    return {
        planlist: store.planlist
    };
};
export default connect(mapStateToProps)(RelativeFriend);