import React, { Component } from "react";
import { Link, Redirect } from 'react-router-dom';
import { Row, Col, Rate, Button, message } from "antd";
import axios from 'axios';
import NoMatch from './../NoMatch'
import './movie.css';

class Movie extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            isDone: false,
            isError: false
        }
        this.rate = this.rate.bind(this);
        // this.logout = this.logout.bind(this);
    }

    async getMovieInfo(imdbId) {
        let response = await axios.get('/api/movie/info', {
            params: {
                id: imdbId
            }
        });
        if ('Title' in response.data && response.data.Title !== "") {
            this.setState({
                movieInfo: response.data,
                isDone: true
            });
        } else {
            this.setState({
                isError: true
            });
        }
    }

    async componentDidMount() {
        this.getMovieInfo(this.props.movieId);       
    }

    async componentWillReceiveProps(nextProps) {
        if (nextProps.movieId !== this.state.movieId) {
            this.setState({
                isDone: false
            })
            this.getMovieInfo(nextProps.movieId);
        }
    }

    async rate(value) {
        let response = await axios.post('/api/movie/rate', {
            imdbId: this.props.movieId,
            title: this.state.movieInfo.Title,
            rating: value
        });
        console.log(response.data);
    }
      
    render() {
        if (this.state.isError) {
            return <NoMatch />
        }
        if (!this.state.isDone) {
            return <div>loading...</div>
        }
        const movieInfo = this.state.movieInfo;
        const similarMovies = movieInfo.similar.map((movie) =>
            <li key={movie[0]}><Link to={"/movie/"+movie[0]}>{movie[1]}</Link></li>
        );
        return ( 
            <div>
                <Row className="row">
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <div className="section">
                            <img className="poster" src={movieInfo.Poster} stalt="poster"/>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                        <div className="section">
                            <h1>{movieInfo.Title}</h1>
                            <div>
                                <span className="item">Average of {movieInfo.ratingCount} ratings: </span>
                                <span>{movieInfo.averageRating}</span>
                            </div>
                            {this.props.isLogin &&
                                <div>
                                    <span className="item">Your rating: </span>
                                    <Rate allowHalf defaultValue={movieInfo.isRated ? movieInfo.userRating : 0} onChange={this.rate}/>
                                    {/*<Button>Add to list</Button>*/}
                                </div>
                            }
                            <div>
                                <span className="item">Directors: </span>
                                <span>{movieInfo.Director}</span>
                            </div>
                            <div>
                                <span className="item">Writers: </span>
                                <span>{movieInfo.Writer}</span>
                            </div>
                            <div>
                                <span className="item">Cast: </span>
                                <span>{movieInfo.Actors}</span>
                            </div>
                            <div>
                                <span className="item">Genre: </span>
                                <span>{movieInfo.Genre}</span>
                            </div>
                            <div>
                                <span className="item">Country: </span>
                                <span>{movieInfo.Country}</span>
                            </div>
                            <div>
                                <span className="item">Language: </span>
                                <span>{movieInfo.Language}</span>
                            </div>
                            <div>
                                <span className="item">Released: </span>
                                <span>{movieInfo.Released}</span>
                            </div>
                            <div>
                                <span className="item">Runtime: </span>
                                <span>{movieInfo.Runtime}</span>
                            </div>
                            <div>
                                <span className="item">Plot: </span>
                                <span>{movieInfo.Plot}</span>
                            </div>
                            <div>
                                <span className="item">Link: </span>
                                <a target="_blank" href={"http://www.imdb.com/title/" + this.props.movieId}>imdb</a>
                            </div>
                        </div>
                    </Col>
                </Row>    
                
                <Row className="row">
                    <div className="section">
                        <h2>People who liked this also liked...</h2>
                        <ul>{similarMovies}</ul>
                    </div>
                </Row>
            </div>
        );
    }   
}

export default Movie;