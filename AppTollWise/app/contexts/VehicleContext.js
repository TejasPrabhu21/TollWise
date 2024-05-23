// VehicleContext.js
import React, { createContext, useState, useContext } from 'react';

const VehicleContext = createContext();

export const useVehicleContext = () => useContext(VehicleContext);

export const VehicleProvider = ({ children }) => {
    const [vehicleData, setVehicleData] = useState(null);
    const [userData, setUserData] = useState(null);

    const setVehicle = (data) => {
        setVehicleData(data);
    };
    const setUser = (data) => {
        console.log('User data saved:', data)
        setUserData(data);
    };

    return (
        <VehicleContext.Provider value={{ vehicleData, setVehicle, userData, setUser }}>
            {children}
        </VehicleContext.Provider>
    );
};
