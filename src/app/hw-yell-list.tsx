"use client"

import { Box } from "@mui/material"
import { Nations } from "./types";
import { useYells } from "./hooks/useYells";
import dayjs from "dayjs";
import { useTimeSettings } from "./contexts/time-settings.context";

export interface HWYellListProps {
    nation?: Nations;
}

export default function HWYellList({ nation }: HWYellListProps) {
    const yells = useYells(nation ?? "", 10, 0, "desc");
    const { timeFormat } = useTimeSettings()

    const TIME_FORMAT = timeFormat === "24" ? "MM/DD/YYYY HH:mm:ss" : "MM/DD/YYYY hh:mm:ss A"

    return (
        <Box sx={(theme) => ({ padding: theme.spacing(2) })}>
            {yells.isLoading ? (
                <div>Loading...</div>
            ) : (
                <ul>
                    {yells.data.map((yell) => (
                        <li key={yell.id}>
                            <strong>[{dayjs(parseInt(yell.timestamp, 10)).format(TIME_FORMAT)}]</strong> {yell.player}: {yell.text}
                        </li>
                    ))}
                </ul>
            )}
        </Box>
    )
}