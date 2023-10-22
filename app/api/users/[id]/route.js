import {connectToDB} from "@/lib/database";
import { verifyJwtToken } from "@/lib/jwt";
import User from "@/models/User";

export async function GET(req, ctx) {
    await connectToDB()

    const id = ctx.params.id

    try {
        const users = await User.findById(id).populate("")

        return new Response(JSON.stringify(users), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify(null), { status: 500 })
    }
}

export async function PUT(req, ctx) {
    await connectToDB()

    const id = ctx.params.id
    const accessToken = req.headers.get('authorization')
    const token = accessToken.split(" ")[1]

    const decodedToken = verifyJwtToken(token)

    if (!accessToken || !decodedToken) {
        return new Response(JSON.stringify({ error: "unauthorized (wrong or expired token)" }), { status: 403 })
    }

    try {
        const body = await req.json()
        const user = await User.findById(id).populate('')

        const updatedUser = await User.findByIdAndUpdate(id, { $set: { ...body } }, { new: true })

        return new Response(JSON.stringify(updatedUser), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify(null), { status: 500 })
    }
}


export async function DELETE(req, ctx) {
    await connectToDB()

    const id = ctx.params.id

    const accessToken = req.headers.get('authorization')
    const token = accessToken.split(' ')[1]

    const decodedToken = verifyJwtToken(token)

    if (!accessToken || !decodedToken) {
        return new Response(JSON.stringify({ error: "unauthorized (wrong or expired token)" }), { status: 403 })
    }

    try {
        const user = await User.findById(id).populate('')

        await User.findByIdAndDelete(id)

        return new Response(JSON.stringify({msg: 'Successfully deleted user'}), {status: 200})
    } catch (error) {
        return new Response(JSON.stringify(null), { status: 500 }) 
    }
}