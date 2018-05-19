import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import store from '../../redux/store.js';
import {Button,Icon,Radio,DatePicker,Upload,message} from 'antd';
import moment from 'moment';
import data from "../../data/db.js";
import {getJSON,postJSON,getLocalTime} from '../ADS.js';
import Header from '../header.js';
import Footer from '../footer.js';
import UserLeft from './userLeft.js';
import NoData from '../noData.js';

import {getNewsList,setPathname } from '../../actions/plan.js';
import '../css/user.css';

const RadioGroup = Radio.Group;

class AddGenealogy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gname:'',
            surname:'',
            gplace:'',
            gtan:'',
            volume:'',
            ancestor:'',
            original:'',
            version:'',
            creator:'',
            gsummary:'',
            filePath:'',
            cover:'',
            isShow:'仅自己可见',
            isShare:'是',
            serviceType:'1',
            operateType:'add',
            userId:'',
            id:'',
        }
    }
    componentWillMount(){
        let self=this,userId=localStorage.getItem('userId'),search,serviceType,operateType,id;
        search=this.props.history.location.pathname.substring(14).split('-');
        serviceType=search[0];
        operateType=search[1];
        id=search[2];
        const {limit} = self.state;
        self.setState({userId:userId,serviceType:serviceType,operateType:operateType,id:id});

        let url=this.props.planlist.api+'genealogy/detail?id='+id;
        let getGenealogy=function(response){
            console.log(response.data);
            let data=response.data.result;
            self.setState({gname:data.gname,surname:data.surname,gplace:data.gplace,gtan:data.gtan,volume:data.volume,ancestor:data.ancestor,original:data.original,version:data.version,creator:data.creator,gsummary:data.gsummary,filePath:data.filePath,cover:data.cover,isShare:data.isShare,isShow:data.isShow});
        }
        if(id){
            getJSON(url,getGenealogy);
        }
    }
    componentDidMount(){
        let self=this,userId=localStorage.getItem('userId');
        self.setState({userId:userId});
    }
    beforeUpload(file){
        const isJPG = (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png');
        if (!isJPG) {
            message.error('只允许jpeg、jpg、png格式!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片大小不能超过2MB!');
        }
        return isJPG && isLt2M;
    }
    handleChange = (info) => {
        if (info.file.status === 'done') {
            message.success('上传成功');
            this.setState({cover:(this.props.planlist.api+info.file.response.filePath)});
        }
    }
    beforeUploadFile(file){
        const isJPG = (file.type == 'application/x-zip-compressed' || file.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type == 'application/pdf');
        if(!isJPG){
            message.error('文件类型只能为pdf、docx、zip');
            return false;
        }

        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片大小不能超过2MB!');
            return false;
        }
    }
    handleChangeFile = (info) => {
        if (info.file.status === 'done') {
            message.success('上传成功');
            this.setState({filePath:(this.props.planlist.api+info.file.response.filePath)});
        }
    }
    handleSendGenealogy(e){
        let self=this,url=this.props.planlist.api+('genealogy/add_update');
        const {gname,surname,gplace,gtan,volume,ancestor,original,version,creator,gsummary,filePath,cover,isShare,isShow,serviceType,operateType,userId,id} = self.state;

        let body={id:id,operateType:operateType,gname:gname,surname:surname,gplace:gplace,gtan:gtan,volume:volume,ancestor:ancestor,original:original,version:version,creator:creator,gsummary:gsummary,filePath:filePath,cover:cover,isShare:isShare,isShow:isShow,serviceType:serviceType,userId:userId}
        let getData=function(response){
            let data=response.data;
            message.success(data.msg);
            
            if(serviceType == 1){
                self.props.history.push('/myGenealogy');
            }else{
                self.props.history.push('/myDonation');
            }
        }
        if(gname && surname && cover && filePath){
            postJSON(url,body,getData);
        }else{
            message.warn('谱名、姓氏、封面、文件不能为空');
        }
    }
    render() {
        const {gname,surname,gplace,gtan,volume,ancestor,original,version,creator,gsummary,filePath,cover,isShare,isShow,serviceType,operateType}=this.state;
        return (
            <div className="userBox" onLoad={(e)=>{store.dispatch(setPathname(serviceType == 1 ? '/myGenealogy' : '/myDonation'))}}>
                <Header />
                <div className='w_1170 userCenter'>
                    <UserLeft />
                    <div className='userInfo_content'>
                        <div className='user_title'>
                            <span>{serviceType == 1 ? '新建' : '捐赠'}家谱</span>
                            <Link to={serviceType == 1 ? '/myGenealogy' : '/myDonation'} className='updateGenBtn'>返回上一页</Link>
                        </div>
                        <ul className='userInfo_form'>
                            <li>
                                <label><i style={{color:'#f00'}}>*</i>谱名:</label>
                                <input type='text' value={gname} onChange={(e)=>{this.setState({gname:e.target.value})}} placeholder='请输入家谱名称,最多50个字' />
                            </li>
                            <li>
                                <label><i style={{color:'#f00'}}>*</i>姓氏:</label>
                                <input type='text' value={surname} onChange={(e)=>{this.setState({surname:e.target.value})}} placeholder='请输入姓氏' />
                            </li>
                            <li>
                                <label>谱籍地:</label>
                                <input type='text' value={gplace} onChange={(e)=>{this.setState({gplace:e.target.value})}} placeholder='请输入谱籍地' />
                            </li>
                            <li>
                                <label>堂号:</label>
                                <input type='text' value={gtan} onChange={(e)=>{this.setState({gtan:e.target.value})}} placeholder='请输入堂号' />
                            </li>
                            <li>
                                <label>卷数:</label>
                                <input type='text' value={volume} onChange={(e)=>{this.setState({volume:e.target.value})}} placeholder='请输入卷数' />
                            </li>
                            <li>
                                <label>始祖:</label>
                                <input type='text' value={ancestor} onChange={(e)=>{this.setState({ancestor:e.target.value})}} placeholder='请输入始祖' />
                            </li>
                            <li>
                                <label>始迁祖:</label>
                                <input type='text' value={original} onChange={(e)=>{this.setState({original:e.target.value})}} placeholder='请输入始迁祖' />
                            </li>
                            <li>
                                <label>版本年代:</label>
                                <input type='text' value={version} onChange={(e)=>{this.setState({version:e.target.value})}} placeholder='请输入版本时间' />
                            </li>
                            <li>
                                <label>修撰者:</label>
                                <input type='text' value={creator} onChange={(e)=>{this.setState({creator:e.target.value})}} placeholder='请输入撰修者' />
                            </li>
                            <li>
                                <label>摘要:</label>
                                <textarea value={gsummary} onChange={(e)=>{this.setState({gsummary:e.target.value})}} placeholder='请输入摘要'></textarea>
                            </li>
                            <li>
                                <label><i style={{color:'#f00'}}>*</i>上传封面:</label>
                                <Upload
                                    className="avatar-uploader"
                                    name="avatar"
                                    showUploadList={false}
                                    action={this.props.planlist.api+"upload"}
                                    beforeUpload={(file)=>this.beforeUpload(file)}
                                    onChange={(info)=>this.handleChange(info)}
                                >
                                <div className="addGenealogyCover">
                                    {cover ? <img src={cover} alt="avatar" /> : <Icon type='plus' className='gplus' />}
                                </div>
                                </Upload>
                            </li>
                            <li>
                                <label><i style={{color:'#f00'}}>*</i>上传家谱:</label>
                                <Upload 
                                className="avatar-uploader"
                                name="avatar"
                                showUploadList={false}
                                action={this.props.planlist.api+"upload"}
                                beforeUpload={(file)=>this.beforeUploadFile(file)}
                                onChange={(info)=>this.handleChangeFile(info)}>
                                    <Button type="ghost">
                                    <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>
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
export default connect(mapStateToProps)(AddGenealogy);