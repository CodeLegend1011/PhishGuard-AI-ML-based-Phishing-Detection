import dbConnect from "../../../lib_app/mongodb";
import User from "../../../lib_app/userModel";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { email, password } = await req.json(); // ✅ Use email instead of username
    await dbConnect();

    const user = await User.findOne({ email }); // ✅ Search by email
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
    }

    return new Response(JSON.stringify({ message: "Login successful", user }), { status: 200 });
  } catch (error) {
    console.error("🔥 Login API Error:", error);
    return new Response(JSON.stringify({ error: "Error logging in" }), { status: 500 });
  }
}
