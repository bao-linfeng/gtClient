import React, {
    Component
} from 'react';
import {
    connect
} from 'react-redux';
import {
    Link
} from 'react-router-dom';
import store from '../../redux/store.js';
import {
    Icon,
    Upload,
    message
} from 'antd';
import data from "../../data/db.js";
import {
    getJSON,
    postJSON
} from '../ADS.js';

import {
    getNewsList
} from '../../actions/plan.js';
import '../css/user.css';

class UserLeft extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: './images/ava.png',
            surname: '',
            name: '',
            tel: '',
            userId: '',
            freinds: 0,
            messages: 0,
            limit: 10,
            user_left_nav: '',
        }
    }
    componentWillMount() {
        let self = this,
            user_left_nav = data.user_left_nav,
            userId = localStorage.getItem('userId'),
            roleId = localStorage.getItem('roleId');
        const {
            limit
        } = self.state;

        if (roleId == 1) {
            user_left_nav = data.user_left_nav.filter((currentValue, index) => {
                if (index < 9) {
                    return currentValue;
                }
            });
        }
        if (!userId) {
            return false;
        }
        self.setState({
            userId: userId,
            user_left_nav: user_left_nav
        });

        //亲友
        let url = this.props.planlist.api + 'relativeFriend/list?userId=' + userId + '&serviceType=0&page=1&limit=' + limit;
        let getGenealogy = function(response) {
            console.log(response.data);
            let data = response.data;
            self.setState({
                freinds: data.total
            });
        }
        getJSON(url, getGenealogy);
        //用户信息
        url = this.props.planlist.api + 'user/detail?userId=' + userId;
        let getUserInfo = function(response) {
            console.log(response.data);
            let data = response.data.result;
            self.setState({
                surname: data.surname,
                name: data.name,
                tel: data.tel,
                imageUrl: (data.avatar ? data.avatar : './images/ava.png')
            });
        }
        getJSON(url, getUserInfo);
        //消息
        url = this.props.planlist.api + 'message/list?userId=' + userId + '&page=1&limit=' + limit;
        let getMessage = function(response) {
            console.log(response.data);
            let data = response.data;
            self.setState({
                messages: data.total
            });
        }
        getJSON(url, getMessage);
    }
    componentDidMount() {

    }
    beforeUpload(file) {
        const isJPG = (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png');
        if (!isJPG) {
            message.error('只允许jpeg、jpg、png格式!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片大小不能超过2MB!');
        }
        return isJPG && isLt2M;
    }
    handleChange = (info) => {
        const {
            userId
        } = this.state;
        let self = this;
        if (info.file.status === 'done') {
            this.setState({
                imageUrl: (this.props.planlist.api + info.file.response.filePath)
            });

            let url = self.props.planlist.api + ('avatar/update'),
                uri = (self.props.planlist.api + info.file.response.filePath);
            let body = {
                userId: userId,
                avatar: uri
            };
            let getData = function(response) {
                let data = response.data;
                localStorage.setItem('avatar', uri);
                message.success(data.msg);
            }
            postJSON(url, body, getData);
        }
    }
    render() {
        const {
            imageUrl,
            surname,
            name,
            tel,
            freinds,
            messages,
            user_left_nav
        } = this.state;
        return (
            <div className="userLeft">
                <div className='userLeft_avatar'>
                    <Upload
                        className="avatar-uploader"
                        name="avatar"
                        showUploadList={false}
                        action={this.props.planlist.api+"upload"}
                        beforeUpload={(file)=>this.beforeUpload(file)}
                        onChange={(info)=>this.handleChange(info)}
                    >
                    <img src={imageUrl} alt="avatar" className="avatar" />
                    </Upload>
                    <p>{surname || name ? (surname+name) : '未命名'}</p>
                    <span>{tel ? tel : '未修改'}</span>
                    <Link to='/relativeFriend' className='userLeft_msg'>
                        <i>{freinds}</i>
                        <span>亲友</span>
                    </Link>
                    <Link to='/message' className='userLeft_msg'>
                        <i>{messages}</i>
                        <span>消息</span>
                    </Link>
                </div>
                <div className='user_nav'>
                {
                    user_left_nav.length ?
                    user_left_nav.map((item,key)=>{
                        return (
                            <Link to={item.url} key={key} className={this.props.planlist.pathname == item.url ? 'active' : ''}>{item.title}</Link>
                        )
                    }) : null
                }
                </div>
            </div>
        )
    }
}

const mapStateToProps = function(store) {
    return {
        planlist: store.planlist
    };
};
export default connect(mapStateToProps)(UserLeft);