'use client'

import { Box, Button, Divider, List, ListItem, ListItemIcon, ListSubheader } from "@mui/material"
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { createTod } from "./actions"
import { Nations } from "./types"

export default function SideMenu() {
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const [currentTime, setCurrentTime] = useState(dayjs())

    const updateCurrentTime = (value: dayjs.Dayjs | null) => {
        if (value) {
            clearTimer()
            setCurrentTime(value)
        }
    }

    const updateTimer = () => {
        timerRef.current = setInterval(() => {
            setCurrentTime(dayjs())
        }, 50)
    }

    const clearTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current)
        }
    }

    const saveTod = async (nation: Nations) => {
        const newTod = await createTod(currentTime, nation)
        console.log(newTod)
    }

    useEffect(() => {
        updateTimer()

        return () => clearTimer()
    }, [])

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ width: 420, borderRight: '1px solid rgba(0, 0, 0, .1)', boxShadow: '0 0 5px 0 rgba(0, 0, 0, .3)' }}>
                <List subheader={<ListSubheader>Submit Highwind TODs Here</ListSubheader>}>
                    <ListItem
                        sx={{ backgroundImage: 'linear-gradient(to right, rgba(0, 0, 255, .1), white)' }}
                        secondaryAction={<Button variant="contained" color="primary" onClick={() => saveTod(Nations.Bastok)}>Submit</Button>}
                    >
                        <ListItemIcon><Image src="/bastok.webp" width={30} height={30} alt="Bastok" /></ListItemIcon>
                        <DateTimePicker slotProps={{ textField: { onFocus: () => clearTimer() } }} onChange={updateCurrentTime} ampm={false} sx={{ width: 220 }} label="Bastok Highwind TOD" value={currentTime} views={["year", "month", "day", "hours", "minutes", "seconds"]} />
                    </ListItem>
                    <Divider component="li" variant="middle" />
                    <ListItem
                        sx={{ backgroundImage: 'linear-gradient(to right, rgba(128, 0, 128, .1), white)' }}
                        secondaryAction={<Button variant="contained" color="primary" onClick={() => saveTod(Nations.Kazham)}>Submit</Button>}
                    >
                        <ListItemIcon><Image src="/kazham.webp" width={30} height={30} alt="Kazham" /></ListItemIcon>
                        <DateTimePicker slotProps={{ textField: { onFocus: () => clearTimer() } }} onChange={updateCurrentTime} ampm={false} sx={{ width: 220 }} label="Kazham Highwind TOD" value={currentTime} views={["year", "month", "day", "hours", "minutes", "seconds"]} />
                    </ListItem>
                    <Divider component="li" variant="middle" />
                    <ListItem
                        sx={{ backgroundImage: 'linear-gradient(to right, rgba(255, 0, 0, .1), white)' }}
                        secondaryAction={<Button variant="contained" color="primary" onClick={() => saveTod(Nations.Sandoria)}>Submit</Button>}
                    >
                        <ListItemIcon><Image src="/sandoria.webp" width={30} height={30} alt="San d'Oria" /></ListItemIcon>
                        <DateTimePicker slotProps={{ textField: { onFocus: () => clearTimer() } }} onChange={updateCurrentTime} ampm={false} sx={{ width: 220 }} label="San d'Oria Highwind TOD" value={currentTime} views={["year", "month", "day", "hours", "minutes", "seconds"]} />
                    </ListItem>
                    <Divider component="li" variant="middle" />
                    <ListItem
                        sx={{ backgroundImage: 'linear-gradient(to right, rgba(0, 255, 0, .1), white)' }}
                        secondaryAction={<Button variant="contained" color="primary" onClick={() => saveTod(Nations.Windurst)}>Submit</Button>}
                    >
                        <ListItemIcon><Image src="/windurst.webp" width={30} height={30} alt="Windurst" /></ListItemIcon>
                        <DateTimePicker slotProps={{ textField: { onFocus: () => clearTimer() } }} onChange={updateCurrentTime} ampm={false} sx={{ width: 220 }} label="Windurst Highwind TOD" value={currentTime} views={["year", "month", "day", "hours", "minutes", "seconds"]} />
                    </ListItem>
                </List>
            </Box >
        </LocalizationProvider >
    )
}