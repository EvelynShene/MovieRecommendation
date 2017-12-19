import React from 'react';
import { Link } from 'react-router-dom';

function MovieItem(props) {
    return (
        <div style={{ margin: "15px"}}>
            <Link to={"/movie/"+props.imdbID}>
                <img src={props.poster} alt={props.title} width="100"/>
            </Link>
            <div><Link to={"/movie/"+props.imdbID}>{props.title}</Link></div>
        </div>
    )
}

export default MovieItem