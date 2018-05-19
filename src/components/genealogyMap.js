import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../redux/store.js';
import {getJSON,updateMap} from './ADS.js';

import './css/genealogyDatabase.css';

class GenealogyMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            map:'',
            infoWindow:'',
            page:1,
            genealogyList:'',
            pages:1,
            AMap:'global.AMap',
        }
    }
    componentDidMount(){
        let self=this,AMap=global.AMap;
        let map = new AMap.Map('genealogyDatabase_map',{
	        resizeEnable: true,
	        zoom: 4,
	        center: [116.480983, 40.0958]
	    }),marker,cluster, markers = [];
        let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0,-30)});
        self.setState({map:map,infoWindow:infoWindow,AMap:AMap});

        let uri=('http://120.24.2.71:9090/catalog/map?surname='+this.props.data.surname+'&genealogyName='+this.props.data.gname+'&place='+this.props.data.gplace+'&title='+this.props.data.gtitle+'&author='+this.props.data.gcreator+'&version='+this.props.data.gversion+'&tanghao='+this.props.data.ghall+'&collection='+this.props.data.glibrary+'&isAll=0&summary='+this.props.data.gsummary+'&page=1&limit=200');
        let getGenealogyInitMap=function(response){
            self.setState({genealogyList:response.data.data,pages:response.data.pages});
            updateMap(response.data.data,map,infoWindow,AMap);
        }
        getJSON(uri,getGenealogyInitMap);
    }
    handleGetMoreGenealogy(e){
        let self=this;
        const {map,infoWindow,AMap} = this.state;
        let uri=('http://120.24.2.71:9090/catalog/map?surname='+this.props.data.surname+'&genealogyName='+this.props.data.gname+'&place='+this.props.data.gplace+'&title='+this.props.data.gtitle+'&author='+this.props.data.gcreator+'&version='+this.props.data.gversion+'&tanghao='+this.props.data.ghall+'&collection='+this.props.data.glibrary+'&isAll=0&summary='+this.props.data.gsummary+'&page='+(this.state.page+1)+'&limit=200');
        let getGenealogyInitMap=function(response){
            let genealogyList=(self.state.genealogyList).concat(response.data.data);
            self.setState({page:self.state.page+1,genealogyList:genealogyList});
            updateMap(genealogyList,map,infoWindow,AMap);
        }
        getJSON(uri,getGenealogyInitMap);
    }
    render() {
        const {page,pages} = this.state;
        return (
            <div className="genealogyDatabase_data_map w_1170" id="genealogyDatabase_map">
                {
                    page < pages ? <span className="genealogyDatabase_data_more" onClick={(e)=>this.handleGetMoreGenealogy(e)}>更多家谱</span> : null
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
export default connect(mapStateToProps)(GenealogyMap);