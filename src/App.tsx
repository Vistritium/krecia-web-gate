import React, {useEffect, useState} from 'react';
import './App.css';
import AlarmsPage from './AlarmsPage';
import {KreciaDevices} from "./dto/krecia_devices";
import Devices from "./Device";
import 'bootstrap/dist/css/bootstrap.css';

type MainPageTab = 'devices' | 'alarms';

function App() {
    const pathname = window.location.pathname.replace(/\/+$/, '');

    if (pathname === '/alarms') {
        return <AlarmsPage/>;
    }

    return <MainPage/>;
}

function MainPage() {
    const [selectedPage, setSelectedPage] = useState<MainPageTab>(() => getMainPageTabFromHash());

    useEffect(() => {
        const handleHashChange = () => setSelectedPage(getMainPageTabFromHash());

        window.addEventListener('hashchange', handleHashChange);

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const navigateToPage = (page: MainPageTab) => {
        setSelectedPage(page);
        window.location.hash = page;
    };

    return (
        <div className="App app-shell">
            <nav className="app-navigation" aria-label="Główna nawigacja">
                <button
                    type="button"
                    className={selectedPage === 'devices' ? 'active' : ''}
                    onClick={() => navigateToPage('devices')}
                >
                    Krecia devices
                </button>
                <button
                    type="button"
                    className={selectedPage === 'alarms' ? 'active' : ''}
                    onClick={() => navigateToPage('alarms')}
                >
                    Alarms
                </button>
            </nav>

            <div className="app-page">
                {selectedPage === 'devices' ? <DevicesPage/> : <AlarmsPage/>}
            </div>
        </div>
    );
}

function getMainPageTabFromHash(): MainPageTab {
    const hash = window.location.hash.replace(/^#\/?/, '');

    return hash === 'alarms' ? 'alarms' : 'devices';
}

function DevicesPage() {

    const [networkData, setJsonData] = useState<KreciaDevices | undefined>(undefined);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://krecia.maciejnowicki.com/static/krecia_devices.json');
                const data: KreciaDevices = await response.json();
                setJsonData(data);
            } catch (error) {
                console.error('Error fetching JSON:', error);
            }
        };

        fetchData()
    }, [])

    return (
        <div className="devices-page">
            {networkData ? (
                <Devices data={networkData} />
            ) : (
                <div></div>
            )}
        </div>
    );
}

export default App;
