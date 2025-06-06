import { QueryResult, QueryResultRow, sql } from "@vercel/postgres";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const nation = searchParams.get('nation') ?? "";
    const limit = parseInt(searchParams.get("limit") ?? "50", 10);
    const skip = parseInt(searchParams.get("skip") ?? "0", 10);

    let sort: "ASC" | "DESC";
    if (searchParams.get("sort")?.match(/^asc$/i)) {
        sort = "ASC";
    } else if (searchParams.get("sort")?.match(/^desc$/i)) {
        sort = "DESC";
    } else {
        sort = "DESC"; // Default sort order
    }

    try {
        let selectSQL = ""
        let response: QueryResult<QueryResultRow>;

        if (nation.length) {
            selectSQL = `
                SELECT *
                FROM hw_yell
                WHERE nation = $1
                ORDER BY timestamp ${sort}
                LIMIT $2
                OFFSET $3
            `;
            response = await sql.query(selectSQL, [nation, limit, skip]);
        } else {
            selectSQL = `
                SELECT id, player, text, timestamp, nation
                FROM hw_yell
                ORDER BY timestamp ${sort}
                LIMIT $1
                OFFSET $2
            `;
            response = await sql.query(selectSQL, [limit, skip]);
        }


        return Response.json(response.rows)
    } catch (err) {
        if (err instanceof Error) {
            return new Response(`Error fetching yells: ${err.message} `, { status: 500 })
        } else {
            return new Response("Error fetching yells", {
                status: 500
            })
        }
    }
}