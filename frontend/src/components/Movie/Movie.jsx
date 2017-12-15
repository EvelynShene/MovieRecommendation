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

    async componentDidMount() {
        let response = await axios.get('/api/movie/info', {
            params: {
                id: this.props.movieId
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
        return ( 
            <div>
                <Row>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <div className="section">
                            <img className="poster" src={movieInfo.Poster} stalt="poster"/>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                        <div className="section">
                            <h1>{movieInfo.Title}({movieInfo.Year})</h1>
                            <div>
                                <span>Average of {movieInfo.ratingCount} ratings: </span>
                                <span>{movieInfo.averageRating}</span>
                            </div>
                            {this.props.isLogin &&
                                <div>
                                    <Rate allowHalf defaultValue={movieInfo.isRated ? movieInfo.userRating : 0} onChange={this.rate}/>
                                    {/*<Button>Add to list</Button>*/}
                                </div>
                            }
                            <div>
                                <span>Directors: </span>
                                <span>{movieInfo.Director}</span>
                            </div>
                            <div>
                                <span>Writers: </span>
                                <span>{movieInfo.Writer}</span>
                            </div>
                            <div>
                                <span>Cast: </span>
                                <span>{movieInfo.Actors}</span>
                            </div>
                            <div>
                                <span>Genre: </span>
                                <span>{movieInfo.Genre}</span>
                            </div>
                            <div>
                                <span>Country: </span>
                                <span>{movieInfo.Country}</span>
                            </div>
                            <div>
                                <span>Language: </span>
                                <span>{movieInfo.Language}</span>
                            </div>
                            <div>
                                <span>Released: </span>
                                <span>{movieInfo.Released}</span>
                            </div>
                            <div>
                                <span>Runtime: </span>
                                <span>{movieInfo.Runtime}</span>
                            </div>
                            <div>
                                <span>Plot: </span>
                                <span>{movieInfo.Plot}</span>
                            </div>
                        </div>
                    </Col>
                </Row>    
                
                <Row>
                    <h2>People who liked this also liked...</h2>
                </Row>
            </div>
        );
    }   
}

export default Movie;