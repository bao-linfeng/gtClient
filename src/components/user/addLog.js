import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import store from '../../redux/store.js';
import {Button,Icon,Radio,message} from 'antd';
import data from "../../data/db.js";
import {getJSON,postJSON,getLocalTime} from '../ADS.js';
import Header from '../header.js';
import Footer from '../footer.js';
import UserLeft from './userLeft.js';
import NoData from '../noData.js';

import {getNewsList,setPathname } from '../../actions/plan.js';
import '../css/user.css';

const RadioGroup = Radio.Group;

class AddLog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title:'',
            content:'',
            isShow:'仅自己可见',
            isShare:'是',
            operateType:'add',
            userId:'',
            id:'',
        }
    }
    componentWillMount(){
        let self=this,userId=localStorage.getItem('userId'),search,operateType,id;
        search=this.props.history.location.pathname.substring(8).split('-');
        operateType=search[0];
        id=search[1];
        self.setState({userId:userId,operateType:operateType,id:id});

        let url=this.props.planlist.api+'log/detail?id='+id+'&userId='+userId;
        let getGenealogy=function(response){
            console.log(response.data);
            let data=response.data;
            self.setState({title:data.result.title,content:data.result.content,isShare:data.result.isShare,isShow:data.result.isShow});
        }
        if(id){
            getJSON(url,getGenealogy);
        }
    }
    componentDidMount(){
        let self=this,userId=localStorage.getItem('userId');
        self.setState({userId:userId});
    }
    handleSendGenealogy(e){
        let self=this,url=this.props.planlist.api+('log/add_update');
        const {title,content,isShare,isShow,operateType,userId,id} = self.state;

        let body={id:id,operateType:operateType,title:title,content:content,isShare:isShare,isShow:isShow,userId:userId}
        let getData=function(response){
            let data=response.data;
            message.success(data.msg);
            self.props.history.push('/myLog');
        }
        if(title && content){
            postJSON(url,body,getData);
        }else{
            message.warn('标题和内容不能为空');
        }
    }
    render() {
        const {isShare,isShow,operateType,title,content}=this.state;
        return (
            <div className="userBox" onLoad={(e)=>{store.dispatch(setPathname(''))}}>
                <Header />
                <div className='w_1170 userCenter'>
                    <UserLeft />
                    <div className='userInfo_content'>
                        <div className='user_title'>
                            <span>创建日志</span>
                            <Link to='/myLog' className='updateGenBtn'>返回上一页</Link>
                        </div>
                        <ul className='userInfo_form'>
                            <li>
                                <label><i style={{color:'#f00'}}>*</i>日志标题:</label>
                                <input type='text' value={title} onChange={(e)=>{this.setState({title:e.target.value})}} placeholder='请输入日志标题' />
                            </li>
                            <li>
                                <label><i style={{color:'#f00'}}>*</i>编辑内容:</label>
                                <textarea value={content} onChange={(e)=>{this.setState({content:e.target.value})}} placeholder='请输入日志内容'></textarea>
                            </li>
                            <li>
                                <label>是否可见:</label>
                                <RadioGroup onChange={(e)=>{this.setState({isShow:e.target.value})}} value={isShow}>
                                    <Radio value='仅自己可见'>仅自己可见</Radio>
                                    <Radio value='亲友'>亲友</Radio>
                                    <Radio value='同姓氏'>同姓氏</Radio>
                                    <Radio value='全文'>全文</Radio>
                                </RadioGroup>
                            </li>
                            <li>
                                <label>可被分享:</label>
                                <RadioGroup onChange={(e)=>{this.setState({isShare:e.target.value})}} value={isShare}>
                                    <Radio value='是'>是</Radio>
                                    <Radio value='否'>否</Radio>
                                </RadioGroup>
                            </li>
                            <li style={{borderTop:'1px solid #ddd',paddingTop:'20px'}}>
                                <Button onClick={(e)=>this.handleSendGenealogy(e)}>{operateType == 'add' ? '确定' : '编辑'}</Button>
                            </li>
                        </ul>
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
export default connect(mapStateToProps)(AddLog);