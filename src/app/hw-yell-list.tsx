"use client"

import { Box, Divider, List, ListItem, ListItemText } from "@mui/material"
import { Nations } from "./types";
import { useYells } from "./hooks/useYells";
import dayjs from "dayjs";
import { useTimeSettings } from "./contexts/time-settings.context";
import { useEffect, useState } from "react";
import theme from "./theme";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export interface HWYellListProps {
    nation?: Nations;
}

export default function HWYellList({ nation }: HWYellListProps) {
    const yells = useYells(nation ?? "", 50, 0, "desc");
    const { timeFormat } = useTimeSettings()

    const [time, setTime] = useState(timeFormat === "24" ? "MM/DD/YYYY HH:mm:ss" : "MM/DD/YYYY hh:mm:ss A")

    useEffect(() => {
        setTime(timeFormat === "24" ? "MM/DD/YYYY HH:mm:ss" : "MM/DD/YYYY hh:mm:ss A")
    }, [timeFormat])

    return (
        <Box sx={(theme) => ({ padding: theme.spacing(2) })}>
            {yells.isLoading ? (
                <div>Loading...</div>
            ) : (
                <List>
                    {yells.data.map((yell, index) => (
                        <>
                            <ListItem key={yell.id}>
                                <ListItemText>
                                    <strong>[{dayjs(parseInt(yell.timestamp, 10)).format(time)}]</strong>{" "}
                                    <strong>[{dayjs(parseInt(yell.timestamp, 10)).fromNow()}]</strong>{" "}
                                    <span style={{ backgroundColor: theme.palette.primary.main, color: "white", padding: "5px" }}>{yell.player}</span>{" "}
                                    {" "}
                                    {yell.text}
                                </ListItemText>
                            </ListItem>
                            {index < yells.data.length - 1 && <Divider variant="middle" />}
                        </>
                    ))}
                </List>
            )
            }
        </Box >
    )
}