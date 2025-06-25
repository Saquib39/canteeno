// app/api/order/create/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import {Order} from "@/models/ordeModel";
import User from "@/models/userModel";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    /* ── 1. Auth check ───────────────────────────── */
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user from DB
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    /* ── 2. Parse + validate payload ─────────────── */
    const {
      items,
      amount,
      paymentStatus,   // boolean
      deliveryMethod,  // "pickup" | "classroom"
      slot,            // "asap" | "30" | "60"
      instructions = "",
      classroom = "",
    } = (await req.json()) as {
      items: any[];
      amount: number;
      paymentStatus: boolean;
      deliveryMethod: string;
      slot: string;
      instructions?: string;
      classroom?: string;
    };

    if (!Array.isArray(items) || !items.length || !amount) {
      return NextResponse.json(
        { success: false, message: "Invalid order payload" },
        { status: 400 }
      );
    }

    /* ── 3. Create Order ─────────────────────────── */
    const order = await Order.create({
      user: user._id, // Save reference as ObjectId
      items,
      amount,
      paymentStatus: paymentStatus ? "paid" : "unpaid",
      orderStatus: "pending",
      deliveryMethod,
      slot,
      instructions,
      classroom,
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });

  } catch (err) {
    console.error("ORDER CREATE ERROR →", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
