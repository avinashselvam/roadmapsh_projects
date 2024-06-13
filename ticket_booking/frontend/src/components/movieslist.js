import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './movieslist.css'

const MoviesList = ({ setSelectedMovie }) => {

    const navigate = useNavigate()

    const handleMovieSelect = (movie_id) => {
        setSelectedMovie(movie_id)
        navigate('/shows')
    }

    const [listOfMovies, setListOfMovies] = useState([])

    const makeListOfMovies = (movies) => {
        let list = []
        for(let i=0; i<movies.length; i+=1) {
            list.push(
                    <div className="movie-card" onClick={() => handleMovieSelect(movies[i].id)}>
                        <h3>{movies[i].name}</h3>
                        <p>{movies[i].runtime_in_minutes} minutes</p>
                    </div>
            )
        }
        return list
    }

    const fetchAndSetMovies = () => {
        fetch("http://127.0.0.1:5000/movies")
        .then(res => res.json())
        .then(res => res.data)
        .then(movies => setListOfMovies(makeListOfMovies(movies)))
    }

    // on component mount fetch and set the data
    useEffect(fetchAndSetMovies, [])

    return <div>
        <h2>Movies</h2>
        {listOfMovies}
    </div>

}

export default MoviesList