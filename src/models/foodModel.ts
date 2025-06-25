import { Schema, model, models, Types } from "mongoose";

const foodSchema = new Schema(
  {
    name:         { type: String, required: true },
    slug:         { type: String, required: true },
    image:        { type: String, required: true },
    description:  { type: String, required: true },
    price:        { type: Number, required: true },
    offerPrice:   { type: Number },
    mainCategory: { type: Types.ObjectId, ref: "MainCategory", required: true },
    subCategory:  { type: Types.ObjectId, ref: "SubCategory", required: true },
  },
  { timestamps: true }
);

// ✔️ same food name cannot repeat inside the same sub‑category
foodSchema.index({ name: 1, subCategory: 1 }, { unique: true });

export default models.Food || model("Food", foodSchema);
