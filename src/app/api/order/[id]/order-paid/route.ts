import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Order } from "@/models/ordeModel";
import { getToken } from "next-auth/jwt";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.sub) return NextResponse.json({ success: false }, { status: 401 });

  const order = await Order.findById(params.id);
  if (!order || order.user.toString() !== token.sub) return NextResponse.json({ success: false, msg: "Order not found" }, { status: 404 });

  order.paymentStatus = true;
  await order.save();
  return NextResponse.json({ success: true, data: order });
}
export async function GET() {
  await connectDB();
  const orders = await Order.find({ paymentStatus: "paid" }).sort({ createdAt: -1 });
  return NextResponse.json({ success: true, data: orders });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    order.paymentStatus = "paid";
    await order.save();

    return NextResponse.json({ success: true, message: "Order marked as paid" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
