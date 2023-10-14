import {connectToDB} from "@/lib/database";
import { verifyJwtToken, verifyToken } from '@/lib/jwt'
import Gallery from "@/models/Gallery";
export const revalidate = 0; //revalidate api every 1 second

export async function GET(req) {
    await connectToDB()

    try {
        const galleries = await Gallery.find({}).limit(16).populate("authorId")
        return new Response(JSON.stringify(galleries), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify(null), { status: 500 })
    }
}

export async function POST(req) {
    await connectToDB()

    const accessToken = req.headers.get("authorization")
    const token = accessToken.split(' ')[1]

    const decodedToken = verifyJwtToken(token)

    if (!accessToken || !decodedToken) {
        return new Response(JSON.stringify({ error: "unauthorized (wrong or expired token)" }), { status: 403 })
    }

    try {
        const body = await req.json()
        const newGallery = await Gallery.create(body)

        return new Response(JSON.stringify(newGallery), { status: 201 })
    } catch (error) {
        return new Response(JSON.stringify(null), { status: 500 })
    }
}