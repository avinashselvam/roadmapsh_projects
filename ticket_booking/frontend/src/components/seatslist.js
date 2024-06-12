import { useEffect, useState } from "react"

import './seatslist.css'

const SeatsList = ({ selectedShow, setSelectedSeat }) => {

    const [listOfSeats, setListOfSeats] = useState([])

    const makeListOfSeats = (seats) => {
        let list = []
        for(let i=0; i<seats.length; i+=1) {
            list.push(<option>{seats[i].row + seats[i].column}</option>)
        }
        return list
    }

    const fetchAndSetSeats = () => {
        fetch("http://127.0.0.1:5000/seats?show_id=" + selectedShow)
        .then(res => res.json())
        // .then(console.log)
        .then(res => res.data)
        .then(seats => setListOfSeats(makeListOfSeats(seats)))
    }

    const handleOnChange = (event) => {
        console.log(event, event.value)
        setSelectedSeat(event.value)
    }

    useEffect(fetchAndSetSeats, [])

    return <div>
        <h2>Select seat</h2>
        <select onChange={handleOnChange}>{listOfSeats}</select>
    </div>
}

export default SeatsList