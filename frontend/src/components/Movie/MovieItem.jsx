import React from 'react';

function MovieItem(props) {
    return (
        <div style={{ margin: "15px"}}>
            <a href={"/movie/"+props.imdbID}>
                <img src={props.poster} alt={props.title} width="100"/>
            </a>
            <div><a href={"/movie/"+props.imdbID}>{props.title}</a></div>
        </div>
    )
}

export default MovieItem