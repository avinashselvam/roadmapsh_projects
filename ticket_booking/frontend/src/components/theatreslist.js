import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './theatreslist.css';

const TheatresList = ({ token, setSelectedTheatre }) => {

    const navigate = useNavigate()

    const handleTheatreSelect = (theatre_id) => {
        setSelectedTheatre(theatre_id)
        navigate('/shows')
    }

    const [listOfTheatres, setListOfTheatres] = useState([])

    const makeListOfTheatres = (theatres) => {
        let list = []
        for(let i=0; i<theatres.length; i+=1) {
            list.push(
                    <div className="theatre-card" onClick={() => handleTheatreSelect(theatres[i].id)}>
                        <h3>{theatres[i].name}</h3>
                        <p>{theatres[i].address}</p>
                    </div>
            )
        }
        return list
    }

    const fetchAndSetTheatres = () => {
        fetch("http://127.0.0.1:5000/theatres", {
			method: "GET",
			headers: {
				Authorization: "Bearer " + token
			}
        })
        .then(res => res.json())
        .then(res => res.data)
        .then(theatres => setListOfTheatres(makeListOfTheatres(theatres)))
    }

    // on component mount fetch and set the data
    useEffect(fetchAndSetTheatres, [])

    return <div>
        {listOfTheatres}
    </div>

}

export default TheatresList