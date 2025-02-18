import { NextRequest, NextResponse } from "next/server"
import { Nations, TodRaw } from "../../types"
import { sql } from "@vercel/postgres"
import dayjs from "dayjs"
import { auth } from "@/app/auth"

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl
    const nation = searchParams.get('nation')
    const limit = searchParams.get('limit') || 10

    try {
        const tods = await sql`
        WITH RecentTods AS (
            SELECT * 
            FROM public.tods 
            WHERE EXTRACT(EPOCH FROM now()) * 1000 - tod_timestamp <= 4 * 60 * 60 * 1000 AND nation = ${nation}
        )
        SELECT tod_timestamp, COUNT(*) AS tod_count, nation
        FROM RecentTods
        GROUP BY tod_timestamp, nation
        ORDER BY tod_count DESC
        LIMIT ${limit}`

        return Response.json(tods.rows.filter((tod) => !nation || tod.nation === nation))
    } catch (err) {
        if (err instanceof Error) {
            return new Response(`Error fetching TODs: ${err.message} `, { status: 500 })
        } else {
            return new Response("Error fetching TODs", {
                status: 500
            })
        }
    }
}
export async function POST(req: NextRequest) {
    // Save the TOD to the server
    try {
        const session = await auth()
        if (!session) {
            return new Response("You must be logged in to submit a TOD!", { status: 401 })
        }

        const body = await req.json()

        if (!("timestamp" in body)) {
            return new Response("Missing timestamp", { status: 400 })
        } else if (typeof body.timestamp !== 'number') {
            return new Response("Invalid timestamp provided: date is not a number", { status: 400 })
        } else if (dayjs().valueOf() < body.timestamp) {
            return new Response("Invalid timestamp provided: timestamp is in the future", { status: 400 })
        } else if (!("nation" in body)) {
            return new Response("Missing nation", { status: 400 })
        } else if (body.nation !== Nations.Bastok && body.nation !== Nations.Kazham && body.nation !== Nations.Sandoria && body.nation !== Nations.Windurst) {
            return NextResponse.json({ error: "Invalid nation provided: nation is not of the allowed four" }, { status: 400 })
        }

        const { timestamp, nation } = body

        if (!session.user?.email) {
            return new Response("Invalid user: no email provided", { status: 400 })
        }

        const fourHrsAgo = dayjs(timestamp).subtract(4, 'hours').valueOf()

        // Check if user has already submitted a TOD in the last 4 hours
        // const existingTod = await sql<TodRaw>`SELECT * FROM tods WHERE nation = ${nation} AND created_by = ${session.user.email} AND tod_timestamp >= ${fourHrsAgo}`
        // if (existingTod.rows.length > 0) {
        //     return new NextResponse(`You have already submitted a TOD for this nation within the past 4 hours!`, { status: 400 })
        // }

        const result = await sql`
            INSERT INTO tods(tod_timestamp, nation, created_by, created_on)
        VALUES(${timestamp}, ${nation}, ${session.user?.email || ''}, ${new Date().getTime()}) 
            RETURNING id, tod_timestamp, nation, created_by, created_on`

        const newTod: TodRaw = {
            id: result.rows[0].id,
            tod_timestamp: parseInt(result.rows[0].tod_timestamp),
            nation: result.rows[0].nation,
            count: parseInt(result.rows[0].count),
            created_by: result.rows[0].created_by,
            created_on: parseInt(result.rows[0].created_on)
        }

        return Response.json(newTod)
    } catch (err) {
        if (err instanceof Error) {
            return new Response(`Error creating TOD: ${err.message} `, { status: 500 })
        } else {
            return new Response("Error creating TOD", {
                status: 500
            })
        }
    }
}