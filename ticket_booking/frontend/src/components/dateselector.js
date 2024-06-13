const DateSelector = ({ setSelectedDate }) => {

    const handleOnChange = (event) => {
        setSelectedDate(event.target.value)
    }

    let options = []
    for(let i=0; i<4; i+=1) {
        let newDate = new Date();
        newDate.setDate(newDate.getDate() + i);
        const date_after_i_days = newDate.toLocaleDateString();
        options.push(<option value={date_after_i_days}>{date_after_i_days}</option>);
    }

    return <div>
        <h3>Select Date</h3>
        <select onChange={handleOnChange}>{options}</select>
    </div>
}

export default DateSelector