import useSWR from "swr"
import { Nations } from "../types"

export type YellQueryParams = {
    nation?: Nations,
    limit?: number,
    skip?: number,
    sort?: "asc" | "desc",
}

export type YellResult = {
    id: string,
    player: string,
    text: string,
    timestamp: string,
    nation: string,
}

export function useYells(queryParams: YellQueryParams) {
    const params = new URLSearchParams()
    if (queryParams.nation) params.append("nation", queryParams.nation)
    if (queryParams.limit !== undefined) params.append("limit", queryParams.limit.toString())
    if (queryParams.skip !== undefined) params.append("skip", queryParams.skip.toString())
    if (queryParams.sort) params.append("sort", queryParams.sort)

    // polls data every 10 seconds
    // you can adjust the refreshInterval as needed
    const { data, error, mutate, isLoading } = useSWR<YellResult[]>(
        `/api/yell`,
        async (url: string) => {
            // only grab yells from the last 8 hours
            params.set("timestamp_gte", (Date.now() - 8 * 60 * 60 * 1000).toString());
            const response = await fetch(`${url}?${params.toString()}`, { method: "GET" });
            return response.json();
        }, { refreshInterval: 5000 })

    return {
        data: data || [],
        error,
        mutate,
        isLoading,
    }
}