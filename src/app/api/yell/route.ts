import { sql } from "@vercel/postgres"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl
    const nation = searchParams.get('nation') ?? ""
    const limit = searchParams.get("limit") ?? ""
    const skip = searchParams.get("skip") ?? ""
    const timestampGreaterThanOrEqual = searchParams.get("timestamp_gte") ?? ""

    let sort: "ASC" | "DESC";
    if (searchParams.get("sort")?.match(/^asc$/i)) {
        sort = "ASC";
    } else if (searchParams.get("sort")?.match(/^desc$/i)) {
        sort = "DESC";
    } else {
        sort = "DESC"; // Default sort order
    }

    try {
        const sqlValues: (string | number)[] = [];
        let selectSQL = `SELECT id, player, text, timestamp, nation FROM hw_yell`

        if (nation.length) {
            selectSQL += ` WHERE nation = $${sqlValues.length + 1}`
            sqlValues.push(nation);
        }

        if (timestampGreaterThanOrEqual.length) {
            if (nation.length) {
                selectSQL += ` AND timestamp >= $${sqlValues.length + 1}`;
            } else {
                selectSQL += ` WHERE timestamp >= $${sqlValues.length + 1}`;
            }
            sqlValues.push(timestampGreaterThanOrEqual);

        }

        selectSQL += ` ORDER BY timestamp ${sort}`;

        if (limit) {
            const limitNum = parseInt(limit, 10);
            if (!isNaN(limitNum) && limitNum > 0) {
                selectSQL += ` LIMIT $${sqlValues.length + 1}`;
                sqlValues.push(limitNum);
            }
        }

        if (skip) {
            const skipNum = parseInt(skip, 10);
            if (!isNaN(skipNum) && skipNum >= 0) {
                selectSQL += ` OFFSET $${sqlValues.length + 1}`;
                sqlValues.push(skipNum);
            }
        }

        const response = await sql.query(selectSQL, sqlValues);
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