import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const saveSchema = new mongoose.Schema({
  user_id: {
    type: ObjectId,
    ref: "User",
  },

  AddtoSave: [
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

const SaveItems = mongoose.model("saveItem", saveSchema);

export default SaveItems;
