import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './showslist.css'

const ShowsList = ({ selectedDate, selectedTheatre, selectedMovie, setSelectedShow }) => {

    const navigate = useNavigate()

    const handleShowSelect = (show_id) => {
        setSelectedShow(show_id)
        navigate('/seats')
    }

    const [listOfShows, setListOfShows] = useState([])

    const makeListOfShows = (shows) => {
        let list = []
        for(let i=0; i<shows.length; i+=1) {
            list.push(
                <div className="show-card" onClick={() => handleShowSelect(shows[i].id)}>
                    {shows[i].theatre_id} {shows[i].movie_id} {shows[i].at}
                </div>
            )
        }
        return list
    }

    const fetchAndSetShows = () => {
        fetch("http://127.0.0.1:5000/shows?theatre_id=" + selectedTheatre + "&date=" + selectedDate)
        .then(res => res.json())
        // .then(console.log)
        .then(res => res.data)
        .then(shows => setListOfShows(makeListOfShows(shows)))
    }

    // on component mount fetch and set the data
    useEffect(fetchAndSetShows, [])
    useEffect(fetchAndSetShows, [selectedDate])

    return <div>
        <h2>Shows</h2>
        {listOfShows}
    </div>

}

export default ShowsList