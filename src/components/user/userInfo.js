import React, {
    Component
} from 'react';
import {
    connect
} from 'react-redux';
import {
    Link
} from 'react-router-dom';
import store from '../../redux/store.js';
import {
    Button,
    Icon,
    Radio,
    DatePicker,
    message,
    Popconfirm,
    Select
} from 'antd';
import moment from 'moment';
import data from "../../data/db.js";
import {
    getJSON,
    postJSON,
    getLocalTime
} from '../ADS.js';
import Header from '../header.js';
import Footer from '../footer.js';
import UserLeft from './userLeft.js';
import NoData from '../noData.js';

import {
    getNewsList,
    setPathname
} from '../../actions/plan.js';
import '../css/user.css';

const RadioGroup = Radio.Group;
const Option = Select.Option;

class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            surname: '',
            name: '',
            sex: '男',
            birthday: '2018-05-03',
            tel: '',
            userId: '',
            tabIndex: 0,
            genealogyList: '',
            limit: 12,
            page: 1,
            pages: 1,
            total: 0,
            roleId: 0,
        }
    }
    componentWillMount() {
        let self = this,
            userId = localStorage.getItem('userId');
        if (!userId) {
            self.props.history.push('/');
            return false;
        }
        self.setState({
            userId: userId
        });

        let url = this.props.planlist.api + 'user/detail?userId=' + userId;
        let getUserInfo = function(response) {
            console.log(response.data);
            let data = response.data.result;
            self.setState({
                email: data.email,
                surname: (data.surname || ''),
                name: data.name,
                sex: data.sex,
                birthday: getLocalTime(data.birthday, '-', 1),
                tel: data.tel,
                roleId: data.roleId
            });
        }
        getJSON(url, getUserInfo);
    }
    componentDidMount() {

    }
    handleGetUsersList() {
        let self = this;
        const {
            limit
        } = self.state;
        let url = this.props.planlist.api + 'users/list?page=1&limit=' + limit;
        let getGenealogy = function(response) {
            console.log(response.data);
            let data = response.data;
            self.setState({
                genealogyList: data.result,
                total: data.total,
                pages: Math.ceil(data.total / limit)
            });
        }
        getJSON(url, getGenealogy);
    }
    handleGetDataForPage(e, type) {
        const {
            page,
            total,
            pages,
            limit,
            userId
        } = this.state;
        let pager = 0,
            self = this;
        switch (type) {
            case 1:
                if (page <= 1) {
                    return false;
                } else {
                    pager = 1;
                }
                break;
            case 2:
                if (page <= 1) {
                    return false;
                } else {
                    pager = page - 1;
                }
                break;
            case 3:
                if (page >= pages) {
                    return false;
                } else {
                    pager = page + 1;
                }
                break;
            case 4:
                if (page >= pages) {
                    return false;
                } else {
                    pager = pages;
                }
                break;
        }
        this.setState({
            page: pager
        });

        let url = this.props.planlist.api + 'users/list?page=' + pager + '&limit=' + limit;
        let getGenealogyInit = function(response) {
            let data = response.data;
            self.setState({
                genealogyList: data.result,
                total: data.total,
                pages: Math.ceil(data.total / limit)
            });
        }
        getJSON(url, getGenealogyInit);
    }
    handleDelete(e, id) {
        let self = this;
        const {
            userId
        } = self.state;
        e.preventDefault();
        let url = this.props.planlist.api + 'users/delete';
        let body = {
            id: id,
            userId: userId
        }
        let getData = function(response) {
            let data = response.data;
            message.success(data.msg);

            self.handleGetUsersList();
        }
        postJSON(url, body, getData);
    }
    handleChangeTag(e, key) {
        this.setState({
            tabIndex: key
        });
        this.handleGetUsersList();
    }
    handleSendInfo(e) {
        let self = this;
        const {
            userId,
            email,
            surname,
            name,
            sex,
            birthday
        } = self.state;
        let url = this.props.planlist.api + ('user/update');
        let body = {
            userId: userId,
            email: email,
            surname: surname,
            name: name,
            sex: sex,
            birthday: birthday
        }
        let getData = function(response) {
            let data = response.data;
            alert(data.msg);
        }
        postJSON(url, body, getData);
    }
    handleUpdateRoleId(e, key, id) {
        let self = this;

        const {
            userId,
        } = self.state;
        let url = this.props.planlist.api + ('users/update/roleId');
        let body = {
            userId: userId,
            id: id,
            roleId: (self.state['roleId' + key] || 1)
        }
        let getData = function(response) {
            let data = response.data;
            message.success(data.msg);
        }
        postJSON(url, body, getData);
    }
    render() {
        const {
            email,
            surname,
            name,
            sex,
            birthday,
            tel,
            tabIndex,
            genealogyList,
            pages,
            total,
            page,
            roleId
        } = this.state;
        return (
            <div className="userBox" onLoad={(e)=>{store.dispatch(setPathname('/userInfo'))}}>
                <Header />
                <div className='w_1170 userCenter'>
                    <UserLeft />
                    <div className='userInfo_content'>
                        <div className='user_title'>
                            <i className={0 == tabIndex ? 'active' : ''} onClick={(e)=>this.handleChangeTag(e,0)}>个人资料</i>
                            {
                                roleId == 2 ? <i className={1 == tabIndex ? 'active' : ''} onClick={(e)=>this.handleChangeTag(e,1)}>用户列表</i> : null
                            }
                        </div>
                        {
                            tabIndex == 0 ?
                            <ul className='userInfo_form'>
                                <li>
                                    <label>电话号码</label>
                                    {tel ? tel : '未命名'}
                                    <span>修改</span>
                                    <i>仅自己可见</i>
                                </li>
                                <li>
                                    <label>邮箱</label>
                                    <input type='text' value={email} onChange={(e)=>{this.setState({email:e.target.value})}} placeholder='请输入邮箱' />
                                </li>
                                <li>
                                    <label>真实姓名</label>
                                    <input type='text' className='input_200' value={surname} onChange={(e)=>{this.setState({surname:e.target.value})}} placeholder='请输入姓氏' />
                                    <input type='text' className='input_200' value={name} onChange={(e)=>{this.setState({name:e.target.value})}} placeholder='请输入名字' />
                                </li>
                                <li>
                                    <label>性别</label>
                                    <RadioGroup onChange={(e)=>{this.setState({sex:e.target.value})}} value={sex}>
                                        <Radio value='男'>男</Radio>
                                        <Radio value='女'>女</Radio>
                                    </RadioGroup>
                                </li>
                                <li>
                                    <label>生日</label>
                                    <DatePicker defaultValue={moment(birthday,'YYYY-MM-DD')} onChange={(date)=>{this.setState({birthday:date})}} style={{margin:0}} />
                                </li>
                                <li style={{borderTop:'1px solid #ddd'}}>
                                    <a className='userInfo_btn' onClick={(e)=>this.handleSendInfo(e)}>确定</a>
                                </li>
                            </ul> : null
                        }
                        {
                            genealogyList.length && tabIndex == 1 ? 
                            <div className='myDonation_title'>
                                {
                                    
                                    ['用户名','性别','电话','生日','邮箱','操作'].map((item,key)=>{
                                        return (
                                            <span key={key}>{item}</span>
                                        )
                                    }) 
                                }
                            </div> : null
                        }
                        {
                            genealogyList.length && tabIndex == 1 ? 
                            genealogyList.map((item,key)=>{
                                return (
                                    <span key={key} className='my_donation_list'>
                                        <span>{item.username}</span>
                                        <span>{item.sex}</span>
                                        <span>{item.tel}</span>
                                        <span>{item.birthday ? getLocalTime(item.birthday,'-',1) : ''}</span>
                                        <span>{item.email}</span>
                                        <span>
                                            <Select defaultValue={1} style={{ width: 80 }} onChange={(value)=>{this.setState({['roleId'+key]:value})}}>
                                            {
                                                ['普通用户','管理员'].map((item,key)=>{
                                                    return (
                                                        <Option value={key+1} key={key}>{item}</Option>
                                                    )
                                                })
                                            }
                                            </Select>
                                            <Icon type='sync' style={{marginRight:'10px'}} onClick={(e)=>this.handleUpdateRoleId(e,key,item._id)} />
                                            <Popconfirm title="确定要删除这个家谱吗？" onConfirm={(e)=>this.handleDelete(e,item._id)} onCancel={(e)=>{e.preventDefault()}}><Icon type='delete' /></Popconfirm>
                                        </span>
                                    </span>
                                )
                            }) : null
                        }
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

const mapStateToProps = function(store) {
    return {
        planlist: store.planlist
    };
};
export default connect(mapStateToProps)(UserInfo);