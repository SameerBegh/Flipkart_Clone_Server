import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const cartSchema = new mongoose.Schema({
  user_id: {
    type: ObjectId,
    ref: "User",
  },

  Cart: [
    {
      id: {
        type: String,
        require: true,
        unique: true,
      },
      productId: String,
      url: String,
      title: String,
      mrp: Number,
      cost: Number,
      priceDiscount: String,
      quantity: Number,
      stock: Number,
      discount: String,
      seller: String,
    },
  ],

  totalQuantity: Number,
  totalPrice: Number,
  totalDiscount: Number,
  totalCost: Number,
});

const CartItems = mongoose.model("cartItem", cartSchema);

export default CartItems;
