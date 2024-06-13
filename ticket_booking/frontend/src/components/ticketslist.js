import { useState, useEffect } from "react"

const TicketsList = ({ selectedShow, selectedSeat, userId }) => {

    const [listOfTickets, setListOfTickets] = useState([])

    const makeListOfTickets = (tickets) => {
        let list = []
        for(let i=0; i<tickets.length; i+=1) {
            list.push(
                <div className="ticket-card">
                    {/* <p>theatre {tickets[i].theatre_id}</p> */}
                    <p>show {tickets[i].show_id}</p>
                    <p>seat {tickets[i].seat_id}</p>
                </div>
            )
        }
        return list
    }

    const fetchAndSetTickets = () => {
        fetch("http://127.0.0.1:5000/tickets?user_id=0") // + userId)
        .then(res => res.json())
        .then(res => res.data)
        .then(tickets => setListOfTickets(makeListOfTickets(tickets)))
    }

    // on component mount fetch and set the data
    useEffect(fetchAndSetTickets, [])

    return <div>
        <h3>Your Tickets</h3>
        {listOfTickets}
    </div>

}

export default TicketsList