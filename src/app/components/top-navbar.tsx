"use client"

import { AppBar, Box, Button, FormControlLabel, IconButton, Menu, MenuItem, Switch, Toolbar } from "@mui/material"
import AccountCircle from "@mui/icons-material/AccountCircle"
import { signOut, useSession } from "next-auth/react"
import LoginButton from "./login-button"
import Image from "next/image"
import { useState } from "react"
import { useTimeSettings } from "../contexts/time-settings.context"

export default function TopNavBar() {
    const { data: session } = useSession()
    const { timeFormat, changeTimeFormat } = useTimeSettings()

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [clockFormat, setClockFormat] = useState(timeFormat)

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClockFormatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.checked ? "24" : "12"
        changeTimeFormat(value)
        setClockFormat(value)
    }

    const crawl = async () => {
        const response = await fetch("/api/crawl", { method: "GET"})
        console.log(response.body)
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <FormControlLabel control={<Switch color="secondary" checked={clockFormat === "24"} onChange={handleClockFormatChange} />} label={`${clockFormat} Hour Format`} />
                    <Box flexGrow={1}></Box>
                    {session?.user?.email && <IconButton>{session?.user?.image ? <Image onClick={handleMenu} height={30} width={30} src={session.user.image} alt={session.user.name || ""} /> : <AccountCircle />}</IconButton>}
                    {!session && <LoginButton />}
                    {session?.user && <Button onClick={() => crawl()}>Click Me</Button>}
                </Toolbar>
            </AppBar>
            <Menu anchorEl={anchorEl} id="user-profile-menu" open={!!anchorEl} onClose={() => setAnchorEl(null)} keepMounted>
                <MenuItem onClick={() => signOut()}>Logout</MenuItem>
            </Menu>
        </Box>
    )
}