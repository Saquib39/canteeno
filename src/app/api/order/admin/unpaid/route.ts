import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import connectDB from "@/lib/db";
import { Order } from "@/models/ordeModel";

export async function GET(req: NextRequest) {
  // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  // if (token?.role !== "admin")
  //   return NextResponse.json({ success:false }, { status:403 });
  await connectDB();
  const orders = await Order.find({ paymentStatus: "unpaid" })
  .sort({ createdAt: -1 })
  .populate("user", "name email");
  return NextResponse.json({ success:true, data:orders });
}
