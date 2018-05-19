import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import store from '../../redux/store.js';
import {Button,Icon,Radio,DatePicker,message,Popconfirm,Tag} from 'antd';
import moment from 'moment';
import data from "../../data/db.js";
import {getJSON,postJSON,getLocalTime,switchType,substrAndReplaceToEllipsis} from '../ADS.js';
import Header from '../header.js';
import Footer from '../footer.js';
import UserLeft from './userLeft.js';
import NoData from '../noData.js';

import {getNewsList,setPathname } from '../../actions/plan.js';
import '../css/user.css';

const RadioGroup = Radio.Group;

class MyLog extends Component {
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
        const {limit,isAnswer} = self.state;
        self.setState({userId:userId});
        let url=this.props.planlist.api+'log/list?userId='+userId+'&page=1&limit='+limit;
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

        let url=this.props.planlist.api+'log/list?userId='+userId+'&page='+pager+'&limit='+limit;
        let getGenealogyInit=function(response){
            let data=response.data;
            self.setState({genealogyList:data.result,total:data.total,pages:Math.ceil(data.total/limit)});
        }
        getJSON(url,getGenealogyInit);
    }
    handleDelete(e,id){
        let self=this;
        const {userId}=self.state;
        e.preventDefault();
        let url=this.props.planlist.api+'log/delete';
        let body={id:id,userId:userId}
        let getData=function(response){
            let data=response.data;
            message.success(data.msg);
        }
        postJSON(url,body,getData);
    }
    handleEdit(e,id){
        e.preventDefault();
        this.props.history.push('/addLog:edit-'+id);
    }
    render() {
        const {genealogyList,pages,total,page}=this.state;
        return (
            <div className="userBox" onLoad={(e)=>{store.dispatch(setPathname('/myLog'))}}>
                <Header />
                <div className='w_1170 userCenter'>
                    <UserLeft />
                    <div className='userInfo_content' style={{paddingBottom:'66px',position:'relative'}}>
                        <div className='user_title'>
                            <span>我的日志</span>
                            <Link to='/addLog:add-' className='updateGenBtn'>创建日志</Link>
                        </div>
                        <div className='userInfo_form' style={{paddingTop:'20px'}}>
                        {
                            genealogyList.length ? 
                            genealogyList.map((item,key)=>{
                                return (
                                    <Link to={'/logDetail:'+item._id} key={key} className='my_expertConsultation_list'>
                                        <h3>{item.title}</h3>
                                        <Icon type='calendar' />{getLocalTime(item.createTime,'-',1)}
                                        <p>{substrAndReplaceToEllipsis(item.content,50)}</p>
                                        <Popconfirm title="确定要删除这个咨询吗？" onConfirm={(e)=>this.handleDelete(e,item._id)} onCancel={(e)=>{e.preventDefault()}}><Icon type='delete' className='my_expert_delete' /></Popconfirm>
                                        <Icon type='edit' onClick={(e)=>this.handleEdit(e,item._id)} className='my_expert_edit' />
                                    </Link>
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
export default connect(mapStateToProps)(MyLog);