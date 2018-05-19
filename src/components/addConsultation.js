import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import store from '../redux/store.js';
import {Button,Icon,Select,Upload} from 'antd';
import {getJSON,postJSON} from './ADS.js';
import Header from './header.js';

import {getNewsList } from '../actions/plan.js';
import './css/expertConsultation.css';

const Option = Select.Option;

class AddConsultation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title:'',
            type:'家谱',
            content:'',
            cover:'',
            originalname:'',
            name:'',
            email:'',
            tel:'',
            userId:'',
        }
    }
    componentDidMount(){
        let self=this,userId=localStorage.getItem('userId');
        self.setState({userId:userId});
    }
    handleChangeCover(info){
        if (info.file.status === 'done') {
            console.log(info.file.response);
            let file=info.file.response;
            this.setState({cover:file.filePath,originalname:file.originalname});
        } 
    }
    handleSubmitForm(){
        let self=this;
        const {title,type,content,cover,name,email,tel,originalname,userId}=self.state;

        let url=this.props.planlist.api+('consultation/add');
        let body={title:title,type:type,content:content,cover:cover,originalname:originalname,name:name,email:email,tel:tel,userId:userId}
        let getData=function(response){
            let data=response.data;
            if(data.ok == 1){
                alert('提交成功');
                self.setState({title:'',content:'',cover:'',name:'',email:'',tel:'',originalname:''});
            }
        }
        if(title && type && content){
            postJSON(url,body,getData);
        }
    }
    render() {
        const {title,type,content,cover,name,email,tel}=this.state;
        return (
            <div className="addConsultation">
                <Header />
                <div className="breadcrumbNavigation w_1170">
                    <Link to='/'>首页</Link>»
                    <Link to='/expertConsultation'>专家咨询</Link>»
                    <span>我要提问</span>
                </div>
                <div className="addConsultation_form w_1170">
                    <h3>我要提问</h3>
                    <ul className='addConsultation_form_ul'>
                        <li>
                            <label><i>*</i>标题:</label>
                            <input type='text' value={title} onChange={(e)=>{this.setState({title:e.target.value})}} placeholder='请输入标题，最多100个字' />
                        </li>
                        <li>
                            <label><i>*</i>类型:</label>
                            <Select defaultValue={type} style={{ width: 120 }} onChange={(value)=>{this.setState({type:value})}}>
                            {
                                ['家谱','寻根','委托查询','文献复制','阅读服务'].map((item,key)=>{
                                    return (
                                        <Option value={item} key={key}>{item}</Option>
                                    )
                                })
                            }
                            </Select>
                        </li>
                        <li>
                            <label><i>*</i>内容:</label>
                            <textarea value={content} onChange={(e)=>{this.setState({content:e.target.value})}}></textarea>
                        </li>
                        <li>
                            <label>上传图片:</label>
                            <Upload name='avatar' action='http://127.0.0.1:8081/upload' onChange={(info)=>this.handleChangeCover(info)}>
                                <Button>
                                <Icon type="upload" />点击上传
                                </Button>
                            </Upload>
                            {
                                cover ? <img src={'http://127.0.0.1:8081/'+cover} /> : null
                            }
                        </li>
                        <li>
                            <label>姓名:</label>
                            <input className='w_300' type='text' value={name} onChange={(e)=>{this.setState({name:e.target.value})}} />
                        </li>
                        <li>
                            <label>Email:</label>
                            <input className='w_300' type='text' value={email} onChange={(e)=>{this.setState({email:e.target.value})}} />
                        </li>
                        <li>
                            <label>电话:</label>
                            <input className='w_300' type='text' value={tel} onChange={(e)=>{this.setState({tel:e.target.value})}} />
                        </li>
                        <li style={{borderTop:'1px solid #ddd'}}>
                            <Button type='primary' style={{margin:'20px 20px 0 0'}} onClick={(e)=>this.handleSubmitForm(e)}>提交</Button>
                            <Button type='default'>取消</Button>
                        </li>
                    </ul>
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
export default connect(mapStateToProps)(AddConsultation);