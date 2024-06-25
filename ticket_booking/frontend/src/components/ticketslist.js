import { useState, useEffect } from "react"

import './ticketslist.css'

const TicketsList = ({ userId }) => {

    const [listOfTickets, setListOfTickets] = useState([])

    const makeListOfTickets = (tickets) => {
        let list = []
        for(let i=0; i<tickets.length; i+=1) {
            console.log(tickets[i])

            list.push(
                <div className="ticket-card">
                    <h1 className="seat">{tickets[i].Seat.row + tickets[i].Seat.column}</h1>
                    <p className="theatre-name">{tickets[i].Theatre.name}</p>
                    <p className="movie-name">{tickets[i].Movie.name}</p>
                </div>
            )
        }
        return list
    }

    const fetchAndSetTickets = () => {
        fetch("http://127.0.0.1:5000/tickets?user_id=1") // + userId)
        .then(res => res.json())
        // .then(console.log)
        .then(res => res.data)
        .then(tickets => setListOfTickets(makeListOfTickets(tickets)))
    }

    // on component mount fetch and set the data
    useEffect(fetchAndSetTickets, [])

    return <div>
        <h1>Your Tickets</h1>
        {listOfTickets}
    </div>

}

export default TicketsList