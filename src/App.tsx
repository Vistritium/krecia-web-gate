import React, {useEffect, useState} from 'react';
import AlarmsPage from './AlarmsPage';
import {KreciaDevices} from "./dto/krecia_devices";
import Devices from "./Device";
import {HashRouter, Navigate, NavLink, Route, Routes} from 'react-router-dom';

function App() {
    const pathname = window.location.pathname.replace(/\/+$/, '');

    if (pathname === '/alarms') {
        return <AlarmsPage/>;
    }

    return (
        <HashRouter>
            <MainPage/>
        </HashRouter>
    );
}

function MainPage() {
    return (
        <div className="min-h-screen bg-base-200 text-base-content">
            <nav className="sticky top-0 z-10 flex justify-center gap-2 border-b border-base-300 bg-base-100 px-4 py-3 shadow-sm" aria-label="Główna nawigacja">
                <NavLink
                    to="/devices"
                    className={({isActive}) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}
                >
                    Krecia devices
                </NavLink>
                <NavLink
                    to="/alarms"
                    className={({isActive}) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}
                >
                    Alarms
                </NavLink>
            </nav>

            <div className="min-h-[calc(100vh-57px)]">
                <Routes>
                    <Route index element={<Navigate to="/devices" replace/>}/>
                    <Route path="devices" element={<DevicesPage/>}/>
                    <Route path="alarms" element={<AlarmsPage/>}/>
                    <Route path="*" element={<Navigate to="/devices" replace/>}/>
                </Routes>
            </div>
        </div>
    );
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
        <div className="min-h-[calc(100vh-57px)]">
            {networkData ? (
                <Devices data={networkData} />
            ) : (
                <div></div>
            )}
        </div>
    );
}

export default App;
