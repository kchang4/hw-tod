import { auth } from "@/app/auth"
import { Nations } from "@/app/types"
import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"
import puppeteer from "puppeteer"
// import { GoogleGenAI } from "@google/genai";

export async function GET() {
    // make sure user is authenticated
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: "You must be logged in to crawl yells" }, { status: 401 })
    }
    // make sure user is an admin
    if (session.user?.email !== process.env.ADMIN_EMAIL) {
        return NextResponse.json({ error: "You must be an admin to crawl yells" }, { status: 403 })
    }

    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    // go to page
    await page.goto("https://horizonxi.com/yells")
    // set screen size
    await page.setViewport({ width: 1080, height: 1024 })

    // find the list of yells
    try {
        let added = 0
        const yells = await page.$$('.yell-message')
        if (yells.length > 0) {
            for (const [, elemHandle] of yells.entries()) {
                const textHandle = await elemHandle.$$('.yell-text')
                if (textHandle.length !== 1) {
                    // skip, unexpected number of text elements
                    await textHandle[0].dispose();
                    continue;
                }

                let text = await textHandle[0].evaluate(el => el.textContent) || ""
                if (!text.length || !text.match(/\b(highwind|hw)\b/i)) {
                    // skip, text is empty or does not contain "highwind" or "hw"
                    await textHandle[0].dispose()
                    continue
                }

                text = text.trim()

                if (text.charAt(text.length - 1) === "?") {
                    // skip questions
                    await textHandle[0].dispose()
                    continue
                }

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

                // get the player name
                const playerHandle = await elemHandle.$$('.yell-name')
                let player = await playerHandle[0].evaluate(el => el.textContent)
                if (player?.length) {
                    const playerParts = player.split(":")
                    if (playerParts.length > 0) {
                        player = playerParts[0].trim()
                    }
                }
                playerHandle[0].dispose();

                // get the timestamp
                const timeHandle = await elemHandle.$$('.yell-time')
                let time = await timeHandle[0].evaluate(el => el.textContent)
                if (time?.length && time.length > 2) {
                    time = time.slice(1, -1)
                }
                const date = createDateFromTimeString(time || "");
                const now = date.getTime();
                timeHandle[0].dispose();


                // send to db
                const result = await sql`SELECT * FROM hw_yell WHERE nation = ${nation} AND text = ${text} AND player = ${player} AND timestamp = ${now}`
                if (result.rows.length === 0) {
                    // insert the yell
                    await sql`INSERT INTO hw_yell(nation, text, player, timestamp) VALUES(${nation}, ${text}, ${player}, ${now})`
                    added++
                }

                await elemHandle.dispose();
            }
        }

        return NextResponse.json({ message: `Added ${added} yells` })
    } catch (err) {
        let message = "Could not find the yells"
        if (err instanceof Error) {
            message = err.message
        }
        return NextResponse.json(message)
    }

}

// Utility: Use Gemini API to extract time in seconds from a string
// async function extractTimeInSecondsGemini(text: string): Promise<number | null> {
//     const apiKey = process.env.GEMINI_API_KEY
//     if (!apiKey) throw new Error('GEMINI_API_KEY not set')
//     const genAI = new GoogleGenAI({ apiKey })
//     const response = await genAI.models.generateContent({
//         model: "gemini-2.0-flash",
//         contents: text,
//         config: {
//             systemInstruction: `
//             You want to extract just the time information from the given context.
//             If there is no time information I want you to always answer with no.
//             If there is time information, I want you to retun the time in seconds without any additional text.`
//         }
//     })

//     // The response is in result.response.candidates[0].content.parts[0].text
//     const content = response.text || ""
//     if (content.toLowerCase() === "no") {
//         return null; // No time information found
//     }

//     const seconds = parseInt(content, 10)
//     if (!isNaN(seconds) && seconds > 0) {
//         return seconds;
//     }
//     return null;
// }

function createDateFromTimeString(timeString: string): Date {
    // Get today's date
    const today = new Date()

    // Parse the time string (e.g., "02:42:41 PM")
    const parts = timeString.match(/(\d{2}):(\d{2}):(\d{2}) (AM|PM)/)

    if (!parts) {
        throw new Error("Invalid time format. Expected format: HH:MM:SS AM/PM")
    }

    let hours = parseInt(parts[1], 10)
    const minutes = parseInt(parts[2], 10)
    const seconds = parseInt(parts[3], 10)
    const ampm = parts[4]

    // Adjust hours for PM
    if (ampm === "PM" && hours < 12) {
        hours += 12
    }
    // Adjust hours for 12 AM (midnight)
    if (ampm === "AM" && hours === 12) {
        hours = 0
    }

    // Set the time components on today's date
    today.setHours(hours, minutes, seconds, 0) // 0 for milliseconds

    return today
}