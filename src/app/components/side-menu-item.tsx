import { IconButton, ListItem, ListItemIcon } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import Image from "next/image";
import AddIcon from "@mui/icons-material/Add";
import { useTimeSettings } from "../contexts/time-settings.context";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { Nations } from "../types";
import bastokIcon from "../../../public/bastok.webp";
import kazhamIcon from "../../../public/kazham.webp";
import sandoriaIcon from "../../../public/sandoria.webp";
import windurstIcon from "../../../public/windurst.webp";


export interface SideMenuItemProps {
    disabled: boolean
    nation: Nations
    onSave: (nation: Nations, tod: number) => Promise<void>
}



export default function SideMenuItem({ disabled, nation, onSave }: SideMenuItemProps) {
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

    const { timeFormat } = useTimeSettings()

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

    useEffect(() => {
        updateTimer()

        return () => clearTimer()
    }, [])

    return (
        <ListItem
            sx={{ backgroundImage: `linear-gradient(to right, ${color[nation]}, white)` }}
            secondaryAction={<IconButton disabled={disabled} color="secondary" onClick={() => onSave(nation, currentTime.valueOf())}><AddIcon /></IconButton>}
        >
            <ListItemIcon><Image src={icon[nation]} width={30} height={30} alt={nation} /></ListItemIcon>
            <DateTimePicker
                slotProps={{ textField: { onFocus: () => clearTimer() } }}
                onChange={updateCurrentTime}
                ampm={timeFormat !== "24"}
                sx={{ width: 245 }}
                value={currentTime}
                disabled={disabled}
                views={["year", "month", "day", "hours", "minutes", "seconds"]}
            />
        </ListItem>
    )
}