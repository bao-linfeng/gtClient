import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import store from '../redux/store.js';
import {Button,Icon,Checkbox,Tag} from 'antd';
import data from "../data/db.js";
import {getJSON,getLocalTime,switchType,postJSON} from './ADS.js';
import Header from './header.js';
import Footer from './footer.js';
import NoData from './noData.js';

import {getNewsList,setPathname } from '../actions/plan.js';
import './css/expertConsultation.css';

class ExpertConsultationDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            consultationDetail:'',
            id:'',
            islike:false,
            iscollect:false,
            likeCount:0,
            collectCount:0,
            userId:'',
        }
    }
    componentDidMount(){
        let self=this,id=this.props.match.params.id.substring(1),userId;
        userId=localStorage.getItem('userId');
        self.setState({id:id,userId:userId});
        let url=this.props.planlist.api+'consultation/detail?id='+id+'&userId='+userId;
        let getCelebrityInit=function(response){
            console.log(response.data);
            let data=response.data;
            self.setState({consultationDetail:data,islike:data.islike,iscollect:data.isCollect,likeCount:(data.result.likeCount || 0),collectCount:(data.result.collectCount || 0)});
        }
        getJSON(url,getCelebrityInit);
        
    }
    handleClickHabit(e,serviceType,operateType,collection){
        let url=(this.props.planlist.api+'habit/toggle'),self=this,likeFlag=false;
        let body={id:self.state.id,userId:self.state.userId,serviceType:serviceType,operateType:operateType,collection:collection}
        let getData=function(response){
            console.log(response);
            if(response.data.msg){
                alert(response.data.msg);
            }else{
                likeFlag=true;
                self.setState({['is'+operateType]:response.data['is'+operateType],[operateType+'Count']:response.data[operateType+'Count']});
            }
        }
        postJSON(url,body,getData);
        if(self.state.userId){
            if(likeFlag){
                postJSON(url,body,getData);
            }
        }else{
            alert('请先登录');
        }
    }
    render() {
        const {consultationDetail,islike,iscollect,likeCount,collectCount}=this.state;
    
        return (
            <div className="consultationDetail" onLoad={(e)=>{store.dispatch(setPathname('/expertConsultation'))}}>
                <Header />
                {
                    consultationDetail ? 
                    <div className="consultationDetail_content">
                        <div className='w_1170 breadcrumbNavigation'>
                            <Link to='/'>首页</Link>»
                            <Link to='/expertConsultation'>专家咨询</Link>»
                            <span>{consultationDetail.result.title}</span>
                        </div>
                        <div className='w_1170'>
                            <h2>{consultationDetail.result.title}</h2>
                            <Tag color={switchType(consultationDetail.result.type)}>{consultationDetail.result.type}</Tag>
                            <Icon type='calendar' />
                            <span>{consultationDetail.result.createTime ? getLocalTime(consultationDetail.result.createTime,'-',1) : ''}</span>
                            <p style={{marginTop:'10px'}}>{consultationDetail.result.content}</p>
                            {
                                consultationDetail && consultationDetail.result.cover ? 
                                <img src={this.props.planlist.api+consultationDetail.result.cover} /> : null
                            }
                        </div>
                    </div> : null
                }
                <div className="expert_answer w_1170">
                    <div className='expert_answer_title'>
                        <span>专家回答</span>
                    </div>
                    <div className='expert_answer_content'>
                        <div className='expert_answer_user'>
                            <img src='./images/ex_logo.jpg' />
                            <span style={{display:'block',marginTop:'5px'}}>admin</span>
                            <Icon type='calendar' />
                            <span>2017-2-3</span>
                        </div>
                        <p>读者您好，目前数据库中暂未有您所需要的相关家谱数据，非常抱歉。</p>
                    </div>
                    {
                        consultationDetail ?
                        <div className='action_view'>
                            <Icon type='eye-o' style={{margin:'0 5px 0 20px',color:'blue'}} />{consultationDetail.result.seeCount}查看
                            <Icon type={islike ? 'like' : 'like-o'} onClick={(e)=>this.handleClickHabit(e,1,'like','consultation')} style={{margin:'0 5px 0 20px',color:'orange'}} />{likeCount}赞
                            <Icon type={iscollect ? 'heart' : 'heart-o'} onClick={(e)=>this.handleClickHabit(e,1,'collect','consultation')} style={{margin:'0 5px 0 20px',color:'#f00'}} />{collectCount}收藏
                        </div> : null
                    }
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
export default connect(mapStateToProps)(ExpertConsultationDetail);