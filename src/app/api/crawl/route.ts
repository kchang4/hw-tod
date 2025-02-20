import { NextRequest, NextResponse } from "next/server"
import puppeteer from "puppeteer"

export async function GET(req: NextRequest) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    // go to page
    await page.goto("https://horizonxi.com/yells")
    // set screen size
    await page.setViewport({ width: 1080, height: 1024 })
    
    // find the list of yells
    const elemHandle = await page.locator('.yell-tell').waitHandle()
    const text = elemHandle.evaluate(el => el.textContent)
    console.log(text)
}