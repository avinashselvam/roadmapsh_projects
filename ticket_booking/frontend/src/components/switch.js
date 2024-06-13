import * as Tabs from '@radix-ui/react-tabs';

const Switch = ({ setShowTheatres }) => {

    const handleOnChange = (event) => {
        // console.log(event.target.value, typeof(event.target.value), (event.target.value))
        setShowTheatres(event.target.value === "true")
    } 

    return <div>
        <h2>Select by</h2>
        {/* <select onChange={handleOnChange}>
            <option value="true">Theatres</option>
            <option value="false">Movies</option>
        </select> */}
        <Tabs.Root
            className="TabsRoot"
            defaultValue="true"
            onValueChange={(value) => setShowTheatres(value === "true")}
        >
            <Tabs.List className="TabsList">
            <Tabs.Trigger className="TabsTrigger" value="true">
                Theatres
            </Tabs.Trigger>
            <Tabs.Trigger className="TabsTrigger" value="false">
                Movies
            </Tabs.Trigger>
            </Tabs.List>
        </Tabs.Root>
    </div>
}

export default Switch