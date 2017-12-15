import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Layout } from 'antd';
const { Content } = Layout;
import { Switch, BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import {
    CommonHeader, 
    CommonFooter,
    Index,
    Movie,
    LoginForm,
    SignupForm,
    Search,
    NoMatch
} from './components/index';
import './style.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin: false,
            username: ''
        };
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.search = this.search.bind(this);
    }

    async componentDidMount() {
        let response = await axios.get('/api/user/login');
        this.setState({
            isLogin: response.data.isLogin,
            username: response.data.username
        });
    }
    
    async login(formData) {
        let response = await axios.post('/api/user/login', formData);
        if (response.data.isLogin) {
            this.setState({
                isLogin: true,
                username: formData.username
            });
        }
        return response;
    }

    async logout() {
        let response = await axios.get('/api/user/logout');
        if (!response.data.isLogin) {
            this.setState({
                isLogin: false,
                username: ''
            });
        } else {
            message.error('Logout error');
        }
    }

    async search(value) {
        window.location.href = `/search?q=${value}`;
    }

    render() {
        return (
            <Layout>
                <CommonHeader 
                    isLogin={this.state.isLogin} 
                    username={this.state.username} 
                    onLogout={this.logout}
                    onSearch={this.search}
                />
                <Content className="container content">
                    <Router>
                        <Switch>
                            <Route exact path="/" render={() => (
                                <Index isLogin={this.state.isLogin} />
                            )}/>
                            <Route path="/login" render={() => (
                                this.state.isLogin ? (
                                    <Redirect to="/"/>
                                ) : (
                                    <LoginForm onLogin={this.login}/>
                                ) 
                            )}/>
                            <Route path="/signup" render={() => (
                                this.state.isLogin ? (
                                    <Redirect to="/"/>
                                ) : (
                                    <SignupForm />
                                )
                            )}/>
                            {/*<Route path="/user/:id" component={Movie}/>*/}
                            {/*<Route path="/user/:id/list" component={Movie}/>*/}
                            <Route path="/movie/:id" render={({match}) => (
                                <Movie 
                                    isLogin={this.state.isLogin} 
                                    movieId={match.params.id}
                                />
                            )}/>
                            {/*<Route path="/movie/:id/post/:id" component={Movie}/>*/}
                            <Route path="/search" render={() => (
                                <Search/>
                            )}/>
                            <Route component={NoMatch}/>
                        </Switch>
                    </Router>
                </Content>
                <CommonFooter />
            </Layout>
        );
    }
}

export default App;