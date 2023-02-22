import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const wishlistSchema = new mongoose.Schema({
  user_id: {
    type: ObjectId,
    ref: "User",
  },

  wish: [
    {
      type: Object,
      require: true,
    },
  ],
});

const Wishlist = mongoose.model("wishlist", wishlistSchema);

export default Wishlist;
