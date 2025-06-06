import { auth } from "@/app/auth";
import { NextResponse } from "next/server";

export async function GET() {
    // make sure user is authenticated
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: "You must be logged in to access this resource" }, { status: 401 })
    }

    // make sure user is an admin
    if (session.user?.email !== process.env.ADMIN_EMAIL) {
        return NextResponse.json({ error: "You are not an admin" }, { status: 403 })
    }

    return NextResponse.json({ message: "You are an admin" }, { status: 200 });
}