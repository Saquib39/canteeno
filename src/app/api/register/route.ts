import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/userModel";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  await connectDB();
  const exists = await User.findOne({ email });
  if (exists) return NextResponse.json({ error: "User exists" }, { status: 409 });

  await User.create({ name, email, password });
  return NextResponse.json({ success: true }, { status: 201 });
}
