import useSWR from "swr"
import { Nations } from "../types"

export type TodResult = {
    tod_timestamp: string,
    tod_count: string,
    nation: Nations,
}

export function useTod(nation: Nations) {
    const params = new URLSearchParams({ nation, limit: "1" })
    const { data, error, isLoading, mutate } = useSWR<TodResult[]>(`/api/tod?${params.toString()}`, (url: string) => fetch(url, { method: "GET", }).then((res) => res.json()), { refreshInterval: 3000 })

    return {
        data: data?.length === 1 ? data[0] : null,
        error,
        mutate,
        isLoading,
    };
}