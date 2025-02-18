import useSWR from "swr"
import { Nations } from "../types"

export type TodResult = {
    tod_timestamp: string,
    tod_count: string,
    nation: Nations,
}

export function useTods(nation: Nations) {
    const params = new URLSearchParams({ nation, limit: "10" })
    const { data, error, mutate, isLoading } = useSWR<TodResult[]>(`/api/tod?${params.toString()}`, (url: string) => fetch(url, { method: "GET", }).then((res) => res.json()), { refreshInterval: 3000 })

    return {
        data: data || [],
        error,
        mutate,
        isLoading,
    };
}