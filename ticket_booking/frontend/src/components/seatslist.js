const SeatsList = ({ setSelectedSeat }) => {

    const handleOnChange = (event) => {
        setSelectedSeat(event.value)
    } 

    return <div>
        <h2>Select seat</h2>
        <select onChange={handleOnChange}>
            <option>A1</option>
            <option>A2</option>
            <option>B1</option>
            <option>B2</option>
            <option>C1</option>
            <option>C2</option>
        </select>
    </div>
}

export default SeatsList