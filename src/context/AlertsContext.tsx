'use client';

import React, { createContext, useState, ReactNode, useContext } from 'react';

type AlertType = {
    message: string;
    type: 'success' | 'error';
};

type AlertContextType = {
    alert: AlertType | null;
    showAlert: (message: string, type: 'success' | 'error') => void;
    hideAlert: () => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
    const [alert, setAlert] = useState<AlertType | null>(null);

    const showAlert = (message: string, type: 'success' | 'error') => {
        setAlert({ message, type });
        setTimeout(() => {
            hideAlert();
        }, 3000);
    };

    const hideAlert = () => {
        setAlert(null);
    };

    return (
        <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
            {children}
            {alert && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50">
                    {alert.type === 'success' && <SuccessAlert text={alert.message} />}
                    {alert.type === 'error' && <ErrorAlert text={alert.message} />}
                </div>
            )}
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};

// Success Alert Component
const SuccessAlert: React.FC<{ text: string }> = ({ text }) => (
    <div style={{ background: '#03C03C' }} className="flex gap-3 items-center p-4 text-sm text-white bg-green-600 border border-green-700 rounded-lg" role="alert">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="green"
        >
            <circle cx="12" cy="12" r="10" stroke="green" stroke-width="2" fill="none" />
            <path
                d="M7 12l3 3 6-6"
                stroke="green"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>

        <span className="sr-only">Success</span>
        <div>{text}</div>
    </div>
);



// Error Alert Component
const ErrorAlert: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex gap-3 items-center p-4 text-sm text-white bg-red-600 border border-red-700 rounded-lg" role="alert">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="white"
        >
            <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2" fill="none" />
            <path
                d="M8 8l8 8M16 8l-8 8"
                stroke="white"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>

        <span className="sr-only">Error</span>
        <div>{text}</div>
    </div>
);