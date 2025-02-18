
"use client"

import { Button } from "@mui/material"
import { signIn } from "next-auth/react"

import discord from "../../../public/discord-icon.svg"
import Image from "next/image"

export default function LoginButton() {
    return (
        <Button variant="contained" color="secondary" endIcon={<Image src={discord} height={30} width={30} alt="Discord" />} onClick={() => signIn("discord")}>Login</Button>
    )
} 