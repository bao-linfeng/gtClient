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
    Popconfirm
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

class GenealogyList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            genealogyList: '',
            total: 0,
            page: 1,
            pages: 0,
            limit: 12,
            gname: '',
        }
    }
    componentWillMount() {
        let self = this,
            userId = localStorage.getItem('userId');
        self.setState({
            userId: userId
        });
        this.handleGetGenealogyList();
    }
    componentDidMount() {

    }
    handleGetGenealogyList() {
        let self = this;
        const {
            limit
        } = self.state;
        let url = this.props.planlist.api + 'genealogyList/list?page=1&limit=' + limit;
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

        let url = this.props.planlist.api + 'genealogyList/list?page=' + pager + '&limit=' + limit;
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
        let url = this.props.planlist.api + 'genealogyList/delete';
        let body = {
            id: id,
            userId: userId
        }
        let getData = function(response) {
            let data = response.data;
            message.success(data.msg);

            self.handleGetGenealogyList();
        }
        postJSON(url, body, getData);
    }
    handleEdit(e, id) {
        e.preventDefault();
        this.props.history.push('/adminAddGenealogy:edit' + id);
    }
    render() {
        const {
            genealogyList,
            pages,
            total,
            page,
            gname
        } = this.state;
        return (
            <div className="userBox" onLoad={(e)=>{store.dispatch(setPathname('/genealogyList'))}}>
                <Header />
                <div className='w_1170 userCenter'>
                    <UserLeft />
                    <div className='userInfo_content' style={{paddingBottom:'66px',position:'relative'}}>
                        <div className='user_title'>
                            <span>家谱列表</span>
                            <Link to='/adminAddGenealogy:add' className='updateGenBtn'>新增家谱</Link>
                        </div>
                        <div className='userInfo_form' style={{paddingTop:'20px'}}>
                            {
                                genealogyList.length ? 
                                <div className='myDonation_title'>
                                    {
                                        
                                        ['谱名','版本','撰修者','上传时间','堂号','操作'].map((item,key)=>{
                                            return (
                                                <span key={key}>{item}</span>
                                            )
                                        }) 
                                    }
                                </div> : null
                            }
                        {
                            genealogyList.length ? 
                            genealogyList.map((item,key)=>{
                                return (
                                    <Link to={'/myGenealogyDetail:'+item._id} key={key} className='my_donation_list'>
                                        <span>{item.gname}</span>
                                        <span>{item.version}</span>
                                        <span>{item.creator}</span>
                                        <span>{getLocalTime(item.createTime,'-',1)}</span>
                                        <span>{item.gtan}</span>
                                        <span>
                                            <Icon type='edit' onClick={(e)=>this.handleEdit(e,item._id)} style={{marginRight:'10px'}} />
                                            <Popconfirm title="确定要删除这个家谱吗？" onConfirm={(e)=>this.handleDelete(e,item._id)} onCancel={(e)=>{e.preventDefault()}}><Icon type='delete' /></Popconfirm>
                                        </span>
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

const mapStateToProps = function(store) {
    return {
        planlist: store.planlist
    };
};
export default connect(mapStateToProps)(GenealogyList);