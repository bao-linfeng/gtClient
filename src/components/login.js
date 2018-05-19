import React, {
    Component
} from 'react';
import {
    connect
} from 'react-redux';
import {
    Link
} from 'react-router-dom';
import store from '../redux/store.js';
import {
    Button,
    Input,
    Icon
} from 'antd';
import './css/header.css';
import {
    postJSON
} from './ADS.js';
import {
    setToken
} from '../actions/plan.js';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        }
    }
    componentDidMount() {

    }
    handleSendRegister(e, type) {
        let self = this;
        const {
            username,
            password
        } = this.state;
        let url = this.props.planlist.api + ('login');
        let body = {
            username: username,
            password: password
        }
        let getData = function(response) {
            let data = response.data;
            if (data.msg == 'ok') {
                console.log(data.user);
                localStorage.setItem('token', data.user.token);
                localStorage.setItem('username', data.user.username);
                localStorage.setItem('userId', data.user._id);
                localStorage.setItem('avatar', data.user.avatar);
                localStorage.setItem('roleId', data.user.roleId);
                store.dispatch(setToken(data.user.token));
                self.props.history.push('/');
            } else {
                alert(data.msg);
            }
        }
        if (username && password) {
            switch (type) {
                case 1:
                    postJSON(url, body, getData);
                    break;
                case 2:
                    if (e.keyCode == 13) {
                        postJSON(url, body, getData);
                    }
                    break;
            }
        }
    }
    render() {
        const {
            username,
            password
        } = this.state;
        return (
            <div className="login" style={{backgroundImage:'url(./images/login_bg.jpg)'}}>
                <ul className='login_bg' style={{backgroundImage:'url(./images/login_box.png)'}}>
                    <li className='login_title'>
                        <Link to='/'><img src='./images/header_logo.png' /></Link>
                        <p>账号登录</p>
                    </li>
                    <li>
                        <Input size="large" prefix={<Icon type="user" />} value={username} onKeyUp={(e)=>this.handleSendRegister(e,2)} onChange={(e)=>{this.setState({username:e.target.value})}} placeholder='用户名、手机、邮箱' />
                    </li>
                    <li>
                        <Input type='password' size="large" prefix={<Icon type="lock" />} value={password} onKeyUp={(e)=>this.handleSendRegister(e,2)} onChange={(e)=>{this.setState({password:e.target.value})}} placeholder='密码' />
                    </li>
                    <li className='login_forget'>
                        <span>还没有账号？<Link to='/register' style={{color:'#333'}}>立即注册</Link></span>
                        <Link to='' style={{color:'#f00',float:'right'}}>忘记密码</Link>
                    </li>
                    <li style={{marginBottom:'30px'}}>
                        <Button size='large' onClick={(e)=>this.handleSendRegister(e,1)} style={{width:'100%',background:'#D6AE60',color:'#fff'}}>登录</Button>
                    </li>
                    <li className='login_other'>
                        <span>其他登陆</span>
                        <Link to=''><Icon style={{color:'blue',display:'block',fontSize:'20px'}} type='qq' />QQ登录</Link>
                        <Link to=''><Icon style={{color:'green',display:'block',fontSize:'20px'}} type='wechat' />微信登录</Link>
                        <Link to=''><Icon style={{color:'red',display:'block',fontSize:'20px'}} type='weibo-circle' />微博登录</Link>
                    </li>
                </ul>
            </div>
        )
    }
}

const mapStateToProps = function(store) {
    return {
        planlist: store.planlist
    };
};
export default connect(mapStateToProps)(Login);