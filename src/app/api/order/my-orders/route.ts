import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Order } from "@/models/ordeModel";
import  User  from "@/models/userModel"; // 👈 import this

export async function GET(req: NextRequest) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  // ✅ Find the user by email to get their _id
  const userDoc = await User.findOne({ email: session.user.email });

  if (!userDoc) {
    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
  }

  // ✅ Now query orders using userDoc._id
  const orders = await Order.find({ user: userDoc._id })
    .sort({ createdAt: -1 })
    .populate("user", "email");

  return NextResponse.json({ success: true, data: orders });
}
