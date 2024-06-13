import './App.css';
import './tab.css'

import Switch from './components/switch';
import TheatresList from './components/theatreslist';
import MoviesList from './components/movieslist';

import DateSelector from './components/dateselector';
import ShowsList from './components/showslist';

import SeatsList from './components/seatslist';

import TicketsList from './components/ticketslist';

import * as Tabs from '@radix-ui/react-tabs';

import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'

function App() {

	const getTodaysDate = () => {
		let date = new Date()
		return date.toLocaleDateString()
	}

	const [isLogin, setIsLogin] = useState(true) // boolen to display signup or login

	const [username, setUsername] = useState()
	const [password, setPassword] = useState()

	const [jwt, setJwt] = useState()

	const [showTheatres, setShowTheatres] = useState(true) // boolen to display list of theatres / movies
	const [selectedTheatre, setSelectedTheatre] = useState() // holds the selected theatre id
	const [selectedMovie, setSelectedMovie] = useState() // holds the selected movie id

	const [selectedDate, setSelectedDate] = useState(getTodaysDate()) // date for which shows have to be displayed
	const [selectedShow, setSelectedShow] = useState() // holds the selected show id

	const [selectedSeat, setSelectedSeat] = useState() // holds the selected seat id

  // on show select
  // setTimeout(redirectToShowsList, 2*3600)

	const navigate = useNavigate()

	const signupUser = (e) => {
		e.preventDefault();
		fetch("http://127.0.0.1:5000/users", {
			method: "PUT",
			body: JSON.stringify({
				"username": username,
				"password": password,
			}),
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			}
		})
		.then(res => res.json())
		.then(console.log)
	}	

	const loginUser = (e) => {
		e.preventDefault();
		fetch("http://127.0.0.1:5000/auth", {
			method: "POST",
			body: JSON.stringify({
				"username": username,
				"password": password,
			}),
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			}
		})
		// .then(console.log)
		.then(res => res.json())
		.then(res => setJwt(res.data))
		.then(() => navigate('/browse'))
	}

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
					<div className='user-form'>
						<Tabs.Root
							className="TabsRoot"
							defaultValue="true"
							onValueChange={(value) => setIsLogin(value === "true")}
						>
							<Tabs.List className="TabsList">
								<Tabs.Trigger className="TabsTrigger" value="true">Login</Tabs.Trigger>
								<Tabs.Trigger className="TabsTrigger" value="false">Sign Up</Tabs.Trigger>
							</Tabs.List>
						</Tabs.Root>
						<form>
							<input placeholder='username' onChange={event => setUsername(event.target.value)}></input>
							<input placeholder='password' onChange={event => setPassword(event.target.value)}></input>
							{isLogin ? <button onClick={loginUser}>login</button> : <button onClick={signupUser}>sign up</button>}
						</form>
					</div>
				</div>}
			/>
			<Route path='/browse' element={
				<div className='phase one'>
					<Switch setShowTheatres={setShowTheatres}/>
					{showTheatres ? <TheatresList token={jwt} setSelectedTheatre={setSelectedTheatre}/> : <MoviesList setSelectedMovie={setSelectedMovie} />}
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
					<h3>Hi, Avinash</h3>
					<TicketsList selectedShow={selectedShow} />
				</div>}
			/>
		</Routes>
    </div>
  	);
}

export default App;
