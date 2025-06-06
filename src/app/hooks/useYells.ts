import useSWR from "swr"
import { Nations } from "../types"

export type YellResult = {
    id: string,
    player: string,
    text: string,
    timestamp: string,
    nation: string,
}

export function useYells(nation: Nations | "", limit?: number, skip?: number, sort?: "asc" | "desc") {
    const params = new URLSearchParams();
    if (nation) params.append("nation", nation);
    if (limit !== undefined) params.append("limit", limit.toString());
    if (skip !== undefined) params.append("skip", skip.toString());
    if (sort) params.append("sort", sort);

    const { data, error, mutate, isLoading } = useSWR<YellResult[]>(`/api/yell?${params.toString()}`, (url: string) => fetch(url, { method: "GET" }).then((res) => res.json()), { refreshInterval: 3000 });

    return {
        data: data || [],
        error,
        mutate,
        isLoading,
    };
}