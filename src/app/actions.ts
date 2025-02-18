import { Nations, Tod, TodRaw } from './types';
import { sql } from '@vercel/postgres';

export async function fetchTods() {
    // grab tods from last 6 hours
    const tods = await sql`
            SELECT CAST(EXTRACT(EPOCH FROM rounded_timestamp) * 1000 AS BIGINT) AS tod_timestamp, COUNT(rounded_timestamp) as count, nation
        FROM(
            SELECT DATE_TRUNC('minute', TO_TIMESTAMP(tod_timestamp / 1000)) AS rounded_timestamp, nation
                FROM tods
        ) AS rounded_query
            WHERE rounded_timestamp >= NOW() - INTERVAL '6 hours'
            GROUP BY rounded_timestamp, nation
            ORDER BY nation ASC, count DESC, rounded_timestamp ASC`

    return tods.rows
}

export async function fetchTod(nation: Nations) {
    const tods = await sql`
    SELECT CAST(EXTRACT(EPOCH FROM rounded_timestamp) * 1000 AS BIGINT) AS tod_timestamp, COUNT(rounded_timestamp) as count, nation
FROM(
    SELECT DATE_TRUNC('minute', TO_TIMESTAMP(tod_timestamp / 1000)) AS rounded_timestamp, nation
        FROM tods
) AS rounded_query
    WHERE rounded_timestamp >= NOW() - INTERVAL '6 hours' AND nation = ${nation}
    GROUP BY rounded_timestamp, nation
    ORDER BY nation ASC, count DESC, rounded_timestamp ASC`

    return tods.rows[0]
}


export async function createTod(timestamp: Date, nation: Nations, userEmail: string) {
    console.log(`here is the timestamp: ${timestamp}`)
    // Check if user has already submitted a TOD in the last 4 hours
    const existingTod = await sql<TodRaw>`SELECT * FROM tods WHERE nation = ${nation} AND created_by = ${userEmail} AND tod_timestamp >= ${timestamp.getTime()} - 14400000`
    if (existingTod.rows.length > 0) {
        console.log(`found 1: ${timestamp}`)
        throw new Error(`You have already submitted a TOD for ${nation} within the past 4 hours!`)
    }

    console.log(`creating...: ${timestamp}`)

    // Insert the new TOD
    const newTod = await sql<TodRaw>`
        INSERT INTO tods (tod_timestamp, nation, created_by, created_on) 
        VALUES (${timestamp.getTime()}, ${nation}, ${userEmail}, ${new Date().getTime()}) 
        RETURNING id, tod_timestamp, nation, created_by, created_on`
    return new Tod(newTod.rows[0])
}

// export async function updateTod(id: string, updates: Partial<TodRaw>, userEmail?: string) {
//     // Update the TOD on the server
//     const updatedTod = await sql<TodRaw>`
//         UPDATE tods SET ${Object.keys(updates).join(", ")}, modified_by = ${userEmail || ""}, modified_on = NOW() 
//         WHERE id = ${id} 
//         RETURNING id, timestamp, nation, created_by, created_on, modified_by, modified_on`;
//     return new Tod(updatedTod.rows[0])
// }
