import * as Tabs from '@radix-ui/react-tabs';

const Switch = ({ setShowTheatres }) => {

    return <div>
        <h2>Browse by</h2>
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