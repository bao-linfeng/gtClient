import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import store from '../../redux/store.js';
import {Button,Icon,Select} from 'antd';
import data from "../../data/db.js";
import {postJSON} from '../ADS.js';
import Header from '../header.js';
import Footer from '../footer.js';
import UserLeft from './userLeft.js';

import {getNewsList,setPathname } from '../../actions/plan.js';
import '../css/user.css';

const Option = Select.Option;

class AddNews extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title:'',
            type:'资讯',
            content:'',
        }
    }
    componentDidMount(){
        let self=this;
    }
    handleSendNews(e){
        const {title,type,content} = this.state;
        let self=this,url=this.props.planlist.api+('news/add');
        let body={title:title,type:type,content:content}
        let getData=function(response){
            let data=response.data;
            if(data.ok == 1){
                alert('提交成功');
                self.setState({title:'',content:''});
            }
        }
        if(title && type && content){
            postJSON(url,body,getData);
        }
    }
    render() {
        const {type,title,content,birthday}=this.state;
        return (
            <div className="userBox" onLoad={(e)=>{store.dispatch(setPathname('/addNews'))}}>
                <Header />
                <div className='w_1170 userCenter'>
                    <UserLeft />
                    <div className='userInfo_content'>
                        <div className='user_title'>
                            <span>新闻资讯</span>
                        </div>
                        <ul className='userInfo_form'>
                            <li>
                                <label>标题</label>
                                <input type='text' value={title} onChange={(e)=>{this.setState({title:e.target.value})}} placeholder='请输入标题' />
                            </li>
                            <li>
                                <label>类型</label>
                                <Select defaultValue={type} style={{ width: 120 }} onChange={(value)=>{this.setState({type:value})}}>
                                    {
                                        ['资讯','展览','百科'].map((item,key)=>{
                                            return (
                                                <Option value={item} key={key}>{item}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            </li>
                            <li>
                                <label>内容</label>
                                <textarea className='news_content' value={content} onChange={(e)=>{this.setState({content:e.target.value})}}>{content}</textarea>
                            </li>
                            <li style={{borderTop:'1px solid #ddd'}}>
                                <a className='userInfo_btn' onClick={(e)=>this.handleSendNews(e)}>确定</a>
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
export default connect(mapStateToProps)(AddNews);