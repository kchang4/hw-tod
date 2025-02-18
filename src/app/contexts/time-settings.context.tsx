"use client"

import { createContext, ReactNode, useContext, useState } from "react"

const TimeSettingsContext = createContext<{ timeFormat: string, changeTimeFormat: (value: "24" | "12") => void } | undefined>(undefined)

const TimeSettingsProvider = ({ children }: { children: ReactNode }) => {
    const [timeFormat, setTimeFormat] = useState(localStorage.getItem("time_format") || "24")

    const changeTimeFormat = (value: "12" | "24") => {
        localStorage.setItem("time_format", value)
        setTimeFormat(value)
    }

    return (
        <TimeSettingsContext.Provider value={{ timeFormat, changeTimeFormat }}>
            {children}
        </TimeSettingsContext.Provider>
    )
}

const useTimeSettings = () => {
    const context = useContext(TimeSettingsContext)
    if (!context) {
        throw new Error("useTimeSettings must be used within a TimeSettingsProvider")
    }
    return context
}

export { TimeSettingsProvider, useTimeSettings }