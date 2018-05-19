import React, { Component } from 'react';

class NoData extends Component {
    constructor(props) {
        super(props);
    }
    render () {
        return (
            <div style={{position:'absolute',top:'50%',left:'50%',width:'200px',height:'180px',margin:'-90px 0 0 -100px',fontSize:'16px',textAlign:'center'}}>
                <img src='./images/NoData.png' />
                <p>暂无数据</p>
            </div>
        )
    }
}

export default NoData;