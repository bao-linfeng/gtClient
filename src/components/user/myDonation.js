import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import store from '../../redux/store.js';
import {Button,Icon,Radio,DatePicker,message,Popconfirm} from 'antd';
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

class MyDonation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId:'',
            genealogyList:'',
            total:0,
            page:1,
            pages:0,
            limit:12,
            showCard:false,
            gname:'',
        }
    }
    componentWillMount(){
        let self=this,userId=localStorage.getItem('userId');
        const {limit} = self.state;
        self.setState({userId:userId});
        let url=this.props.planlist.api+'genealogy/list?userId='+userId+'&serviceType=2&page=1&limit='+limit;
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
        const {page,total,pages,limit,userId} = this.state;
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

        let url=this.props.planlist.api+'genealogy/list?userId='+userId+'&serviceType=2&page='+pager+'&limit='+limit;
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
        let url=this.props.planlist.api+'genealogy/delete';
        let body={id:id,userId:userId}
        let getData=function(response){
            let data=response.data;
            message.success(data.msg);
        }
        postJSON(url,body,getData);
    }
    handleEdit(e,id){
        e.preventDefault();
        this.props.history.push('/addGenealogy:2-edit-'+id);
    }
    handleShowCard(e,item){
        e.preventDefault();
        this.setState({showCard:true,gname:item.gname});
    }
    render() {
        const {genealogyList,pages,total,page,showCard,gname}=this.state;
        return (
            <div className="userBox" onLoad={(e)=>{store.dispatch(setPathname('/myDonation'))}}>
                <Header />
                <div className='w_1170 userCenter'>
                    <UserLeft />
                    <div className='userInfo_content' style={{paddingBottom:'66px',position:'relative'}}>
                        <div className='user_title'>
                            <span>我的捐赠</span>
                            <Link to='/addGenealogy:2-add-' className='updateGenBtn'>捐赠家谱</Link>
                        </div>
                        <div className='userInfo_form' style={{paddingTop:'20px'}}>
                        {
                            genealogyList.length ? 
                            <div className='myDonation_title'>
                                {
                                    
                                    ['谱名','版本年代','撰修者','上传时间','状态','操作'].map((item,key)=>{
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
                                        <span><Icon type={item.status <= 3 ? (item.status == 1 ? 'frown-o' :'smile-o') : 'meh-o'} style={{color:'#ff9900',marginRight:'5px'}} />{item.status ? (item.status < 3 ? (item.status < 2 ? '审核失败' : '审核通过') : '已馆藏') : '待审核'}</span>
                                        <span>
                                            <Icon type='edit' onClick={(e)=>this.handleEdit(e,item._id)} style={{marginRight:'10px'}} />
                                            {
                                                item.status == 3 ? <img src='./images/donation_icon.png' onClick={(e)=>this.handleShowCard(e,item)} /> :
                                                <Popconfirm title="确定要删除这个家谱吗？" onConfirm={(e)=>this.handleDelete(e,item._id)} onCancel={(e)=>{e.preventDefault()}}><Icon type='delete' /></Popconfirm>
                                            }  
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
                {
                    showCard ? 
                    <div className='myDonation_digital_card'>
                        <div className='digital_card_img' style={{backgroundImage:'url(./images/donation_pic.jpg)'}}>
                            <p style={{marginTop:'250px'}}>承惠赠{gname}</p>
                            <p>所赠书籍，悉数收讫。深荷厚意，特发此证，以资谢旌。</p>
                            <p>此致</p>
                            <p style={{textAlign:'right'}}>2018-5-5</p>
                            <Icon type='close' className='digital_card_close' onClick={(e)=>{this.setState({showCard:false})}} />
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
export default connect(mapStateToProps)(MyDonation);