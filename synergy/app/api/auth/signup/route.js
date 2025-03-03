import dbConnect from "../../../lib_app/mongodb";
import User from "../../../lib_app/userModel";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json(); // Expect `name`, `email`, `password`

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
    }

    await dbConnect();

    const existingUser = await User.findOne({ email }); // Check by `email`
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    return new Response(JSON.stringify({ message: "User created", user: newUser }), { status: 201 });
  } catch (error) {
    console.error("Signup Error:", error); // Log the error
    return new Response(JSON.stringify({ error: "Error signing up" }), { status: 500 });
  }
}
