import * as Tabs from '@radix-ui/react-tabs';

const DateSelector = ({ setSelectedDate }) => {

    const handleOnChange = (event) => {
        setSelectedDate(event.target.value)
    }

    let options = []
    for(let i=0; i<4; i+=1) {
        let newDate = new Date();
        newDate.setDate(newDate.getDate() + i);
        const date_after_i_days = newDate.toLocaleDateString();
        options.push(<Tabs.Trigger className="TabsTrigger" value={date_after_i_days}>{date_after_i_days}</Tabs.Trigger>);
    }

    return <div>
        <h3>Select Date</h3>
        <Tabs.Root
            className="TabsRoot"
            defaultValue={(new Date()).toLocaleDateString()}
            onValueChange={(value) => setSelectedDate(value)}
        >
            <Tabs.List className="TabsList">
                {options}
            </Tabs.List>
        </Tabs.Root>
    </div>
}

export default DateSelector