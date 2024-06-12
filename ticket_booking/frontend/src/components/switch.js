const Switch = ({ setShowTheatres }) => {

    const handleOnChange = (event) => {
        setShowTheatres(event.value)
    } 

    return <div>
        <h2>Select by</h2>
        <select onChange={handleOnChange}>
            <option value={true} selected>Theatres</option>
            <option value={false}>Movies</option>
        </select>
    </div>
}

export default Switch