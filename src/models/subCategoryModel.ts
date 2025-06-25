import mongoose, { Types } from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    image: { type: String, required: true },
    // reference to parent main category
    mainCategory: { type: Types.ObjectId, ref: "MainCategory", required: true },
  },
  { timestamps: true }
);

// 🔐 unique combination → no dup name inside same main category
subCategorySchema.index({ name: 1, mainCategory: 1 }, { unique: true });

const SubCategory =
  mongoose.models.SubCategory ||
  mongoose.model("SubCategory", subCategorySchema);

export default SubCategory;
