import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import store from '../redux/store.js';
import {Radio,Select,DatePicker,Button} from 'antd';
import './css/header.css';
import {postJSON} from './ADS.js';


const RadioGroup = Radio.Group;
const Option = Select.Option;
class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username:'',
            password:'',
            Ispassword:'',
            sex:'男',
            county:'中国',
            birthday:'',
            place:'',
            education:'',
            professional:'',
            tel:'',
            email:'',
        }
    }
    componentDidMount(){
        
    }
    handleSendRegister(e){
        let self=this;
        const {username,password,Ispassword,sex,birthday,county,place,education,professional,tel,email} = this.state;
        let url=this.props.planlist.api+('register');
        let body={username:username,password:password,sex:sex,birthday:birthday,county:county,place:place,education:education,professional:professional,tel:tel,email:email}
        let getData=function(response){
            let data=response.data;
            if(data.msg == 'ok'){
                alert('注册成功');
                self.props.history.push('/');
            }else{
                alert(data.msg);
            }
        }
        if(username && password && password == Ispassword){
            postJSON(url,body,getData);
        }
    }
    render() {
        const {username,password,Ispassword,sex,birthday,county,place,education,professional,tel,email} = this.state;
        return (
            <div className="register">
                <ul className='register_bg'>
                    <li>
                        <h3><Link to='/'>中华寻根网</Link>-注册</h3>
                    </li>
                    <li>
                        <label><i>*</i>用户账号:</label>
                        <input type='text' className={username ? '' : 'active'} value={username} onChange={(e)=>{this.setState({username:e.target.value})}} />
                    </li>
                    <li>
                        <label><i>*</i>登陆密码:</label>
                        <input type='password' className={password ? '' : 'active'} value={password} onChange={(e)=>{this.setState({password:e.target.value})}} />
                    </li>
                    <li>
                        <label><i>*</i>确认密码:</label>
                        <input type='password' className={Ispassword ? '' : 'active'} value={Ispassword} onChange={(e)=>{this.setState({Ispassword:e.target.value})}} />
                    </li>
                    <li>
                        <label>性别:</label>
                        <RadioGroup onChange={(e)=>{this.setState({sex:e.target.value})}} value={sex}>
                            <Radio value='男'>男</Radio>
                            <Radio value='女'>女</Radio>
                        </RadioGroup>
                    </li>
                    <li>
                        <label>出生日期:</label>
                        <DatePicker onChange={(date)=>{this.setState({birthday:date})}} />
                    </li>
                    <li>
                        <label>国家:</label>
                        <Select defaultValue={county} style={{ width: 120 }} onChange={(value)=>{this.setState({county:value})}}>
                            {
                                ['中国','美国','俄罗斯','英国','德国','法国','日本'].map((item,key)=>{
                                    return (
                                        <Option value={item} key={key}>{item}</Option>
                                    )
                                })
                            }
                        </Select>
                    </li>
                    <li>
                        <label>地区:</label>
                        <input type='text' value={place} onChange={(e)=>{this.setState({place:e.target.value})}} />
                    </li>
                    <li>
                        <label>学历:</label>
                        <Select defaultValue={education} style={{ width: 120 }} onChange={(value)=>{this.setState({education:value})}}>
                            {
                                ['博士','硕士','专科/本科','中专/高中','初中','小学'].map((item,key)=>{
                                    return (
                                        <Option value={item} key={key}>{item}</Option>
                                    )
                                })
                            }
                        </Select>
                    </li>
                    <li>
                        <label>职称:</label>
                        <Select defaultValue={professional} style={{ width: 120 }} onChange={(value)=>{this.setState({professional:value})}}>
                            {
                                ['正高','副高','中级','初级','无职称'].map((item,key)=>{
                                    return (
                                        <Option value={item} key={key}>{item}</Option>
                                    )
                                })
                            }
                        </Select>
                    </li>
                    <li>
                        <label>手机号码:</label>
                        <input type='text' value={tel} onChange={(e)=>{this.setState({tel:e.target.value})}} />
                    </li>
                    <li>
                        <label>Email:</label>
                        <input type='text' value={email} onChange={(e)=>{this.setState({email:e.target.value})}} />
                    </li>
                    <li>
                        <Button onClick={(e)=>this.handleSendRegister(e)}>注册</Button>
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
export default connect(mapStateToProps)(Register);