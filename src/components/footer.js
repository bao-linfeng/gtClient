import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import store from '../redux/store.js';

class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }
    componentDidMount(){
        
    }
    
    render() {
        return (
            <div className="footer">
                <ul className='footer_content w_1170'>
                    <li>
                        <Link to=''>联系我们</Link>
                        <i>|</i>
                        <Link to=''>关于我们</Link>
                        <i>|</i>
                        <Link to=''>版权申明</Link>
                        <i>|</i>
                        <Link to=''>帮助</Link>
                    </li>
                    <li>
                        <span>京ICP备05014420号</span>
                        <span>© Copyright中华寻根网All Rights Reserved</span>
                        <span>北京市海淀区中关村南大街33号</span>
                    </li>
                </ul>
            </div>
        )
    }
}

const mapStateToProps = function (store) {
    return {
        planlist: store.planlist
    };
};
export default connect(mapStateToProps)(Footer);