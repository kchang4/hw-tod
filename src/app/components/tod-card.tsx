"use client"

import { Alert, Badge, Box, Button, ButtonGroup, Chip, debounce, Divider, LinearProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Snackbar, Stack, Tooltip, Typography } from "@mui/material"
import { Nations, TodRaw } from "../types"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import Image from "next/image"
import { useTimeSettings } from "../contexts/time-settings.context"
import bastokIcon from "../../../public/bastok.webp"
import kazhamIcon from "../../../public/kazham.webp"
import sandoriaIcon from "../../../public/sandoria.webp"
import windurstIcon from "../../../public/windurst.webp"
import { useTod } from "../hooks/useTod"
import { useTods } from "../hooks/useTods"
import { useState } from "react"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import RefreshIcon from "@mui/icons-material/Refresh"
import Countdown, { CountdownRenderProps } from "react-countdown"
import { useTheme } from "@mui/material/styles"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"
import { useSession } from "next-auth/react"


dayjs.extend(relativeTime)

export interface TodBarProps {
    nation: Nations
}

export default function TodCard({ nation }: TodBarProps) {
    const theme = useTheme()
    const color = {
        [Nations.Bastok]: "rgba(0, 0, 255, .1)",
        [Nations.Kazham]: "rgba(128, 0, 128, .1)",
        [Nations.Sandoria]: "rgba(255, 0, 0, .1)",
        [Nations.Windurst]: "rgba(0, 255, 0, .1)",
    }
    const icon = {
        [Nations.Bastok]: bastokIcon,
        [Nations.Kazham]: kazhamIcon,
        [Nations.Sandoria]: sandoriaIcon,
        [Nations.Windurst]: windurstIcon,
    }

    const { data: session } = useSession()
    const { timeFormat } = useTimeSettings()

    const TIME_FORMAT = timeFormat === "24" ? "MM/DD/YYYY HH:mm:ss" : "MM/DD/YYYY hh:mm:ss A"

    const { data: tod, isLoading: isLoadingTod, mutate: refreshTod } = useTod(nation)
    const { data: tods, isLoading: isLoadingTods, mutate: refreshTods } = useTods(nation)

    const [viewMore, setViewMore] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState('')
    const [saving, setSaving] = useState(false)
    const [hasError, setHasError] = useState<boolean>(false)

    const refresh = debounce(() => {
        refreshTod()
        refreshTods()
    }, 500)

    const saveTod = async (nation: Nations, tod: number) => {
        setNotificationMessage("")
        setHasError(false)

        if (!session) {
            const errorMessage = 'You must be logged in to submit a TOD!'
            setNotificationMessage(errorMessage)
            setHasError(true)
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
                setHasError(true)
                setNotificationMessage(err.message)
            }
        } finally {
            setSaving(false)
        }
    }

    const renderCountdown = ({ hours, minutes, seconds, completed }: CountdownRenderProps) => {
        const hourSplit = hours.toString().split("")
        if (hourSplit.length === 1) {
            hourSplit.unshift("0")
        }

        const minSplit = minutes.toString().split("")
        if (minSplit.length === 1) {
            minSplit.unshift("0")
        }

        const secSplit = seconds.toString().split("")
        if (secSplit.length === 1) {
            secSplit.unshift("0")
        }

        let bgColor = theme.palette.secondary.main
        let color = theme.palette.secondary.contrastText
        if (completed) {
            bgColor = theme.palette.error.main
            color = theme.palette.error.contrastText
        } else if (!hours && minutes <= 10) {
            bgColor = theme.palette.warning.main
            color = theme.palette.warning.contrastText
        }

        return (
            <Stack spacing={.5} direction="row">
                <Box borderRadius={1} bgcolor={bgColor} color={color} width={20} height={20} textAlign="center" padding={.5}>{hourSplit[0]}</Box>
                <Box borderRadius={1} bgcolor={bgColor} color={color} width={20} height={20} textAlign="center" padding={.5}>{hourSplit[1]}</Box>
                <Box height={20}><Typography variant="subtitle1">H</Typography></Box>
                <Box borderRadius={1} bgcolor={bgColor} color={color} width={20} height={20} textAlign="center" padding={.5}>{minSplit[0]}</Box>
                <Box borderRadius={1} bgcolor={bgColor} color={color} width={20} height={20} textAlign="center" padding={.5}>{minSplit[1]}</Box>
                <Box height={20}><Typography variant="subtitle1">M</Typography></Box>
                <Box borderRadius={1} bgcolor={bgColor} color={color} width={20} height={20} textAlign="center" padding={.5}>{secSplit[0]}</Box>
                <Box borderRadius={1} bgcolor={bgColor} color={color} width={20} height={20} textAlign="center" padding={.5}>{secSplit[1]}</Box>
                <Box height={20}><Typography variant="subtitle1">S</Typography></Box>
            </Stack>
        )
    }

    if (isLoadingTod || isLoadingTods) return <LinearProgress />

    return (
        <Box
            sx={(theme) => ({
                marginBottom: theme.spacing(2),
                padding: theme.spacing(2),
                border: '2px solid rgba(0, 0, 0, .1)',
                backgroundImage: `linear-gradient(to right, ${color[nation]}, white)`,
            })}
        >
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-start">
                <Image src={icon[nation]} width={30} height={30} alt={nation} />
                <Typography variant="h6">{nation}</Typography>
                <Box flexGrow={1} />
                {tod && <Countdown key={Date.now()} date={dayjs(parseInt(tod.tod_timestamp)).add(4, "hours").valueOf()} renderer={renderCountdown} />}
                <ButtonGroup size="small" variant="contained">
                    <Button title="Refresh the TOD and the list of TODs" onClick={() => refresh()}><RefreshIcon /></Button>
                    <Button title="Toggle to show/hide more TODs" size="small" variant="contained" onClick={() => setViewMore(!viewMore)}>{viewMore ? <ExpandLessIcon /> : <ExpandMoreIcon />}</Button>
                </ButtonGroup>
            </Stack>
            {viewMore && (
                <Box>
                    <Divider sx={(theme) => ({ paddingTop: theme.spacing(1) })} variant="fullWidth"><Chip label="TODs" size="medium"></Chip></Divider>
                    <List dense>
                        {tods.map((tod, index) => {
                            const todInt = parseInt(tod.tod_timestamp)
                            const popTime = <Typography variant="subtitle1">POP: {dayjs(todInt).add(4, "hours").format(TIME_FORMAT)}</Typography>
                            const todTime = <Typography sx={{ color: "rgba(0, 0, 0, .5)" }} variant="subtitle2">TOD: {dayjs(todInt).format(TIME_FORMAT)}</Typography>
                            const secondaryAction =
                                <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                                    <ListItemIcon><Tooltip title="Number of Reports"><Badge badgeContent={tod.tod_count} color="primary"></Badge></Tooltip></ListItemIcon>
                                    <ListItemButton disabled={saving || !session} title="Increase the visibility of this TOD" onClick={() => saveTod(tod.nation, parseInt(tod.tod_timestamp))}><ThumbUpIcon color="secondary" /></ListItemButton>
                                </Stack>
                            return (
                                <Box key={`${nation}${index}${tod.tod_timestamp}`}>
                                    <ListItem key={tod.tod_timestamp} secondaryAction={secondaryAction}>
                                        <ListItemText primary={popTime} secondary={todTime} />
                                    </ListItem>
                                    {index !== tods.length - 1 ? < Divider /> : null}
                                </Box>
                            )
                        })}
                    </List>
                </Box>
            )}
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={!!notificationMessage.length}
                autoHideDuration={3000}
                onClose={() => setNotificationMessage('')}
            >
                <Alert severity={hasError ? "error" : "success"}>{notificationMessage}</Alert>
            </Snackbar>
        </Box >
    )
}