const DateSelector = () => {
    let options = []
    for(let i=0; i<4; i+=1) {
        let newDate = new Date();
        newDate.setDate(newDate.getDate() + i);
        const date_after_i_days = newDate.toLocaleDateString();
        options.push(<option value={i}>{date_after_i_days}</option>);
    }
    return <div>
        <h3>Select Date</h3>
        <select name="dates" id="dates">{options}</select>
    </div>
}

export default DateSelector