import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  const options = {
    amount: body.amount * 100, // ₹ -> paise
    currency: "INR",
    receipt: `receipt_order_${Math.random() * 1000}`,
  };

  try {
    const response = await razorpay.orders.create(options);
    return NextResponse.json(response);
  } catch (err) {
    return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
  }
}
