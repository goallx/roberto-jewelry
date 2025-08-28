'use client';
import AppLoader from '@/components/loader/AppLoader';
import { createContext, useContext, useState } from 'react';

const LoaderContext = createContext<{
    isLoading: boolean;
    setLoading: (state: boolean) => void;
}>({
    isLoading: false,
    setLoading: () => { },
});

export const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setLoading] = useState(false);

    return (
        <LoaderContext.Provider value={{ isLoading, setLoading }}>
            {isLoading && <AppLoader />}
            {children}
        </LoaderContext.Provider>
    );
};

export const useLoader = () => useContext(LoaderContext);
