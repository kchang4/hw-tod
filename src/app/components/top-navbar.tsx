"use client"

import { AppBar, Box, Button, FormControlLabel, IconButton, Menu, MenuItem, Snackbar, Switch, Toolbar } from "@mui/material"
import AccountCircle from "@mui/icons-material/AccountCircle"
import { signOut, useSession } from "next-auth/react"
import LoginButton from "./login-button"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useTimeSettings } from "../contexts/time-settings.context"

export default function TopNavBar() {
    const { data: session } = useSession()
    const { timeFormat, changeTimeFormat } = useTimeSettings()

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [clockFormat, setClockFormat] = useState(timeFormat)
    const [user, setUser] = useState(session?.user || null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [crawlMessage, setCrawlMessage] = useState("")
    const [showCrawlMessage, setShowCrawlMessage] = useState(false)

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClockFormatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.checked ? "24" : "12"
        changeTimeFormat(value)
    }

    const crawl = async () => {
        setCrawlMessage("")
        const response = await fetch("/api/crawl", { method: "GET" })
        if (response.ok) {
            const data = await response.json()
            setCrawlMessage(data.message)
            setShowCrawlMessage(true)
        }
    }

    useEffect(() => {
        setClockFormat(timeFormat)
    }, [timeFormat])

    useEffect(() => {
        async function handleSessionChange() {
            setUser(session?.user || null)
            if (session?.user) {
                const response = await fetch("/api/is-admin")
                if (response.ok) {
                    setIsAdmin(true)
                } else {
                    setIsAdmin(false)
                }
            }
        }

        handleSessionChange()
    }, [session])

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <FormControlLabel control={<Switch color="secondary" checked={clockFormat === "24"} onChange={handleClockFormatChange} />} label={`${clockFormat} Hour Format`} />
                    <Box flexGrow={1}></Box>
                    {!user && <LoginButton />}
                    {user && <IconButton>{user?.image ? <Image onClick={handleMenu} height={30} width={30} src={user.image} alt={user.name || ""} /> : <AccountCircle />}</IconButton>}
                    {user && isAdmin && <Button color="secondary" onClick={() => crawl()}>CRAWL!</Button>}
                </Toolbar>
            </AppBar>
            <Menu anchorEl={anchorEl} id="user-profile-menu" open={!!anchorEl} onClose={() => setAnchorEl(null)} keepMounted>
                <MenuItem onClick={() => signOut()}>Logout</MenuItem>
            </Menu>
            <Snackbar
                open={showCrawlMessage}
                autoHideDuration={6000}
                onClose={() => setShowCrawlMessage(false)}
                message={crawlMessage}
            />
        </Box>
    )
}