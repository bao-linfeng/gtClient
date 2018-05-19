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
    Button,
    Icon,
    Radio,
    DatePicker,
    Upload,
    message
} from 'antd';
import moment from 'moment';
import data from "../../data/db.js";
import {
    getJSON,
    postJSON,
    getLocalTime
} from '../ADS.js';
import Header from '../header.js';
import Footer from '../footer.js';
import UserLeft from './userLeft.js';
import NoData from '../noData.js';

import {
    getNewsList,
    setPathname
} from '../../actions/plan.js';
import '../css/user.css';

const RadioGroup = Radio.Group;

class AdminAddGenealogy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gname: '',
            surname: '',
            gplace: '',
            gtan: '',
            volume: '',
            ancestor: '',
            original: '',
            version: '',
            creator: '',
            gsummary: '',
            cover: '',
            serviceType: '1',
            operateType: 'add',
            userId: '',
            id: '',
            leaf: '',
            scanned_image_number: '',
            edit_time: '',
            publish_time: '',
            GS_number: '',
            collector_number: '',
            diaspora: '',
            note: '',
            collections: '',
            spectrum_id: '',
        }
    }

    componentDidMount() {
        let self = this,
            userId = localStorage.getItem('userId');
        self.setState({
            userId: userId
        });
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
        if (info.file.status === 'done') {
            message.success('上传成功');
            this.setState({
                cover: info.file.response.filePath
            });
        }
    }
    handleSendGenealogy(e) {
        let self = this,
            url = this.props.planlist.api + ('genealogyList/add');
        const {
            userId,
            edit_time,
            publish_time,
            GS_number,
            collector_number,
            diaspora,
            note,
            collections,
            spectrum_id,
            scanned_image_number,
            leaf,
            gname,
            surname,
            gplace,
            gtan,
            volume,
            ancestor,
            original,
            version,
            creator,
            gsummary,
            cover
        } = this.state;

        let body = {
            userId: userId,
            edit_time: edit_time,
            publish_time: publish_time,
            GS_number: GS_number,
            collector_number: collector_number,
            diaspora: diaspora,
            note: note,
            collections: collections,
            spectrum_id: spectrum_id,
            scanned_image_number: scanned_image_number,
            leaf: leaf,
            gname: gname,
            surname: surname,
            gplace: gplace,
            gtan: gtan,
            volume: volume,
            ancestor: ancestor,
            original: original,
            version: version,
            creator: creator,
            gsummary: gsummary,
            cover: cover
        };
        let getData = function(response) {
            let data = response.data;
            message.success(data.msg);

            self.props.history.push('/genealogyList');
        }
        if (gname && surname && cover) {
            postJSON(url, body, getData);
        } else {
            message.warn('谱名、姓氏、封面不能为空');
        }
    }
    render() {
        const {
            edit_time,
            publish_time,
            GS_number,
            collector_number,
            diaspora,
            note,
            collections,
            spectrum_id,
            scanned_image_number,
            leaf,
            gname,
            surname,
            gplace,
            gtan,
            volume,
            ancestor,
            original,
            version,
            creator,
            gsummary,
            cover
        } = this.state;
        return (
            <div className="userBox" onLoad={(e)=>{store.dispatch(setPathname(''))}}>
                <Header />
                <div className='w_1170 userCenter'>
                    <UserLeft />
                    <div className='userInfo_content'>
                        <div className='user_title'>
                            <span>新增家谱</span>
                            <Link to='/genealogyList' className='updateGenBtn'>返回上一页</Link>
                        </div>
                        <ul className='userInfo_form'>
                            <li>
                                <label><i style={{color:'#f00'}}>*</i>题名:</label>
                                <input type='text' value={gname} onChange={(e)=>{this.setState({gname:e.target.value})}} placeholder='请输入家谱名称,最多50个字' />
                            </li>
                            <li>
                                <label><i style={{color:'#f00'}}>*</i>姓氏:</label>
                                <input type='text' value={surname} onChange={(e)=>{this.setState({surname:e.target.value})}} placeholder='请输入姓氏' />
                            </li>
                            <li>
                                <label>谱籍地:</label>
                                <input type='text' value={gplace} onChange={(e)=>{this.setState({gplace:e.target.value})}} placeholder='请输入谱籍地' />
                            </li>
                            <li>
                                <label>堂号:</label>
                                <input type='text' value={gtan} onChange={(e)=>{this.setState({gtan:e.target.value})}} placeholder='请输入堂号' />
                            </li>
                            <li>
                                <label>页数:</label>
                                <input type='text' value={leaf} onChange={(e)=>{this.setState({leaf:e.target.value})}} placeholder='请输入页数' />
                            </li>
                            <li>
                                <label>册数:</label>
                                <input type='text' value={volume} onChange={(e)=>{this.setState({volume:e.target.value})}} placeholder='请输入卷数' />
                            </li>
                            <li>
                                <label>扫描图像编号:</label>
                                <input type='text' value={scanned_image_number} onChange={(e)=>{this.setState({scanned_image_number:e.target.value})}} placeholder='请输入扫描图像编号' />
                            </li>
                            <li>
                                <label>撰修年:</label>
                                <input type='text' value={edit_time} onChange={(e)=>{this.setState({edit_time:e.target.value})}} placeholder='请输入撰修年' />
                            </li>
                            <li>
                                <label>出版年:</label>
                                <input type='text' value={publish_time} onChange={(e)=>{this.setState({publish_time:e.target.value})}} placeholder='请输入出版年' />
                            </li>
                            <li>
                                <label>GS编号:</label>
                                <input type='text' value={GS_number} onChange={(e)=>{this.setState({GS_number:e.target.value})}} placeholder='请输入GS编号' />
                            </li>
                            <li>
                                <label>收藏者编号:</label>
                                <input type='text' value={collector_number} onChange={(e)=>{this.setState({collector_number:e.target.value})}} placeholder='请输入收藏者编号' />
                            </li>
                            <li>
                                <label>散居地:</label>
                                <input type='text' value={diaspora} onChange={(e)=>{this.setState({diaspora:e.target.value})}} placeholder='请输入散居地' />
                            </li>
                            <li>
                                <label>始祖:</label>
                                <input type='text' value={ancestor} onChange={(e)=>{this.setState({ancestor:e.target.value})}} placeholder='请输入始祖' />
                            </li>
                            <li>
                                <label>备考/注释:</label>
                                <textarea value={note} onChange={(e)=>{this.setState({note:e.target.value})}} placeholder='请输入备考/注释'></textarea>
                            </li>
                            <li>
                                <label>始迁祖:</label>
                                <input type='text' value={original} onChange={(e)=>{this.setState({original:e.target.value})}} placeholder='请输入始迁祖' />
                            </li>
                            <li>
                                <label>馆藏地:</label>
                                <input type='text' value={collections} onChange={(e)=>{this.setState({collections:e.target.value})}} placeholder='请输入馆藏地' />
                            </li>
                            <li>
                                <label>版本:</label>
                                <input type='text' value={version} onChange={(e)=>{this.setState({version:e.target.value})}} placeholder='请输入版本时间' />
                            </li>
                            <li>
                                <label>责任者:</label>
                                <input type='text' value={creator} onChange={(e)=>{this.setState({creator:e.target.value})}} placeholder='请输入撰修者' />
                            </li>
                            <li>
                                <label>提要:</label>
                                <textarea value={gsummary} onChange={(e)=>{this.setState({gsummary:e.target.value})}} placeholder='请输入提要'></textarea>
                            </li>
                            <li>
                                <label>谱目ID:</label>
                                <input type='text' value={spectrum_id} onChange={(e)=>{this.setState({spectrum_id:e.target.value})}} placeholder='请输入谱目ID' />
                            </li>
                            <li>
                                <label><i style={{color:'#f00'}}>*</i>上传封面:</label>
                                <Upload
                                    className="avatar-uploader"
                                    name="avatar"
                                    showUploadList={false}
                                    action={this.props.planlist.api+"upload"}
                                    beforeUpload={(file)=>this.beforeUpload(file)}
                                    onChange={(info)=>this.handleChange(info)}
                                >
                                <div className="addGenealogyCover">
                                    {cover ? <img src={this.props.planlist.api+cover} alt="avatar" /> : <Icon type='plus' className='gplus' />}
                                </div>
                                </Upload>
                            </li>
                            <li style={{borderTop:'1px solid #ddd',paddingTop:'20px'}}>
                                <Button onClick={(e)=>this.handleSendGenealogy(e)}>确定</Button>
                            </li>
                        </ul>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

const mapStateToProps = function(store) {
    return {
        planlist: store.planlist
    };
};
export default connect(mapStateToProps)(AdminAddGenealogy);