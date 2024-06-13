import './App.css';
import './tab.css'

import Switch from './components/switch';
import TheatresList from './components/theatreslist';
import MoviesList from './components/movieslist';

import DateSelector from './components/dateselector';
import ShowsList from './components/showslist';

import SeatsList from './components/seatslist';

import TicketsList from './components/ticketslist';

import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'

function App() {

	const getTodaysDate = () => {
		let date = new Date()
		return date.toLocaleDateString()
	}

  const [showTheatres, setShowTheatres] = useState(true) // boolen to display list of theatres / movies
  const [selectedTheatre, setSelectedTheatre] = useState() // holds the selected theatre id
  const [selectedMovie, setSelectedMovie] = useState() // holds the selected movie id

  const [selectedDate, setSelectedDate] = useState(getTodaysDate()) // date for which shows have to be displayed
  const [selectedShow, setSelectedShow] = useState() // holds the selected show id

  const [selectedSeat, setSelectedSeat] = useState() // holds the selected seat id

  // on show select
  // setTimeout(redirectToShowsList, 2*3600)

	const navigate = useNavigate()

  const bookTickets = () => {
    fetch("http://127.0.0.1:5000/tickets", {
			method: "PUT",
			body: JSON.stringify({
					"show_id": selectedShow,
					"seat_id": selectedSeat,
					"user_id": 0
			}),
			headers: {
					"Content-type": "application/json; charset=UTF-8"
			}
		})
		.then(res => res.json())
		.then(console.log)
		.then(() => navigate('/browse'))
  }

  return (
    <div className="App">
			<Routes>
				<Route path='/' element={
					<div>
						<h1>Book Tickets</h1>

						<form>
								<input placeholder='username'></input>
								<input placeholder='password'></input>
								<button onClick={() => navigate('/browse')}>login</button>
						</form>

						<form>
								<input placeholder='username'></input>
								<input placeholder='password'></input>
								<button>sign up</button>
						</form>
					</div>}
				/>
				<Route path='/browse' element={
					<div className='phase one'>
						<Switch setShowTheatres={setShowTheatres}/>
						{showTheatres ? <TheatresList setSelectedTheatre={setSelectedTheatre}/> : <MoviesList setSelectedMovie={setSelectedMovie} />}
					</div>}
				/>
				<Route path='shows' element={
					<div className='phase two'>
						<DateSelector setSelectedDate={setSelectedDate}/>
						<ShowsList
							selectedDate={selectedDate}
							selectedTheatre={selectedTheatre}
							selectedMovie={selectedMovie}
							setSelectedShow={setSelectedShow}
						/>
					</div>}
				/>
				<Route path='seats' element={
					<div className='phase three'>
						<p>finish booking in 2 mins</p>
						<SeatsList selectedShow={selectedShow} setSelectedSeat={setSelectedSeat}/>
						<button onClick={bookTickets}>Book Seats</button>
					</div>}
				/>
				<Route path='profile' element={
					<div className='phase'>
						<h1>Avinash</h1>
						<TicketsList selectedShow={selectedShow} />
					</div>}
				/>
			</Routes>
    </div>
  );

}

export default App;
