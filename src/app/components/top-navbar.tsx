"use client"

import { AppBar, Box, FormControlLabel, Switch, Toolbar } from "@mui/material"
import { useEffect, useState } from "react"
import { useTimeSettings } from "../contexts/time-settings.context"

export default function TopNavBar() {
    const { timeFormat, changeTimeFormat } = useTimeSettings()

    const [clockFormat, setClockFormat] = useState(timeFormat)

    const handleClockFormatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.checked ? "24" : "12"
        changeTimeFormat(value)
    }

    useEffect(() => {
        setClockFormat(timeFormat)
    }, [timeFormat])

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <FormControlLabel control={<Switch color="secondary" checked={clockFormat === "24"} onChange={handleClockFormatChange} />} label={`${clockFormat} Hour Format`} />
                    <Box flexGrow={1}></Box>
                </Toolbar>
            </AppBar>
        </Box>
    )
}