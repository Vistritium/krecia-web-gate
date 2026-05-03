import React, {useEffect, useState} from 'react';
import './App.css';
import {KreciaDevices} from "./dto/krecia_devices";
import Devices from "./Device";
import 'bootstrap/dist/css/bootstrap.css';

function App() {

    const [networkData, setJsonData] = useState<KreciaDevices | undefined>(undefined);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/krecia_devices.json'); // Path to your JSON file
                const data: KreciaDevices = await response.json();
                setJsonData(data);
            } catch (error) {
                console.error('Error fetching JSON:', error);
            }
        };

        fetchData()
    }, [])

    return (
        <div className="App">
            {networkData ? (
                <Devices data={networkData} />
            ) : (
                <div></div>
            )}
        </div>
    );
}

export default App;
