import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import './seatslist.css'

const SeatsList = ({ selectedShow, setSelectedSeat }) => {

    const navigate = useNavigate()

    const [listOfSeats, setListOfSeats] = useState([])
    const [timeleft, setTimeleft] = useState(2*60*1000)

    const makeArrangement = (seats) => {
        let rows = []
        let row = []
        const columns = "ABCDEFGHIJK"
        const numRows = 20
        let seatsIndex = 0
        for (let j=0; j<columns.length; j+=1) {
            for(let i=1; i<numRows+1; i+=1) {
                const booked = !((seats[seatsIndex].row === columns[j]) && (seats[seatsIndex].column === String(i)))
                if (!booked) { seatsIndex += 1 }
                row.push(<input type="checkbox" disabled={booked} value={booked ? null : seats[seatsIndex].id} onChange={handleOnChange}></input>)
            }
            rows.push(<div className="seats-row"><p>{columns[j]}</p> {row}</div>)
            row = []
        }
        return rows
    }

    const fetchAndSetSeats = () => {
        fetch("http://127.0.0.1:5000/seats?show_id=" + selectedShow)
        .then(res => res.json())
        .then(res => res.data)
        .then(seats => setListOfSeats(makeArrangement(seats)))
    }

    // TODO currently latest selection is used to book
    // either book all selections or prevent multiple booking
    const handleOnChange = (event) => {
        if (event.target.checked) { setSelectedSeat(event.target.value) }
        else { setSelectedSeat(null) }
    }

    const startTimer = () => {
        setTimeout(() => navigate("/browse"), 2*60*1000)
        const intervalId = setInterval(() => {
            setTimeleft(prevTimeleft => prevTimeleft - 1000)
        }, 1000)
        return () => clearInterval(intervalId)
    }

    useEffect(fetchAndSetSeats, [])
    useEffect(startTimer, [])

    return <div>
        <p>Finish booking in {new Date(timeleft).getUTCMinutes()}:{new Date(timeleft).getUTCSeconds()}</p>
        <h2>Select seat</h2>
        <div>
            {listOfSeats}
        </div>
    </div>
}

export default SeatsList