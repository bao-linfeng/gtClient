import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import store from '../redux/store.js';
import {Button,Icon,Checkbox} from 'antd';
import data from "../data/db.js";
import {getJSON} from './ADS.js';
import Header from './header.js';
import GenealogyMap from './genealogyMap.js';

import {getNewsList,setPathname } from '../actions/plan.js';
import './css/genealogyDatabase.css';

class GenealogyDatabase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            surname: '',
            gname: '',
            gplace: '',
            gtitle:'',
            gcreator:'',
            gversion:'',
            ghall:'',
            glibrary:'',
            gsummary:'',
            isView:false,
            isMore:true,
            tab:0,
            genealogyTitle:'',
            genealogyList:'',
            burster:[{title:'谱籍地',content:''},{title:'堂号',content:''},{title:'版本类型',content:''},{title:'馆藏地',content:''},{title:'是否开放电子全文',content:''}],
            total:0,
            pages:0,
            page:1,
        }
    }
    componentDidMount(){
        let self=this;
        let url='http://120.24.2.71:9090/catalog/list?surname=&genealogyName=&place=&title=&author=&version=&tanghao=&collection=&isAll=0&summary=&page=1&limit=1';
        let getGenealogyInit=function(response){
            let pages=0,data=response.data.data,burster=[{title:'谱籍地',content:data.place},{title:'堂号',content:data.tanghao},{title:'版本类型',content:data.version},{title:'馆藏地',content:data.collection},{title:'是否开放电子全文',content:data.isAll}];
            pages=Math.ceil(data.total/1);
            self.setState({genealogyTitle:data.fields,genealogyList:data.catas,burster:burster,total:data.total,pages:pages});
        }
        getJSON(url,getGenealogyInit);
        console.log(11);
    }
    
    getDataForSearch(e,type){
        let self=this;
        const {surname,gname,gplace,gtitle,gcreator,gversion,ghall,glibrary,gsummary,isView} = this.state;
        let url=('http://120.24.2.71:9090/catalog/list?surname='+surname+'&genealogyName='+gname+'&place='+gplace+'&title='+gtitle+'&author='+gcreator+'&version='+gversion+'&tanghao='+ghall+'&collection='+glibrary+'&isAll=0&summary='+gsummary+'&page=1&limit=200');
        let getGenealogyInit=function(response){
            let data=response.data.data,burster=[{title:'谱籍地',content:data.place},{title:'堂号',content:data.tanghao},{title:'版本类型',content:data.version},{title:'馆藏地',content:data.collection},{title:'是否开放电子全文',content:data.isAll}];
            self.setState({genealogyList:data.catas,burster:burster,total:data.total});
        }

        switch(type){
            case 1:
                getJSON(url,getGenealogyInit);
                break;
            case 2:
                if(e.keyCode == 13){
                    getJSON(url,getGenealogyInit);
                }
                break;
        }
    }
    handleGetDataForBurster(e,key,item){
        let self=this,gplace=this.state.gplace,ghall=this.state.ghall,gversion=this.state.gversion,glibrary=this.state.glibrary,isView=this.state.isView;
        const {surname,gname,gtitle,gcreator,gsummary} = this.state;
        
        switch(key){
            case 0:
                this.setState({gplace:item});
                gplace=item;
                break;
            case 1:
                this.setState({ghall:item});
                ghall=item;
                break;
            case 2:
                this.setState({gversion:item});
                gversion=item;
                break;
            case 3:
                this.setState({glibrary:item});
                glibrary=item;
                break;
            case 4:
                this.setState({isView:item});
                break;
                isView=item;
        }
        
        let url=('http://120.24.2.71:9090/catalog/list?surname='+surname+'&genealogyName='+gname+'&place='+gplace+'&title='+gtitle+'&author='+gcreator+'&version='+gversion+'&tanghao='+ghall+'&collection='+glibrary+'&isAll=0&summary='+gsummary+'&page=1&limit=200');
        let getGenealogyInit=function(response){
            let data=response.data.data,burster=[{title:'谱籍地',content:data.place},{title:'堂号',content:data.tanghao},{title:'版本类型',content:data.version},{title:'馆藏地',content:data.collection},{title:'是否开放电子全文',content:data.isAll}];
            self.setState({genealogyList:data.catas,burster:burster,total:data.total});
        }

        getJSON(url,getGenealogyInit);
    }
    handleGetDataForPage(e,type){
        const {page,total,pages,surname,gname,gplace,gtitle,gcreator,gversion,ghall,glibrary,gsummary,isView} = this.state;
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

        let url=('http://120.24.2.71:9090/catalog/list?surname='+surname+'&genealogyName='+gname+'&place='+gplace+'&title='+gtitle+'&author='+gcreator+'&version='+gversion+'&tanghao='+ghall+'&collection='+glibrary+'&isAll=0&summary='+gsummary+'&page='+pager+'&limit=1');
        let getGenealogyInit=function(response){
            let data=response.data.data;
            self.setState({genealogyList:data.catas});
        }
        getJSON(url,getGenealogyInit);
    }
    render() {
        const {page,pages,bursterIndex,surname,gname,gplace,gtitle,gcreator,gversion,ghall,glibrary,gsummary,isView,isMore,tab,genealogyTitle,genealogyList,burster,total}=this.state;
        return (
            <div className="genealogyDatabase" onLoad={(e)=>{store.dispatch(setPathname('/genealogyDatabase'))}}>
                <Header />
                <div className="genealogyDatabase_search" style={{backgroundImage:'url(./images/genealogyCulture_banner.jpg)'}}>
                    <div className="genealogyDatabase_search_title">
                         {
                             data.genealogyDatabase.map((item,key)=>{
                                 return (
                                     <Link to={item.url} key={key} className={key==0 ? 'active' :''}><img src={'./images/genealogyCulture_'+key+'.png'} />{item.title}</Link>
                                 )
                             })
                         }
                    </div>
                    <div className="genealogyDatabase_search_btn w_1170" onKeyUp={(e)=>this.getDataForSearch(e,2)}>
                        <div className="input_group">
                            <input type="text" value={surname} onChange={(e)=>{this.setState({surname:e.target.value})}} placeholder="请选择姓氏"  />
                            <Icon type="caret-down" style={{position:'absolute',top:'10px',right:'10px'}} />
                        </div>
                        <div className="input_group">
                            <input type="text" value={gname} onChange={(e)=>{this.setState({gname:e.target.value})}} placeholder="请输入谱名"  />
                        </div>
                        <div className="input_group">
                            <input type="text" value={gplace} onChange={(e)=>{this.setState({gplace:e.target.value})}} placeholder="请选择谱籍地"  />
                            <Icon type="caret-down" style={{position:'absolute',top:'10px',right:'10px'}} />
                        </div>
                        <div className="input_group margin_right_0">
                            <a href="javascript:;" onClick={(e)=>this.getDataForSearch(e,1)}>搜索</a>
                            <span onClick={(e)=>{this.setState({isMore:!isMore})}}>高级检索<Icon type={isMore ? "caret-down" : "caret-up"} /></span>
                        </div>
                        <div className={"input_group "+(isMore ? "hide" : '')}>
                            <input type="text" value={gtitle} onChange={(e)=>{this.setState({gtitle:e.target.value})}} placeholder="题名信息"  />
                        </div>
                        <div className={"input_group "+(isMore ? "hide" : '')}>
                            <input type="text" value={gcreator} onChange={(e)=>{this.setState({gcreator:e.target.value})}} placeholder="责任者"  />
                        </div>
                        <div className={"input_group "+(isMore ? "hide" : '')}>
                            <input type="text" value={gversion} onChange={(e)=>{this.setState({gversion:e.target.value})}} placeholder="版本类型"  />
                        </div>
                        <div className={"input_group "+(isMore ? "hide" : '')}>
                            <input type="text" value={ghall} onChange={(e)=>{this.setState({ghall:e.target.value})}} placeholder="堂号"  />
                        </div>
                        <div className={"input_group "+(isMore ? "hide" : '')}>
                            <input type="text" value={glibrary} onChange={(e)=>{this.setState({glibrary:e.target.value})}} placeholder="馆藏信息"  />
                        </div>
                        <div className={"input_group "+(isMore ? "hide" : '')}>
                            <input type="text" value={gsummary} onChange={(e)=>{this.setState({gsummary:e.target.value})}} placeholder="摘要"  />
                        </div>
                        <div className={"input_group  margin_right_0 "+(isMore ? "hide" : '')}>
                            <Checkbox onChange={(e)=>{this.setState({isView:e.target.checked})}}>国图全文访问</Checkbox>
                        </div>
                    </div>
                </div>
                <div className="genealogyDatabase_data_tab w_1170">
                    <p>找到{total}个结果</p>
                    {
                        [{tab:'列表',icon:'bars'},{tab:'图库',icon:'appstore'},{tab:'地图',icon:'environment'}].map((item,key)=>{
                            return (
                                <span key={key} style={{color:(tab == key ? '#C69C6D' : '#333')}} onClick={(e)=>{this.setState({tab:key})}}><Icon type={item.icon} />{item.tab}</span>
                            )
                        })
                    }
                </div>
                {
                    tab < 2 ?
                    <div className="genealogyDatabase_data_show w_1170">
                        <div className="genealogyDatabase_burster">
                            <p>显示搜索结果:</p>
                            {
                                burster.length ?
                                burster.map((item,key)=>{
                                    return (
                                        <div key={key} className="genealogyDatabase_burster_list">
                                            <p>{item.title}<span onClick={(e)=>{this.setState({['bursterIndex'+key]:!this.state['bursterIndex'+key]})}}>更多»</span></p>
                                            <ul className='style1' style={{overflowY:(this.state['bursterIndex'+key] ? 'scroll' : 'hidden')}}>
                                            {
                                                item.content ?
                                                (item.content).map((item2,key2)=>{
                                                    return (
                                                        item2.num ? 
                                                        <li key={key2} onClick={(e)=>this.handleGetDataForBurster(e,key,item2.hallName)}>{item2.hallName}({item2.num})</li> : null
                                                    )
                                                }) : null
                                            }
                                            </ul>
                                        </div>
                                    )
                                }) : null
                            }
                        </div>
                        {
                            tab == 0 ?
                            <div className="genealogyDatabase_data_list style1">
                                <table className="genealogyDatabase_table">
                                    <thead>
                                        <tr>
                                            {
                                                genealogyTitle.length ?
                                                genealogyTitle.map((item,key)=>{
                                                    return (
                                                        <th key={key}>{item.title}</th>
                                                    )
                                                }) : null
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            genealogyList.length ?
                                            genealogyList.map((item,key)=>{
                                                return (
                                                    <tr key={key}>
                                                        {
                                                            item.map((item2,key2)=>{
                                                                return (
                                                                    key2 < 19 ?
                                                                    <td key={key2}>{item2 ? item2 : '--'}</td> : null
                                                                )
                                                            })
                                                        }
                                                    </tr>
                                                )
                                            }) : null
                                        }
                                    </tbody>
                                </table>
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
                                </div>
                            </div> :
                            <div className="genealogyDatabase_data_store">
                                {
                                    genealogyList.length ?
                                    genealogyList.map((item,key)=>{
                                        return (
                                            <Link to="" key={key} className="genealogyDatabase_store_list">
                                                <img src="./images/cover.jpg" alt="封面" />
                                                <i>{item[2] ? item[2] : '不详'}</i>
                                                <h3>{item[2] ? item[2] : '不详'}</h3>
                                                <p>{item[3] ? item[3] : '不详'}</p>
                                                <p>版本:{item[4] ? item[4] : '不详'}</p>
                                                <p>谱籍地:{item[1] ? item[1] : '不详'}</p>
                                                <p>堂号:{item[5] ? item[5] : '不详'}</p>
                                            </Link>
                                        )
                                    }) : null
                                }
                            </div>
                        }
                        
                    </div> : <GenealogyMap data={{surname: surname,gname: gname,gplace: gplace,gtitle:gtitle,gcreator:gcreator,gversion:gversion,ghall:ghall,glibrary:glibrary,gsummary:gsummary,isView:isView}} />
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
export default connect(mapStateToProps)(GenealogyDatabase);