// src/models/userModel.ts
import mongoose, { Schema, Document, models } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  name?: string;
  email: string;
  password: string;
  role?: "user" | "admin";  // <- add this
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }
  },
  { timestamps: true }
);

// hash password before save
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default models.User || mongoose.model<IUser>("User", userSchema);
