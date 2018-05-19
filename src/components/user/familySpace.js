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
    message,
    Badge,
    Tag,
    Popconfirm,
    Radio,
    Upload,
    Modal
} from 'antd';
import {
    getJSON,
    postJSON,
    getLocalTime,
    substrAndReplaceToEllipsis
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

class FamilySpace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            genealogyList: '',
            total: 0,
            page: 1,
            pages: 0,
            limit: 12,
            tabIndex: 0,
            isShow: '仅自己可见',
            previewVisible: false,
            previewImage: '',
            fileList: [],
            albumFormState: false,
            albumIndex: 0,
            visible: false,
            previewImageAlbum: '',
            imgIndex: '',
        }
    }
    componentWillMount() {

    }
    componentDidMount() {
        let self = this,
            userId = localStorage.getItem('userId');
        const {
            limit
        } = self.state;
        self.setState({
            userId: userId
        });
        let url = this.props.planlist.api + 'familySpace/list?userId=' + userId + '&serviceType=0&page=1&limit=' + limit;
        let getGenealogy = function(response) {
            console.log(response.data);
            let data = response.data;
            self.setState({
                genealogyList: data.result,
                total: data.total,
                pages: Math.ceil(data.total / limit)
            });
        }
        getJSON(url, getGenealogy);
    }
    handleGetDataForPage(e, type) {
        const {
            page,
            total,
            pages,
            limit,
            userId,
            serviceType,
            tabIndex,
            albumIndex
        } = this.state;
        let pager = 0,
            self = this,
            url;

        switch (type) {
            case 1:
                if (page <= 1) {
                    return false;
                } else {
                    pager = 1;
                }
                break;
            case 2:
                if (page <= 1) {
                    return false;
                } else {
                    pager = page - 1;
                }
                break;
            case 3:
                if (page >= pages) {
                    return false;
                } else {
                    pager = page + 1;
                }
                break;
            case 4:
                if (page >= pages) {
                    return false;
                } else {
                    pager = pages;
                }
                break;
        }
        this.setState({
            page: pager
        });

        if (albumIndex === 0 && tabIndex == 3) {
            url = this.props.planlist.api + 'album/list?userId=' + userId + '&page=' + pager + '&limit=' + limit;
        } else {
            url = this.props.planlist.api + 'familySpace/list?userId=' + userId + '&serviceType=' + tabIndex + '&page=' + pager + '&limit=' + limit;
        }

        let getGenealogyInit = function(response) {
            let data = response.data;
            self.setState({
                genealogyList: data.result,
                total: data.total,
                pages: Math.ceil(data.total / limit)
            });
        }
        getJSON(url, getGenealogyInit);
    }

    handleGetImg(e, type) {
        let self = this,
            url, page = 0;
        const {
            total,
            imgIndex,
            albumIndex,
            userId
        } = self.state;

        switch (type) {
            case 'prev':
                if (imgIndex <= 1) {
                    page = 1;
                    return false;
                } else {
                    page = imgIndex - 1;
                }
                break;
            case 'next':
                if (imgIndex >= total) {
                    page = total;
                    return false;
                } else {
                    page = imgIndex + 1;
                }
                break;
            default:
                if (imgIndex <= 1) {
                    page = 1;
                    return false;
                } else {
                    page = imgIndex - 1;
                }
                break;
        }

        let getAlbum = function(response) {
            console.log(response.data);
            let data = response.data;
            self.setState({
                previewImageAlbum: data.result[0].filePath,
                imgIndex: page
            });
        }

        switch (albumIndex) {
            case 0:
                url = this.props.planlist.api + 'album/list?userId=' + userId + '&page=' + page + '&limit=1';
                break;
            case 1:
                url = this.props.planlist.api + 'familySpace/list?userId=' + userId + '&serviceType=3&page=' + page + '&limit=1';
                break;
            default:
                url = this.props.planlist.api + 'album/list?userId=' + userId + '&page=' + page + '&limit=1';
                break;
        }
        getJSON(url, getAlbum);
    }

    handleGetRelativeFriend(e, key) {
        let self = this,
            url;
        const {
            limit,
            userId
        } = self.state;

        self.setState({
            tabIndex: key,
            genealogyList: ''
        });

        switch (key) {
            case 0:
                url = this.props.planlist.api + 'familySpace/list?userId=' + userId + '&serviceType=' + key + '&page=1&limit=' + limit;
                break;
            case 1:
                url = this.props.planlist.api + 'familySpace/list?userId=' + userId + '&serviceType=' + key + '&page=1&limit=' + limit;
                break;
            case 3:
                url = this.props.planlist.api + 'album/list?userId=' + userId + '&page=1&limit=' + limit;
                break;
            default:
                url = this.props.planlist.api + 'familySpace/list?userId=' + userId + '&serviceType=' + key + '&page=1&limit=' + limit;
                break;
        }
        let getGenealogy = function(response) {
            console.log(response.data);
            let data = response.data;
            self.setState({
                genealogyList: data.result,
                total: data.total,
                pages: Math.ceil(data.total / limit)
            });
        }
        getJSON(url, getGenealogy);
    }

    handleCancel = () => {
        this.setState({
            previewVisible: false
        })
    }

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleChange = ({
        fileList
    }) => {
        this.setState({
            fileList
        })
    }

    getAlbumList() {
        let self = this,
            url;
        const {
            userId,
            limit,
            albumIndex
        } = self.state;
        if (albumIndex === 0) {
            url = this.props.planlist.api + 'album/list?userId=' + userId + '&page=1&limit=' + limit;
        } else {
            url = this.props.planlist.api + 'familySpace/list?userId=' + userId + '&serviceType=3&page=1&limit=' + limit;
        }

        let getData = function(response) {
            console.log(response.data);
            let data = response.data;
            self.setState({
                genealogyList: data.result,
                total: data.total,
                pages: Math.ceil(data.total / limit)
            });
        }
        getJSON(url, getData);
    }
    handleAddAlbum(e) {
        let self = this,
            url = this.props.planlist.api + ('album/add'),
            fileInfos = [];
        const {
            isShow,
            fileList,
            userId
        } = this.state;

        for (var i = 0; i < fileList.length; i++) {
            var fileInfo = {
                createTime: fileList[i].response.createTime,
                filePath: fileList[i].response.filePath,
                originalname: fileList[i].response.originalname
            };
            fileInfos.push(fileInfo);
        }
        let body = {
            userId: userId,
            isShow: isShow,
            fileList: fileInfos
        };
        let getData = function(response) {
            let data = response.data;
            message.success(data.msg);

            self.setState({
                fileList: [],
                albumFormState: false,
                isShow: '仅自己可见'
            });
            self.getAlbumList();
        }

        if (userId && fileList.length) {
            postJSON(url, body, getData);
        }
    }

    handleTagAlbum(e, key) {
        let self = this,
            url;

        self.setState({
            albumIndex: key,
            page: 1,
            pages: 0,
            total: 0
        });

        const {
            limit,
            userId
        } = this.state;

        let getAlbum = function(response) {
            console.log(response.data);
            let data = response.data;
            self.setState({
                genealogyList: data.result,
                total: data.total,
                pages: Math.ceil(data.total / limit)
            });
        }

        switch (key) {
            case 0:
                url = this.props.planlist.api + 'album/list?userId=' + userId + '&page=1&limit=' + limit;
                break;
            case 1:
                url = this.props.planlist.api + 'familySpace/list?userId=' + userId + '&serviceType=3&page=1&limit=' + limit;
                break;
            default:
                url = this.props.planlist.api + 'album/list?userId=' + userId + '&page=1&limit=' + limit;
                break;
        }
        getJSON(url, getAlbum);
    }

    handleDelete(e, id) {
        let self = this;
        const {
            userId
        } = self.state;
        e.preventDefault();
        let url = this.props.planlist.api + 'album/delete';
        let body = {
            id: id,
            userId: userId
        }
        let getData = function(response) {
            let data = response.data;
            message.success(data.msg);
            self.getAlbumList();
        }
        postJSON(url, body, getData);
    }
    render() {
        const {
            genealogyList,
            pages,
            total,
            page,
            tabIndex,
            userId,
            isShow,
            previewVisible,
            previewImage,
            fileList,
            albumFormState,
            albumIndex,
            visible,
            previewImageAlbum,
            imgIndex
        } = this.state;
        //console.log(fileList);
        return (
            <div className="userBox" onLoad={(e)=>{store.dispatch(setPathname('/familySpace'))}}>
                <Header />
                <div className='w_1170 userCenter'>
                    <UserLeft />
                    <div className='userInfo_content' style={{paddingBottom:'66px',position:'relative'}}>
                        <div className='user_title'>
                            {
                                ['家族日志','家族族谱','家庭树','家庭照片'].map((item,key)=>{
                                    return (
                                        <i key={key} className={key == tabIndex ? 'active' : ''} onClick={(e)=>this.handleGetRelativeFriend(e,key)}>{item}</i>
                                    )
                                })
                            }
                            {
                                tabIndex == 3 ? <a href='javascript:;' className='updateGenBtn' onClick={(e)=>{this.setState({albumFormState:true})}}>上传照片</a> : null
                            }
                        </div>
                        <div className='userInfo_form' style={{paddingTop:'20px'}}>
                            {
                                genealogyList.length ? 
                                genealogyList.map((item,key)=>{
                                    return (
                                        tabIndex < 1 ?
                                        <Link to={(tabIndex ? '/logDetail:' : '/myGenealogyDetail:')+item._id} key={key} className='my_expertConsultation_list'>
                                            <h3>{item.title}</h3>
                                            <Icon type='calendar' />{getLocalTime(item.createTime,'-',1)}
                                            <p>{item.content ? substrAndReplaceToEllipsis(item.content,50) : '--'}</p>
                                        </Link> : 
                                        (tabIndex == 1 ? 
                                            <Link to={'/myGenealogyDetail:'+item._id} key={key} className='my_genealogy_list'>
                                            <img src={item.cover} />
                                            <h3>{item.gname}</h3>
                                            <p>{item.creator}等编撰</p>
                                            <p>版本:{item.version}</p>
                                            <p>谱籍地:{item.gplace}</p>
                                            <p style={{textAlign:'right'}}>
                                                <span style={{float:'left'}}>堂号:{item.gtan}</span>
                                            </p>
                                        </Link> : null)
                                    )
                                }) : <NoData />
                            }
                            {
                                tabIndex == 2 && userId ?
                                <iframe width='920px' height='697px' src={'http://gt.qingtime.cn/familyTree/?userKey='+userId+'&editable=1&type=0'}></iframe> : null
                            }
                            {
                                tabIndex == 3 ?
                                ['我上传的','家庭全部'].map((item,key)=>{
                                    return (
                                        <span className={"albumTag "+(albumIndex == key ? 'active' : '')} key={key} onClick={(e)=>this.handleTagAlbum(e,key)}>{item}</span>
                                    )
                                }) : null
                            }
                            {
                                tabIndex == 3 ?
                                <div className="albumListBox">
                                    {
                                        genealogyList.length ? 
                                        genealogyList.map((item,key)=>{
                                            return (
                                                <div className="albumList" key={key}>
                                                    <div className="albumList__img">
                                                        <img src={this.props.planlist.api+item.filePath} onClick={(e)=>{this.setState({previewImageAlbum:item.filePath,imgIndex:(key+1),visible:true})}} alt=""/>
                                                    </div>
                                                    <p>{getLocalTime(item.createTime,'-',1)}</p>
                                                    {
                                                        albumIndex === 0 ? <Popconfirm title="确定要删除图片吗？" onConfirm={(e)=>this.handleDelete(e,item._id)} onCancel={(e)=>{e.preventDefault()}}><Icon className="albumList--delete" type='delete' /></Popconfirm> : null
                                                    }
                                                </div>
                                            )
                                        }) : <NoData />
                                    }
                                </div> : null
                            }
                        </div>
                        {
                            pages > 1 ?
                            <div className="pagebox userPage">
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
                </div>
                <Footer />
                {
                    albumFormState ? 
                    <div className="masklayer">
                        <div className="masklayer__form">
                            <h3>上传照片</h3>
                            <RadioGroup className="masklayer__RadioGroup" onChange={(e)=>{this.setState({isShow:e.target.value})}} value={isShow}>
                                <Radio value={'仅自己可见'}>仅自己可见</Radio>
                                <Radio value={'亲友'}>亲友</Radio>
                                <Radio value={'同姓氏'}>同姓氏</Radio>
                                <Radio value={'全文'}>全文</Radio>
                            </RadioGroup>
                            <div className="masklayer__upload">
                                <Upload
                                  action={this.props.planlist.api+"upload"}
                                  listType="picture-card"
                                  fileList={fileList}
                                  name="avatar"
                                  onPreview={this.handlePreview}
                                  onChange={this.handleChange}
                                >
                                {
                                    fileList.length >= 12 ? null : 
                                    <div>
                                        <Icon type="plus" />
                                        <div className="ant-upload-text">Upload</div>
                                    </div>
                                }
                                </Upload>
                                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                </Modal>
                            </div>
                            <div className="masklayer__btn">
                                <Button type="primary" style={{marginRight:'20px'}} onClick={(e)=>this.handleAddAlbum(e)}>确定</Button>
                                <Button onClick={(e)=>{this.setState({fileList:[],albumFormState:false,isShow:'仅自己可见'})}}>取消</Button>
                            </div>
                            <Icon className="masklayer--close" onClick={(e)=>{this.setState({albumFormState:false,fileList:[],isShow:'仅自己可见'})}} type='close' />
                        </div>
                    </div> : null
                }
                <Modal maskClosable={false} width='568px' footer='' title="图片预览" visible={visible} onCancel={(e)=>{this.setState({visible:false})}}
                >
                  <img style={{width:'520px'}} src={previewImageAlbum ? (this.props.planlist.api+previewImageAlbum) : './images/cover.jpg'} />
                  <Icon onClick={(e)=>this.handleGetImg(e,'prev')} type='caret-left' className="modal--left" />
                  <Icon onClick={(e)=>this.handleGetImg(e,'next')} type='caret-right' className="modal--right" />
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = function(store) {
    return {
        planlist: store.planlist
    };
};
export default connect(mapStateToProps)(FamilySpace);