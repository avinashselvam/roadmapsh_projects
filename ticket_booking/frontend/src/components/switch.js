const Switch = ({ setShowTheatres }) => {

    const handleOnChange = (event) => {
        // console.log(event.target.value, typeof(event.target.value), (event.target.value))
        setShowTheatres(event.target.value === "true")
    } 

    return <div>
        <h2>Select by</h2>
        <select onChange={handleOnChange}>
            <option value="true">Theatres</option>
            <option value="false">Movies</option>
        </select>
    </div>
}

export default Switch