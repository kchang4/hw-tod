'use client'

import { LineChart, LineChartProps, ScatterChart } from "@mui/x-charts"
import { Nations, Tod } from "./types"
import { useState } from "react"
import dayjs from "dayjs"

export interface TodGraphProps {
    tods: Tod[]
    onRefresh?: () => Promise<Tod[]>
}

const getGraphData = (tods: Tod[], xAxis: Date[]) => {
    const data: LineChartProps["series"] = [
        { data: [], curve: "linear", color: "blue", label: Nations.Bastok },
        { data: [], curve: "linear", color: "purple", label: Nations.Kazham },
        { data: [], curve: "linear", color: "red", label: Nations.Sandoria },
        { data: [], curve: "linear", color: "green", label: Nations.Windurst },
    ]

    for (const tod of tods) {
        const popTime = dayjs(tod.timestamp).add(4, "hour")
        const key = xAxis.findIndex((i) => i.getTime() === popTime.valueOf())
        if (key === -1) {
            continue;
        }

        let nation = -1
        switch (tod.nation) {
            case Nations.Bastok:
                nation = 0
                break
            case Nations.Kazham:
                nation = 1
                break
            case Nations.Sandoria:
                nation = 2
                break
            case Nations.Windurst:
                nation = 3
                break
            default:
                continue;
        }

        if (!Array.isArray(data[nation].data)) {
            data[nation].data = [];
        }

        if (!data[nation].data![key]) {
            data[nation].data![key] = 0
        }

        // @ts-ignore
        data[nation].data![key] += 1
    }

    return data
}

function getXAxisData(tods: Tod[]) {
    const data: Date[] = []

    for (const tod of tods) {
        const popTime = dayjs(tod.timestamp).add(4, "hour")
        if (data.find((i) => i.getTime() === popTime.valueOf())) {
            continue;
        }
        data.push(popTime.toDate())
    }

    data.sort((a, b) => a.getTime() - b.getTime())

    return data;
}

export default function TodGraph(props: TodGraphProps) {
    const [graphData, setGraphData] = useState<LineChartProps["series"]>(getGraphData(props.tods, getXAxisData(props.tods)))
    const [xAxisData, setXAxisData] = useState<Date[]>(getXAxisData(props.tods))

    const refreshData = async () => {
        if (!props.onRefresh) {
            return;
        }

        const newTods = await props.onRefresh()
        const xAxisData = getXAxisData(newTods)
        setXAxisData(xAxisData)

        const graphData = getGraphData(newTods, xAxisData)
        setGraphData(graphData)
    }

    return (
        <LineChart
            xAxis={[{
                label: "Time",
                valueFormatter: (value: Date) => {
                    return dayjs(value).format("HH:mm:ss")
                },
                min: dayjs().toDate(),
                max: dayjs().add(4, "hour").toDate(),
                data: xAxisData,
            }]}
            yAxis={[{
                label: "Number of Reports",
                // tickInterval: (value: number) => value % 1 === 0,
                // scaleType: "point"
            }]}
            series={graphData}
            width={800}
            height={600}
        />
    )
}