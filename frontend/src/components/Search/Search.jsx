import React, { Component } from "react";
import MovieItem from './../Movie/MovieItem'
import axios from 'axios';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDone: false
        };
    }

    async search(value) {
        let response = await axios.get('/api/movie/search', {
            params: {
                q: value
            }
        });
        this.setState({
            q: value,
            movies: response.data,
            isDone: true
        });
    }

    async componentDidMount() {
        this.search(this.props.q);
    }

    async componentWillReceiveProps(nextProps) {
        if (nextProps.q !== this.state.q) {
            this.setState({
                isDone: false
            })
            this.search(nextProps.q);
        }
    }

    render() {
        if (!this.state.isDone) {
            return <div>loading...</div>
        }
        if (this.state.movies === "") {
            return <div>No results!</div>
        }
        const movieItems = this.state.movies.map((movie) =>
            <li key={movie.imdbID}>
                <MovieItem imdbID={movie.imdbID} poster={movie.Poster} title={movie.Title} />
            </li>       
        );
        return (
            <ul>{movieItems}</ul>
        );
    }
}

export default Search;