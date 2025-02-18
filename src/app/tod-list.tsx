"use client"

import { Box } from "@mui/material"
import { Nations } from "./types"
import TodCard from "./components/tod-card"

export default function TodList() {

    return (
        <Box sx={(theme) => ({ padding: theme.spacing(2) })}>
            <TodCard nation={Nations.Bastok} />
            <TodCard nation={Nations.Kazham} />
            <TodCard nation={Nations.Sandoria} />
            <TodCard nation={Nations.Windurst} />
        </Box>
    )
}