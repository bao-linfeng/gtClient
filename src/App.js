import React, { Component } from 'react';
import {BrowserRouter as Router,Route,Link} from 'react-router-dom';
import {Provider,connect} from 'react-redux';
import store from './redux/store.js';
import logo from './logo.svg';
import Header from './components/header.js';
import LinkPage from './components/linkPage.js';
import GenealogyDatabase from './components/genealogyDatabase.js';
import CelebrityDatabase from './components/celebrityDatabase.js';
import SurnameDatabase from './components/surnameDatabase.js';
import ExpertConsultation from './components/expertConsultation.js';
import AddConsultation from './components/addConsultation.js';
import ExpertConsultationDetail from './components/ExpertConsultationDetail.js';
import Register from './components/register.js';
import Login from './components/login.js';
import UserInfo from './components/user/userInfo.js';
import AddNews from './components/user/addNews.js';
import MyGenealogy from './components/user/myGenealogy.js';
import MyExpertConsultation from './components/user/myExpertConsultation.js';
import MyLog from './components/user/myLog.js';
import AddLog from './components/user/addLog.js';
import LogDetail from './components/user/logDetail.js';
import AddGenealogy from './components/user/addGenealogy.js';
import MyDonation from './components/user/myDonation.js';
import MyGenealogyDetail from './components/user/genealogyDetail.js';
import CheckGenealogy from './components/user/checkGenealogy.js';
import Message from './components/user/message.js';
import RelativeFriend from './components/user/relativeFriend.js';
import MyCollection from './components/user/myCollection.js';
import FamilySpace from './components/user/familySpace.js';
import AdminAddGenealogy from './components/user/adminAddGenealogy.js';
import GenealogyList from './components/user/genealogyList.js';

import News from './components/news.js';
import NewsDetail from './components/newsDetail.js';
import Encyclopedia from './components/encyclopedia.js';
import EncyclopediaDetail from './components/encyclopediaDetail.js';
import './App.css';
//引入路由
import createHistory from 'history/createBrowserHistory';
const history = createHistory();

class App extends Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <Router history={history}>
            <div>
              <Route exact path="/" component={LinkPage} />
              <Route path="/header" component={Header} />
              <Route path="/genealogyDatabase" component={GenealogyDatabase} />
              <Route path="/celebrityDatabase" component={CelebrityDatabase} />
              <Route path="/surnameDatabase" component={SurnameDatabase} />
              <Route path="/expertConsultation" component={ExpertConsultation} />
              <Route path="/addConsultation" component={AddConsultation} />
              <Route path="/expertConsultationDetail:id" component={ExpertConsultationDetail} />
              <Route path="/news" component={News} />
              <Route path="/encyclopedia" component={Encyclopedia} />
              <Route path="/register" component={Register} />
              <Route path="/login" component={Login} />
              <Route path="/userInfo" component={UserInfo} />
              <Route path="/myGenealogyDetail:id" component={MyGenealogyDetail} />
              <Route path="/myExpertConsultation" component={MyExpertConsultation} />
              <Route path="/myGenealogy" component={MyGenealogy} />
              <Route path="/myDonation" component={MyDonation} />
              <Route path="/myLog" component={MyLog} />
              <Route path="/addLog:id" component={AddLog} />
              <Route path="/logDetail:id" component={LogDetail} />
              <Route path="/message" component={Message} />
              <Route path="/relativeFriend" component={RelativeFriend} />
              <Route path="/myCollection" component={MyCollection} />
              <Route path="/familySpace" component={FamilySpace} />
              <Route path="/adminAddGenealogy:id" component={AdminAddGenealogy} />
              <Route path="/genealogyList" component={GenealogyList} />

              <Route path="/checkGenealogy" component={CheckGenealogy} />
              <Route path="/addNews" component={AddNews} />
              <Route path="/newsDetail:id" component={NewsDetail} />
              <Route path="/encyclopediaDetail:id" component={EncyclopediaDetail} />
              <Route path="/addGenealogy:id" component={AddGenealogy} />
            </div>
          </Router>
        </div>
      </Provider>
    );
  }
}
export default App;
