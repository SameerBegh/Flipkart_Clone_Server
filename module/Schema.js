import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;
const productSchema = new mongoose.Schema({
  id: {
    type: String,
    require: true,
    unique: true,
  },
  url: String,
  detailUrl: String,
  title: Object,
  mrp: Number,
  cost: Number,
  priceDiscount: String,
  quantity: Number,
  stock: Number,
  description: String,
  discount: String,
  tagline: String,
  seller: String,
  star: Number,
  ratings: String,
  warranty: String,
  review: String,
  wishlist: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  CartBy: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
});

const Product = mongoose.model("product", productSchema);

export default Product;
