import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import store from '../redux/store.js';
import {Button,Icon,Checkbox,Tag} from 'antd';
import data from "../data/db.js";
import {getJSON,getLocalTime,switchType} from './ADS.js';
import Header from './header.js';
import Footer from './footer.js';
import NoData from './noData.js';

import {getNewsList,setPathname } from '../actions/plan.js';
import './css/expertConsultation.css';

function switchTabIndex(tabIndex){
    switch(tabIndex){
        case 0:
            return '全部';
            break;
        case 1:
            return '家谱';
            break;
        case 2:
            return '寻根';
            break;
        case 3:
            return '委托查询';
            break;
        case 4:
            return '文献复制';
            break;
        case 5:
            return '阅读服务';
            break;
        default:
            return '全部';
            break;
    }
}

class ExpertConsultation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword:'',
            tabIndex:0,
            sort:'发布时间',
            sortState:false,
            expertConsultationList:'',
            total:0,
            pages:1,
            page:1,
            hotConsultation:'',
            commonConsultation:'',
        }
    }
    componentDidMount(){
        let self=this,sortType='';
        const {keyword,tabIndex,sort} = self.state;

        switch(sort){
            case '发布时间':
                sortType='createTime';
                break;
            case '浏览数量':
                sortType='seeCount';
                break;
        }
        let uri=self.props.planlist.api+('consultation/list?keyword='+encodeURI(keyword)+'&type='+encodeURI(switchTabIndex(tabIndex))+'&sort='+encodeURI(sortType)+'&page=1&limit=10');
        let getConsultation=function(response){
            console.log(response);
            self.setState({expertConsultationList:response.data.result,total:response.data.total,pages:Math.ceil(response.data.total/10)});
        }
        getJSON(uri,getConsultation);

        //最热问题
        let url=self.props.planlist.api+('consultation/list?keyword=&type='+encodeURI(switchTabIndex(tabIndex))+'&sort=seeCount&page=1&limit=5');
        let getHotConsultation=function(response){
            console.log(response);
            self.setState({hotConsultation:response.data.result});
        }
        getJSON(url,getHotConsultation);
        //常见问题
        let url2=self.props.planlist.api+('collection/list?serviceType=1&userId=all&page=1&limit=5');
        let getCommonConsultation=function(response){
            console.log(response);
            self.setState({commonConsultation:response.data.result});
        }
        getJSON(url2,getCommonConsultation);
    }
    handleClickTab(e,item,key){
        let self=this,sortType='';
        const {keyword,sort} = self.state;

        switch(sort){
            case '发布时间':
                sortType='createTime';
                break;
            case '浏览数量':
                sortType='seeCount';
                break;
        }
        let uri=self.props.planlist.api+('consultation/list?keyword='+encodeURI(keyword)+'&type='+encodeURI(switchTabIndex(key))+'&sort='+encodeURI(sortType)+'&page=1&limit=10');
        let getConsultation=function(response){
            console.log(response);
            self.setState({tabIndex:key,expertConsultationList:response.data.result,total:response.data.total,pages:Math.ceil(response.data.total/10),page:1});
        }
        getJSON(uri,getConsultation);
    }
    handleSearchForConsultation(e,type){
        let self=this,sortType='';
        const {keyword,tabIndex,sort} = self.state;

        switch(sort){
            case '发布时间':
                sortType='createTime';
                break;
            case '浏览数量':
                sortType='seeCount';
                break;
        }
        let uri=self.props.planlist.api+('consultation/list?keyword='+encodeURI(keyword)+'&type='+encodeURI(switchTabIndex(tabIndex))+'&sort='+encodeURI(sortType)+'&page=1&limit=10');
        let getConsultation=function(response){
            console.log(response);
            self.setState({expertConsultationList:response.data.result,total:response.data.total,pages:Math.ceil(response.data.total/10),page:1});
        }
        switch(type){
            case 1:
                getJSON(uri,getConsultation);
                break;
            case 2:
                if(e.keyCode == 13){
                    getJSON(uri,getConsultation);
                }
                break;
            default:
                getJSON(uri,getConsultation);
                break;
        }
        
    }
    handleGetDataForPage(e,type){
        const {page,total,pages,keyword,tabIndex,sort} = this.state;
        let pager=0,self=this,sortType='';
        switch(sort){
            case '发布时间':
                sortType='createTime';
                break;
            case '浏览数量':
                sortType='seeCount';
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
    
        let uri=self.props.planlist.api+('consultation/list?keyword='+encodeURI(keyword)+'&type='+encodeURI(switchTabIndex(tabIndex))+'&sort='+encodeURI(sortType)+'&page='+pager+'&limit=10');
        let getConsultation=function(response){
            console.log(response);
            self.setState({expertConsultationList:response.data.result,page:pager});
        }
        getJSON(uri,getConsultation);
    }
    handleClickSort(e,item){
        let self=this,sortType='';
        const {keyword,tabIndex} = self.state;

        switch(item){
            case '发布时间':
                sortType='createTime';
                break;
            case '浏览数量':
                sortType='seeCount';
                break;
        }
        let uri=self.props.planlist.api+('consultation/list?keyword='+encodeURI(keyword)+'&type='+encodeURI(switchTabIndex(tabIndex))+'&sort='+encodeURI(sortType)+'&page=1&limit=10');
        let getConsultation=function(response){
            console.log(response);
            self.setState({expertConsultationList:response.data.result,total:response.data.total,pages:Math.ceil(response.data.total/10),page:1,sort:item});
        }
        getJSON(uri,getConsultation);
    }
    render() {
        const {keyword,tabIndex,sort,sortState,expertConsultationList,total,pages,page,hotConsultation,commonConsultation}=this.state;
        return (
            <div className="expertConsultation" onLoad={(e)=>{store.dispatch(setPathname('/expertConsultation'))}}>
                <Header />
                <div className="expertConsultation_search" style={{backgroundImage:'url(./images/ex_banner.jpg)'}}>
                    <div className='w_1170'>
                        <div className='expertConsultation_search_group'>
                            <input type='text' value={keyword} onChange={(e)=>{this.setState({keyword:e.target.value})}} onKeyUp={(e)=>this.handleSearchForConsultation(e,2)} placeholder='请输入您的问题' />
                            <Button type="primary" icon="search" onClick={(e)=>this.handleSearchForConsultation(e,1)} style={{width:'150px',height:'50px',fontSize:'20px',borderRadius:0,float:'left',background:'#f00',border:'none'}}>搜索</Button>
                        </div>
                        <p>例如：堂号 我的空间 堂号 我的空间</p>
                    </div>
                </div>
                <div className='w_1170 expertConsultation_content'>
                    <div className='expertConsultation_left'>
                        <div className='expertConsultation_left_tab'>
                            {
                                data.expertConsultationTab.map((item,key)=>{
                                    return (
                                        <span key={key} onClick={(e)=>this.handleClickTab(e,item,key)} className={key == tabIndex ? 'active' :''}>{item.name}</span>
                                    )
                                })
                            }
                            <div className='expertConsultation_sort' onClick={(e)=>{this.setState({sortState:!sortState})}}>
                                排序：{sort}
                                <Icon type={sortState ? 'caret-up' : 'caret-down'} />
                                {
                                    sortState ? 
                                    <div className='expertConsultation_sort_type'>
                                        {
                                            ['发布时间','浏览数量'].map((item,key)=>{
                                                return(
                                                    <span key={key} onClick={(e)=>this.handleClickSort(e,item)}>{item}</span>
                                                )
                                            })
                                        }
                                    </div> : null
                                }
                            </div>
                        </div>
                        {
                            data.expertConsultationTab.map((item,key)=>{
                                return (
                                    <div key={key} className={(key == tabIndex ? 'show' : '')+' expertConsultation_list'}>
                                        {
                                            expertConsultationList.length ?
                                            expertConsultationList.map((item2,key2)=>{
                                                return (
                                                    <Link to={'/expertConsultationDetail:'+item2._id} key={key2} className='expertConsultation_list_a'>
                                                        <h3>{item2.title}</h3>
                                                        <Tag color={switchType(item2.type)}>{item2.type}</Tag>
                                                        <span><Icon type='calendar' />{item2.createTime ? getLocalTime(item2.createTime,'-',1) : ''}</span>
                                                        <p>{item2.content}</p>
                                                    </Link>
                                                )
                                            }) : <NoData />
                                        }
                                    </div>
                                )
                            })
                        }
                        {
                            pages > 1 ?
                            <div className="pagebox">
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
                    <div className='expertConsultation_right'>
                        <Link to='/addConsultation' className='expertConsultation_right_btn myQuestion'>我要提问</Link>
                        <Link to='' className='expertConsultation_right_btn'>帮助</Link>
                        <div className='expertConsultation_question'>
                            <div className='expertConsultation_question_title'>
                                <h3>常见问题</h3>
                            </div>
                            {
                                commonConsultation.length ?
                                commonConsultation.map((item,key)=>{
                                    return (
                                        <Link to={'/expertConsultationDetail:'+item._id} key={key} >{item.title}</Link>
                                    )
                                }) : null
                            }
                            <div className='expertConsultation_question_title marginTop20'>
                                <h3>最热问题</h3>
                                <Link to=''>查看更多</Link>
                            </div>
                            {
                                hotConsultation.length ?
                                hotConsultation.map((item,key)=>{
                                    return (
                                        <Link to={'/expertConsultationDetail:'+item._id} key={key} >{item.title}</Link>
                                    )
                                }) : null
                            }
                        </div>
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
export default connect(mapStateToProps)(ExpertConsultation);