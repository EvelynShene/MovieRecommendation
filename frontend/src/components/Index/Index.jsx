import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from "antd";
import axios from 'axios';
// import './Home.css';

class Index extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            isDone: false
        }
        // this.logout = this.logout.bind(this);
    }

    async componentDidMount() {
        let pickResponse = await axios.get('/api/movie/picks');
        this.setState({
            picks: pickResponse.data.picks
        });
        if (this.props.isLogin) {
            let response = await axios.get('/api/user/info');
            this.setState({
                rated: response.data.rated,
                recommendations: response.data.recommendations
            });
        }
        this.setState({
            isDone: true
        })
        
        // if ('Title' in response.data && response.data.Title !== "") {
        //     this.setState({
        //         movieInfo: response.data,
        //         isDone: true
        //     });
        // } else {
        //     this.setState({
        //         isError: true
        //     });
        // }
        
    }


    render() {
        
        if (!this.state.isDone) {
            return <div>loading...</div>
        }
        const topPicks = [
            {imdbId: "tt0111161", title: "The Shawshank Redemption"},
            {imdbId: "tt0068646", title: "The Godfather"},
            {imdbId: "tt0114814", title: "The Usual Suspects"},
            {imdbId: "tt0108052", title: "Schindler's List"},
            {imdbId: "tt0137523", title: "Fight Club"},
            {imdbId: "tt0073486", title: "One Flew Over the Cuckoo's Nest"},
            {imdbId: "tt0245429", title: "Spirited Away"},
            {imdbId: "tt0468569", title: "The Dark Knight"},
            {imdbId: "tt0910970", title: "WALL·E"},
            {imdbId: "tt0110912", title: "Pulp Fiction"},
        ];
        const topMovies = topPicks.map((movie) =>
            <li key={movie.imdbId}><Link to={"/movie/"+movie.imdbId}>{movie.title}</Link></li>
        );
        let pickMovies = this.state.picks.map((movie) =>
            <li key={movie.imdbId}><Link to={"/movie/"+movie.imdbId}>{movie.title}</Link></li>
        );
        let ratedMovies = [];
        let recommendationMovies = [];
        if (this.props.isLogin && this.state.rated && this.state.recommendations) {
            ratedMovies = this.state.rated.map((movie) =>
                <li key={movie.imdbId}><Link to={"/movie/"+movie.imdbId}>{movie.title}</Link></li>
            );
            recommendationMovies = this.state.recommendations.map((movie) =>
                <li key={movie.imdbId}><Link to={"/movie/"+movie.imdbId}>{movie.title}</Link></li>
            );
        }
        return ( 
            <div>
                {this.props.isLogin &&
                    <div>
                        <h2>recommendations for you</h2>
                        <ul>{recommendationMovies}</ul>
                        <h2>rated movies</h2>
                        <ul>{ratedMovies}</ul>
                    </div>  
                }
                <h2>top picks</h2>
                <ul>{topMovies}</ul>
                <h2>random picks</h2>
                <ul>{pickMovies}</ul>
            </div>
        );
    }
}

export default Index;