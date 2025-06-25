// models/orderModel.ts
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // user: {
    //   type: String, // user email (from session)
    //   required: true,
    // },
     user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ This must match the name of your User model
      required: true,
    },
    items: [
      {
        foodId: String,
        name: String,
        image: String,
        price: Number,
        offerPrice: Number,
        quantity: Number,
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },
    orderStatus: {
    type: String,
    enum: ["placed","pending", "processing", "delivered", "cancelled"], // ✅ add delivered here
    default: "placed"
    },
    deliveryMethod: {
      type: String,
      enum: ["pickup", "classroom"],
      default: "pickup",
    },
    classroom: {
      type: String, // optional
    },
    slot: {
      type: String, // e.g., "asap", "30", "60"
      default: "asap",
    },
    instructions: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
