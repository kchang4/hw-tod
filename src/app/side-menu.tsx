"use client"

import { Alert, Box, Divider, List, Snackbar } from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"
import { useState } from "react"
import { Nations, TodRaw } from "./types"
import { useSession } from "next-auth/react"
import { useTimeSettings } from "./contexts/time-settings.context"
import SideMenuItem from "./components/side-menu-item"

export default function SideMenu() {
    const { data: session } = useSession()
    const { timeFormat } = useTimeSettings()

    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [notificationMessage, setNotificationMessage] = useState('')

    const TIME_FORMAT = timeFormat === "24" ? "YYYY/MM/DD HH:mm:ss" : "YYYY/MM/DD hh:mm:ss A"

    const saveTod = async (nation: Nations, tod: number) => {
        setNotificationMessage("")
        setError(null)

        if (!session) {
            const errorMessage = 'You must be logged in to submit a TOD!'
            setNotificationMessage(errorMessage)
            setError(new Error(errorMessage))
            return
        }

        const timestamp = dayjs(tod);
        timestamp.startOf("second")

        try {
            setSaving(true)
            const response = await fetch("/api/tod", { method: "POST", body: JSON.stringify({ timestamp: timestamp.valueOf(), nation }) })
            if (!response.ok) {
                const message = await response.text()
                throw new Error(message)
            }
            const createdTod = await response.json() as TodRaw
            setNotificationMessage(`${dayjs(createdTod.tod_timestamp).format(TIME_FORMAT)} submitted for ${nation}!`)
        } catch (err) {
            if (err instanceof Error) {
                setError(err)
                setNotificationMessage(err.message)
            }
        } finally {
            setSaving(false)
        }
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ width: 380, borderRight: 1, borderColor: 'divider' }}>
                <List>
                    <SideMenuItem disabled={saving || !session} nation={Nations.Bastok} onSave={saveTod} />
                    <Divider component="li" variant="middle" />
                    <SideMenuItem disabled={saving || !session} nation={Nations.Kazham} onSave={saveTod} />
                    <Divider component="li" variant="middle" />
                    <SideMenuItem disabled={saving || !session} nation={Nations.Sandoria} onSave={saveTod} />
                    <Divider component="li" variant="middle" />
                    <SideMenuItem disabled={saving || !session} nation={Nations.Windurst} onSave={saveTod} />
                </List>
                {!session &&
                    <Box sx={(theme) => ({ paddingLeft: theme.spacing(2), paddingRight: theme.spacing(2) })}>
                        <Alert severity="warning">You must be logged in to submit TODs</Alert>
                    </Box>
                }

            </Box >
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={!!notificationMessage.length}
                autoHideDuration={3000}
                onClose={() => setNotificationMessage('')}
            >
                <Alert severity={error ? "error" : "success"}>{notificationMessage}</Alert>
            </Snackbar>
        </LocalizationProvider >
    )
}