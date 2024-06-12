import { useEffect, useState } from 'react'

const MoviesList = () => {

    const [theatres, setTheatres] = useState([])

    let listOfTheatreElements = []

    const fetchAndSetTheatres = () => {
        fetch("http://127.0.0.1:5000/theatres")
        .then(res => res.json())
        .then(res => setTheatres(res.data))
    }

    // on component mount fetch and set the data
    useEffect(fetchAndSetTheatres, [])

    useEffect(() => {
        listOfTheatreElements = []
        for(let i=0; i<theatres.length; i+=1) {
            listOfTheatreElements.push(<li>{theatres[i].name}</li>)
        }
    }, [theatres])

    return <div>
        <h2>Movies</h2>
        {listOfTheatreElements}
    </div>

}

export default MoviesList