import './App.css';

import Switch from './components/switch';
import TheatresList from './components/theatreslist';
import MoviesList from './components/movieslist';

import DateSelector from './components/dateselector';
import ShowsList from './components/showslist';

import SeatsList from './components/seatslist';

import { useState, useEffect } from 'react';

function App() {

  const [showTheatres, setShowTheatres] = useState(true) // boolen to display list of theatres / movies
  const [selectedTheatre, setSelectedTheatre] = useState() // holds the selected theatre id
  const [selectedMovie, setSelectedMovie] = useState() // holds the selected movie id

  const [selectedDate, setSelectedDate] = useState() // date for which shows have to be displayed
  const [selectedShow, setSelectedShow] = useState() // holds the selected show id

  const [selectedSeat, setSelectedSeat] = useState() // holds the selected seat id

  // on show select
  // setTimeout(redirectToShowsList, 2*3600)

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
  }

  return (
    <div className="App">
      <div className='phase one'>
        <Switch setShowTheatres={setShowTheatres}/>
        {showTheatres ? <TheatresList setSelectedTheatre={setSelectedTheatre}/> : <MoviesList setSelectedMovie={setSelectedMovie}/>}
      </div>
      <div className='phase two'>
        <DateSelector setSelectedDate={setSelectedDate}/>
        <ShowsList
          selectedDate={selectedDate}
          selectedTheatre={selectedTheatre}
          selectedMovie={selectedMovie}
          setSelectedShow={setSelectedShow}
        />
      </div>
      <div className='phase three'>
        <p>finish booking in 2 mins</p>
        <SeatsList selectedShow={selectedShow} setSelectedSeat={setSelectedSeat}/>
        <button onClick={bookTickets}>Book Seats</button>
      </div>
    </div>
  );

}

export default App;
