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

	const [rzp, setRzp] = useState()

	const getTodaysDate = () => {
		let date = new Date()
		return date.toLocaleDateString()
	}

	const [isLogin, setIsLogin] = useState(true) // boolen to display signup or login

	const [username, setUsername] = useState("avi")
	const [password, setPassword] = useState("avi")

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
		console.log(username, password)
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

		// navigate('/browse')
	}

	const options = {
		"key": "rzp_test_Yfy5mCLmWNC6v7",
		"amount": "50000",
		"currency": "INR",
		"name": "Avinash's Ticket Booking System",
		"description": "Movie ticket purchase",
		"image": "https://avatars.githubusercontent.com/u/19776433?s=96&v=4",
		"order_id": "order_OMXhKRFmqRi07h",
		"callback_url": "http://localhost:3000/profile",
		"prefill": {
			"name": username,
		},
		"theme": {
			"color": "#3399cc"
		}
	}

	useEffect(() => {
		const script = document.createElement("script")
		script.src = "https://checkout.razorpay.com/v1/checkout.js"
		document.body.appendChild(script)
		script.onload = () => {
		setRzp(window.Razorpay(options))
		console.log(rzp)
	}}, [])

// curl -X POST https://api.razorpay.com/v1/orders \
// -u 'rzp_test_Yfy5mCLmWNC6v7:T3DGXyX4zUmkfb4xDzx0IrBt' \
// -H 'content-type:application/json' \
// -d '{
//     "amount": 500,
//     "currency": "INR",
//     "receipt": "qwsaq1",
//     "partial_payment": true,
//     "first_payment_min_amount": 230
// }'

	const bookTickets = () => {
		rzp.open()
		// fetch("http://127.0.0.1:5000/tickets", {
		// 	method: "PUT",
		// 	body: JSON.stringify({
		// 		"show_id": selectedShow,
		// 		"seat_id": selectedSeat,
		// 		"user_id": 0
		// 	}),
		// 	headers: {
		// 		"Content-type": "application/json; charset=UTF-8"
		// 	}
		// })
		// .then(res => res.json())
		// .then(console.log)
		// .then(() => navigate('/profile'))
	}

  	return (
    <div className="App">
		<Routes>
			<Route path='/' element={
				<div className='home'>
					<div className='landing'>
					<h1>Book Tickets</h1>
					<h2>for the latest movies</h2>
					<h2>running in theatres near you</h2>
					</div>
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
