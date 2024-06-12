import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TheatresList = ({ setSelectedTheatre }) => {

    const navigate = useNavigate()

    const handleTheatreSelect = (theatre_id) => {
        setSelectedTheatre(theatre_id)
        navigate('shows')
    }

    const [listOfTheatres, setListOfTheatres] = useState([])

    const makeListOfTheatres = (theatres) => {
        let list = []
        for(let i=0; i<theatres.length; i+=1) {
            list.push(<li onClick={() => handleTheatreSelect(theatres[i].id)}>{theatres[i].name}</li>)
        }
        return list
    }

    const fetchAndSetTheatres = () => {
        fetch("http://127.0.0.1:5000/theatres")
        .then(res => res.json())
        .then(res => res.data)
        .then(theatres => setListOfTheatres(makeListOfTheatres(theatres)))
    }

    // on component mount fetch and set the data
    useEffect(fetchAndSetTheatres, [])

    return <div>
        <h2>Theatres</h2>
        <ul>{listOfTheatres}</ul>
    </div>

}

export default TheatresList