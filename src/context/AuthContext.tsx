'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { ILoginUser } from '@/components/auth/SigninForm'
import { INewUser } from '@/components/auth/SignupForm'
import { IProfile } from '@/stores/ProfileStore'
import { useRouter } from 'next/navigation'
import { useLoader } from './AppLoaderContext'
import { rootStore } from '@/stores/RootStore'


interface AuthContextType {
    isAuthenticated: boolean
    login: (formData: ILoginUser, onError: (err: string, isVerified: boolean) => void) => Promise<void>
    signup: (FormData: INewUser) => Promise<string>
    logout: () => Promise<void>
    showModal: boolean
    setShowModal: (status: boolean) => void
    setShowSignin: (status: boolean) => void
    showSignin: boolean
    user: Partial<IProfile> | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [showSignin, setShowSignin] = useState<boolean>(true)
    const [user, setUser] = useState<Partial<IProfile> | null>(null)
    const router = useRouter()
    const { setLoading } = useLoader()


    useEffect(() => {
        checkAuthStatus()
    }, [])

    useEffect(() => {
        if (isAuthenticated) {
            rootStore.initStores()
        }
    }, [isAuthenticated])

    useEffect(() => {
        if (isAuthenticated && rootStore.productStore)
            rootStore.profileStore?.fetchProfile()
    }, [rootStore.profileStore, isAuthenticated])

    const login = async (formData: ILoginUser, onError?: (err: string, isVerified: boolean) => void) => {
        try {
            const response = await fetch('/api/user/login', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                rootStore.initStores()
                checkAuthStatus()
                setShowModal(false)
            } else {
                const errorData = await response.json();
                onError && onError(errorData.message, errorData.isVerified)
                setIsAuthenticated(false)
            }
        } catch (err: any) {
            console.log('err', err.message || err)
            onError && onError("Something went wrong, please try again!", true)
        }
    }

    const signup = async (formData: INewUser): Promise<string> => {
        const response = await fetch('/api/user/signup', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            return ""
        } else {
            const errorData = await response.json();
            return errorData.message ?? "Invalid inputs!"
        }
    }

    const checkAuthStatus = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/user/verify', {
                method: "GET",
                credentials: 'include',
            });
            const data = await response.json()
            if (data.authenticated) {
                setUser(data.user)
                setIsAuthenticated(true)
                if (rootStore.profileStore)
                    await rootStore.profileStore?.fetchProfile()
            } else {
                setUser(null)
                setIsAuthenticated(false)
                router.push('/')
            }
        } catch (err: any) {
            console.log("@@error in checkAuthStatus", err.message || err)
        } finally {
            setTimeout(() => setLoading(false), 2000)
        }
    };

    const logout = async () => {
        try {
            const response = await fetch(`/api/user/logout`, {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                setIsAuthenticated(false)
                setUser(null)
            } else {
                console.error("Failed to log out");
            }
        } catch (error) {
            console.error("Error logging out:", error);
        }
    }


    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout, showModal, setShowModal, showSignin, setShowSignin }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
