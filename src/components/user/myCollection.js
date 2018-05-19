import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import store from '../../redux/store.js';
import {Button,Icon,message,Badge,Tag,Popconfirm} from 'antd';
import {getJSON,postJSON,getLocalTime,substrAndReplaceToEllipsis} from '../ADS.js';
import Header from '../header.js';
import Footer from '../footer.js';
import UserLeft from './userLeft.js';
import NoData from '../noData.js';

import {getNewsList,setPathname } from '../../actions/plan.js';
import '../css/user.css';

class MyCollection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId:'',
            genealogyList:'',
            total:0,
            page:1,
            pages:0,
            limit:10,
            username:'',
            serviceType:1,
            index:0,
        }
    }
    componentWillMount(){
        
    }
    componentDidMount(){
        let self=this,userId=localStorage.getItem('userId');
        const {limit} = self.state;
        self.setState({userId:userId});
        let url=this.props.planlist.api+'myCollection/list?userId='+userId+'&serviceType=1&table=consultation&page=1&limit='+limit;
        let getGenealogy=function(response){
            console.log(response.data);
            let data=response.data;
            self.setState({genealogyList:data.result,total:data.total,pages:Math.ceil(data.total/limit)});
        }
        getJSON(url,getGenealogy);
    }
    handleGetDataForPage(e,type){
        const {page,total,pages,limit,userId,serviceType,index} = this.state;
        let pager=0,self=this,table;

        switch(index){
            case 0:
                table='consultation';
                break;
            case 1:
                table='log';
                break;
            case 2:
                table='genealogy';
                break;
            case 3:
                table='genealogy';
                break;
            case 4:
                table='genealogy';
                break; 
            default:
                table='consultation';
                break;
        }

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

        let url=this.props.planlist.api+'myCollection/list?userId='+userId+'&serviceType='+serviceType+'&table='+table+'&page='+pager+'&limit='+limit;
        let getGenealogyInit=function(response){
            let data=response.data;
            self.setState({genealogyList:data.result,total:data.total,pages:Math.ceil(data.total/limit)});
        }
        getJSON(url,getGenealogyInit);
    }

    handleGetRelativeFriend(e,key){
        let self=this,serviceType,table;
        const {limit,userId} = self.state;

        switch(key){
            case 0:
                serviceType=1;
                table='consultation';
                break;
            case 1:
                serviceType=5;
                table='log';
                break;
            case 2:
                serviceType=4;
                table='genealogy';
                break;
            case 3:
                serviceType=6;
                table='genealogy';
                break;
            case 4:
                serviceType=7;
                table='genealogy';
                break; 
            default:
                serviceType=1;
                table='consultation';
                break;
        }

        self.setState({index:key});
        let url=this.props.planlist.api+'myCollection/list?userId='+userId+'&serviceType='+serviceType+'&table='+table+'&page=1&limit='+limit;
        let getGenealogy=function(response){
            console.log(response.data);
            let data=response.data;
            self.setState({genealogyList:data.result,total:data.total,pages:Math.ceil(data.total/limit)});
        }
        getJSON(url,getGenealogy);
    }
    render() {
        const {genealogyList,pages,total,page,username,index}=this.state;
        return (
            <div className="userBox" onLoad={(e)=>{store.dispatch(setPathname('/myCollection'))}}>
                <Header />
                <div className='w_1170 userCenter'>
                    <UserLeft />
                    <div className='userInfo_content' style={{paddingBottom:'66px',position:'relative'}}>
                        <div className='user_title'>
                        {
                            ['专家咨询','用户日志','家族族谱','谱牒文化','地方方志'].map((item,key)=>{
                                return (
                                    <i key={key} className={key == index ? 'active' : ''} onClick={(e)=>this.handleGetRelativeFriend(e,key)}>{item}</i>
                                )
                            })
                        }
                        </div>
                        <div className='userInfo_form' style={{paddingTop:'20px'}}>
                        {
                            genealogyList.length && index == 2 ? 
                            <div className='myDonation_title'>
                            {
                                ['谱名','版本年代','撰修者','谱籍地','姓氏','堂号'].map((item,key)=>{
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
                                    index <= 1 ?
                                    <Link to={(index ? '/logDetail:' : '/expertConsultationDetail:')+item._id} key={key} className='my_expertConsultation_list'>
                                        <h3>{item.title}</h3>
                                        <Icon type='calendar' />{getLocalTime(item.createTime,'-',1)}
                                        <p>{item.content ? substrAndReplaceToEllipsis(item.content,50) : '--'}</p>
                                    </Link> : 
                                    (index == 2 ?
                                    <Link to={'/myGenealogyDetail:'+item._id} key={key} className='my_donation_list'>
                                        <span>{item.gname}</span>
                                        <span>{item.version}</span>
                                        <span>{item.creator}</span>
                                        <span>{item.gplace}</span>
                                        <span>{item.surname}</span>
                                        <span>{item.gtan}</span>
                                    </Link> : null)
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
export default connect(mapStateToProps)(MyCollection);