import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Order } from "@/models/ordeModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const { status } = await req.json();
  const order = await Order.findById(params.id);
  if (!order) {
    return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
  }

  order.orderStatus = status;
  await order.save();

  return NextResponse.json({ success: true, data: order });
}


export async function GET(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const orders = await Order.find({ paymentStatus: "unpaid" }).sort({
    createdAt: -1,
  });

  return NextResponse.json({ success: true, data: orders });
}
