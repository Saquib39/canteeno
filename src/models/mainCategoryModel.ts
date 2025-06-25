
import mongoose from "mongoose";

const mainCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

const MainCategory =
  mongoose.models.MainCategory ||
  mongoose.model("MainCategory", mainCategorySchema);

export default MainCategory;
