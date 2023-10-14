import {connectToDB} from "@/lib/database";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectToDB()

    const users = await User.find({}).populate("username");

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify(null), { status: 500 });
  }
}