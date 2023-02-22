import Product from "../module/Schema.js";
import User from "../module/userSchema.js";
import Wishlist from "../module/WishlistSchema.js";

export const getProducts = async (request, response) => {
  try {
    const products = await Product.find({}); //empty {obj} for get all data;
    response.status(200).json(products);
  } catch (error) {
    response.status(500).json(error.message);
  }
};

export const getProductByid = async (request, response) => {
  try {
    const id = request.params.id;
    const product = await Product.findOne({ id: id });
    response.status(200).json(product);
  } catch (error) {
    response.status(500).json(error.message);
  }
};

export const wishlistByidTrue = async (request, response) => {
  const { _id } = request.user;
  const findUser = await User.findOne({ _id: _id });

  try {
    if (findUser) {
      const wishItem = await Product.findByIdAndUpdate(request.body.productId, {
        $push: { wishlist: request.user._id },
      });
      return response.status(200).json(wishItem);
    } else {
      response.status(404).json({ error: "Not found" });
    }
  } catch (error) {
    return response.status(500).json(error);
  }
};
export const wishlistByidFalse = async (request, response) => {
  try {
    const wishItem = await Product.findByIdAndUpdate(request.body.productId, {
      $pull: { wishlist: request.user._id },
    });
    return response.status(200).json(wishItem);
  } catch (error) {
    return response.status(500).json(error.message);
  }
};

export const addWishlist = async (request, response) => {
  const { _id } = request.user;
  const id = request.body.id;

  const data = await Wishlist.findOne({ user_id: _id });

  try {
    const getProduct = await Product.findOne({ id: id });
    if (data) {
      const newWishlist = await Wishlist.findOneAndUpdate(
        { user_id: _id },
        { $push: { wish: getProduct } },
        { returnDocument: "after" }
      );
      return response
        .status(200)
        .json({ newWishlist, message: "Added to your Wishlist" });
    } else {
      const newWishlist = new Wishlist({ user_id: _id, wish: getProduct });
      await newWishlist.save();
      return response.status(200).json(newWishlist);
    }
  } catch (error) {
    return response.status(500).json(error.message);
  }
};

export const removeWishlist = async (request, response) => {
  const { _id } = request.user;
  const id = request.params.id;

  const data = await Wishlist.findOne({ user_id: _id });

  try {
    if (data) {
      const newAddwish = await Wishlist.findOneAndUpdate(
        { user_id: _id, "wish.id": id },
        { $pull: { wish: { id: { $in: [id] } } } },
        { returnDocument: "after" }
      );

      return response
        .status(201)
        .json({ newAddwish, message: "Removed from your Wishlist" });
    } else {
      return response.status(422).json({ message: "Something went to wrong" });
    }
  } catch (error) {
    return response.status(500).json(error.message);
  }
};

export const getwishlist = async (request, response) => {
  const { _id } = request.user;
  try {
    const getwishlist = await Wishlist.findOne({ user_id: _id });
    return response.status(200).json(getwishlist);
  } catch (error) {
    return response.status(500).json(error.message);
  }
};
