import { Nations } from "@/app/types"
import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"
import puppeteer from "puppeteer"

export async function GET() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    // go to page
    await page.goto("https://horizonxi.com/yells")
    // set screen size
    await page.setViewport({ width: 1080, height: 1024 })

    // find the list of yells
    try {
        const hwYells: { nation: Nations, text: string }[] = [];
        const yells = await page.$$('.yell-message')
        if (yells.length > 0) {
            for (const [, elemHandle] of yells.entries()) {
                const textHandle = await elemHandle.$$('.yell-text')
                if (textHandle.length !== 1) {
                    // remove the first element which is the "Yell" text
                    await textHandle[0].dispose();
                    continue;
                }
                const text = await textHandle[0].evaluate(el => el.textContent)
                if (text?.length && text.match(/\b(highwind|high wind|hw|eco)\b/i)) {
                    // get the nation
                    let nation: Nations | "" = ""
                    if (text.match(/\b(windy|windurst)\b/i)) {
                        // windurst hw yell
                        nation = Nations.Windurst
                    } else if (text.match(/\b(sandy|san(?:d|d'| d')oria)\b/i)) {
                        // sandoria hw yell
                        nation = Nations.Sandoria
                    } else if (text.match(/\b(bastok|basty)\b/i)) {
                        // bastok hw yell
                        nation = Nations.Bastok
                    } else if (text.match(/kazham/i)) {
                        // jeuno hw yell
                        nation = Nations.Kazham
                    }

                    // get the user
                    const playerHandle = await elemHandle.$$('.yell-name')
                    let player = await playerHandle[0].evaluate(el => el.textContent)
                    if (player?.length) {
                        const playerParts = player.split(":")
                        if (playerParts.length > 0) {
                            player = playerParts[0].trim()
                        }
                    }

                    // get the time
                    const timeHandle = await elemHandle.$$('.yell-time')
                    let time = await timeHandle[0].evaluate(el => el.textContent)
                    if (time?.length && time.length > 2) {
                        time = time.slice(1, -1)
                    }

                    const date = createDateFromTimeString(time || "");
                    const now = date.getTime();

                    // send to db
                    const result = await sql`SELECT * FROM yells WHERE nation = ${nation} AND text = ${text} AND player = ${player} AND time = ${now}`
                    if (result.rows.length === 0) {
                        // insert the yell
                        await sql`INSERT INTO yells(nation, text, player, time) VALUES(${nation}, ${text}, ${player}, ${now})`
                    }

                    await elemHandle.dispose();
                }
            }
        }

        return NextResponse.json(hwYells)
    } catch (err) {
        let message = "Could not find the yells"
        if (err instanceof Error) {
            message = err.message
        }
        return NextResponse.json(message)
    }

}

function createDateFromTimeString(timeString: string): Date {
    // Get today's date
    const today = new Date();

    // Parse the time string (e.g., "02:42:41 PM")
    const parts = timeString.match(/(\d{2}):(\d{2}):(\d{2}) (AM|PM)/);

    if (!parts) {
        throw new Error("Invalid time format. Expected format: HH:MM:SS AM/PM");
    }

    let hours = parseInt(parts[1], 10);
    const minutes = parseInt(parts[2], 10);
    const seconds = parseInt(parts[3], 10);
    const ampm = parts[4];

    // Adjust hours for PM
    if (ampm === "PM" && hours < 12) {
        hours += 12;
    }
    // Adjust hours for 12 AM (midnight)
    if (ampm === "AM" && hours === 12) {
        hours = 0;
    }

    // Set the time components on today's date
    today.setHours(hours, minutes, seconds, 0); // 0 for milliseconds

    return today;
}