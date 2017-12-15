import React, { Component } from "react";
import MovieItem from './../Movie/MovieItem'
import axios from 'axios';

class Search extends Component {
    constructor(props) {
        super(props);
        let url = new URL(window.location.href);
        let q = url.searchParams.get("q");
        this.state = {
            isDone: false,
            q
        };
    }

    async componentDidMount() {
        let response = await axios.get('/api/movie/search', {
            params: {
                q: this.state.q
            }
        });
        this.setState({
            movies: response.data,
            isDone: true
        });
    }

    render() {
        if (!this.state.isDone) {
            return <div>loading...</div>
        }
        const movieItems = this.state.movies.map((movie) =>
            <MovieItem imdbID={movie.imdbID} poster={movie.Poster} title={movie.Title} />
        );
        return (
            <ul>{movieItems}</ul>
        );
    }
}

export default Search;