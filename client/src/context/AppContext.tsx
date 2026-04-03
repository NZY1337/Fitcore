import { createContext, useState, useContext, useEffect } from 'react'
import type React from 'react'
import type { Session, Provider } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'

type AppContextType = {
    session: Session | null
    sessionLoaded: boolean
    logout: () => Promise<void>
    login: (provider: Provider) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null)
    const [sessionLoaded, setSessionLoaded] = useState(false);

    console.log('AppContext session:', session?.access_token)

    const login = async (provider: Provider) => {
        const options: Record<string, Record<string, string>> = {
            google: { prompt: 'select_account' },
        }

        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
                queryParams: options[provider] ?? {},
            },
        })
    }

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setSessionLoaded(true)
        })

        return () => {
            listener.subscription.unsubscribe()
        }
    }, [])

    const logout = async () => {
        await supabase.auth.signOut()
    }

    return (
        <AppContext.Provider value={{ session, sessionLoaded, logout, login }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    const context = useContext(AppContext)
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider')
    }
    return context
}
