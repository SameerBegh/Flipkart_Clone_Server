import CartItems from "../module/CartSchema.js";
import SaveItems from "../module/saveSchema.js";
import Product from "../module/Schema.js";

export const addToCart = async (request, response) => {
  const { _id } = request.user;
  const {
    url,
    id,
    title,
    priceDiscount,
    cost,
    mrp,
    quantity,
    stock,
    seller,
    productId,
  } = request.body;

  const Userexist = await CartItems.findOne({ user_id: _id });
  try {
    if (Userexist) {
      const findProduct = await CartItems.findOne({
        user_id: _id,
        "Cart.id": id,
      });

      if (findProduct) {
        const { totalQuantity, totalPrice, totalDiscount, totalCost } =
          Userexist;
        const UpdateQuantity = +totalQuantity + +quantity;
        const UpdatePrice = +totalPrice + +mrp * quantity;
        const UpdateCost = +totalCost + +cost * quantity;
        const discount = mrp * quantity - cost * quantity;
        const UpdateDiscount = +totalDiscount + discount;

        const Updatecartproduct = await CartItems.findOneAndUpdate(
          { user_id: _id },
          {
            $set: {
              totalQuantity: UpdateQuantity,
              totalPrice: UpdatePrice,
              totalDiscount: UpdateDiscount,
              totalCost: UpdateCost,
            },
          },

          { returnDocument: "after" }
        );

        const updateQuantity = await CartItems.findOneAndUpdate(
          { user_id: _id, "Cart.id": id },
          {
            $inc: {
              "Cart.$.quantity": 1,
            },
          },
          { returnDocument: "after" }
        );

        return response.json({
          updateQuantity,
          Updatecartproduct,
          message: `${title} has been Saved For Later.`,
        });
      }

      // Update PriceDetails
      const { totalQuantity, totalPrice, totalDiscount, totalCost } = Userexist;
      const UpdateQuantity = +totalQuantity + +quantity;
      const UpdatePrice = +totalPrice + +mrp * quantity;
      const UpdateCost = +totalCost + +cost * quantity;
      const discount = mrp * quantity - cost * quantity;
      const UpdateDiscount = +totalDiscount + discount;

      const Updatecartproduct = await CartItems.findOneAndUpdate(
        { user_id: _id },
        {
          $set: {
            totalQuantity: UpdateQuantity,
            totalPrice: UpdatePrice,
            totalDiscount: UpdateDiscount,
            totalCost: UpdateCost,
          },
        },

        { returnDocument: "after" }
      );

      const Updatecart = await CartItems.findOneAndUpdate(
        { user_id: _id },
        {
          $push: {
            Cart: {
              url: url,
              id: id,
              title: title,
              priceDiscount: priceDiscount,
              cost: cost,
              mrp: mrp,
              quantity: quantity,
              stock: stock,
              seller: seller,
              productId: productId,
            },
          },
        },
        { returnDocument: "after" }
      );

      //Add user id to Product cart
      const addUserid = await Product.findByIdAndUpdate(
        productId,
        {
          $push: {
            CartBy: request.user._id,
          },
        },
        { returnDocument: "after" }
      );

      return response
        .status(200)
        .json({
          Updatecart,
          Updatecartproduct,
          addUserid,
          message: "UpdateCart",
        });
    } else {
      const addUserid = await Product.findByIdAndUpdate(
        productId,
        {
          $push: {
            CartBy: request.user._id,
          },
        },
        { returnDocument: "after" }
      );

      const newcart = new CartItems({
        user_id: _id,
        Cart: {
          url: url,
          id: id,
          title: title,
          priceDiscount: priceDiscount,
          cost: cost,
          mrp: mrp,
          quantity: quantity,
          stock: stock,
          seller: seller,
          productId: productId,
        },
        totalQuantity: quantity,
        totalPrice: mrp * quantity,
        totalDiscount: mrp * quantity - cost * quantity,
        totalCost: cost * quantity,
      });
      await newcart.save();
      return response
        .status(200)
        .json({ newcart, addUserid, message: "Added" });
    }
    ``;
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

export const getCart = async (request, response) => {
  const { _id } = request.user;

  try {
    const findCart = await CartItems.findOne({ user_id: _id });

    return response.status(200).json(findCart);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

export const updateIncrement = async (request, response) => {
  const { _id } = request.user;
  const { id, mrp, cost } = request.body;
  const findUserCart = await CartItems.findOne({ user_id: _id });
  try {
    if (findUserCart) {
      // $inc use for increment or decrement number
      const updateQuantity = await CartItems.findOneAndUpdate(
        { user_id: _id, "Cart.id": id },
        {
          $inc: {
            "Cart.$.quantity": 1,
          },
        },
        { returnDocument: "after" }
      );

      // Update PriceDetails
      const { totalQuantity, totalPrice, totalDiscount, totalCost } =
        findUserCart;

      const UpdateQuantity = +totalQuantity + +1;
      const UpdatePrice = +totalPrice + +mrp;
      const UpdateCost = +totalCost + +cost;
      const UpdateDiscount = +totalDiscount + (mrp - cost);

      const Updatecartproduct = await CartItems.findOneAndUpdate(
        { user_id: _id },
        {
          $set: {
            totalQuantity: UpdateQuantity,
            totalPrice: UpdatePrice,
            totalDiscount: UpdateDiscount,
            totalCost: UpdateCost,
          },
        },

        { returnDocument: "after" }
      );
      return response.status(200).json({ updateQuantity, Updatecartproduct });
    } else {
      return response.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

export const updateDecrement = async (request, response) => {
  const { _id } = request.user;
  const { id, mrp, cost } = request.body;
  const findUserCart = await CartItems.findOne({ user_id: _id });
  try {
    if (findUserCart) {
      // $inc use for increment or decrement number in mongoDb
      const updateQuantity = await CartItems.findOneAndUpdate(
        { user_id: _id, "Cart.id": id },
        {
          $inc: {
            "Cart.$.quantity": -1,
          },
        },
        { returnDocument: "after" }
      );

      // Update PriceDetails
      const { totalQuantity, totalPrice, totalDiscount, totalCost } =
        findUserCart;

      const UpdateQuantity = +totalQuantity - 1;
      const UpdatePrice = +totalPrice - +mrp;
      const UpdateCost = +totalCost - +cost;
      const UpdateDiscount = +totalDiscount - (mrp - cost);

      const Updatecartproduct = await CartItems.findOneAndUpdate(
        { user_id: _id },
        {
          $set: {
            totalQuantity: UpdateQuantity,
            totalPrice: UpdatePrice,
            totalDiscount: UpdateDiscount,
            totalCost: UpdateCost,
          },
        },

        { returnDocument: "after" }
      );
      return response.status(200).json({ updateQuantity, Updatecartproduct });
    } else {
      return response.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

export const DeleteCart = async (request, response) => {
  const { _id } = request.user;
  const { id, quantity, mrp, cost, title, productId } = request.body;
  const findUserCart = await CartItems.findOne({ user_id: _id });
  try {
    if (findUserCart) {
      const addUserid = await Product.findByIdAndUpdate(
        productId,
        {
          $pull: { CartBy: request.user._id },
        },
        { returnDocument: "after" }
      );

      const cartdelete = await CartItems.findOneAndUpdate(
        {
          user_id: _id,
          "Cart.id": id,
        },
        { $pull: { Cart: { id: { $in: [id] } } } },
        { returnDocument: "after" }
      );

      // Update PriceDetails
      const { totalQuantity, totalPrice, totalDiscount, totalCost } =
        findUserCart;

      const UpdateQuantity = +totalQuantity - quantity;
      const UpdatePrice = +totalPrice - +mrp * quantity;
      const UpdateCost = +totalCost - +cost * quantity;
      const discount = mrp * quantity - cost * quantity;
      const UpdateDiscount = +totalDiscount - discount;

      const Updatecartproduct = await CartItems.findOneAndUpdate(
        { user_id: _id },
        {
          $set: {
            totalQuantity: UpdateQuantity,
            totalPrice: UpdatePrice,
            totalDiscount: UpdateDiscount,
            totalCost: UpdateCost,
          },
        },

        { returnDocument: "after" }
      );

      return response.json({
        cartdelete,
        Updatecartproduct,
        addUserid,
        message: `Successfully removed  ${title}  from your cart.`,
      });
    } else {
      return response.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

export const clearCart = async (request, response) => {
  const { _id } = request.user;
  try {
    const ClearCart = await CartItems.findOneAndDelete({ user_id: _id });
    const addUserid = await Product.updateMany(
      {},
      {
        $pull: { CartBy: request.user._id },
      },
      { returnDocument: "after" }
    );

    return response.status(200).json({ ClearCart, addUserid });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

export const saveItem = async (request, response) => {
  const { _id } = request.user;
  const {
    url,
    id,
    title,
    priceDiscount,
    cost,
    mrp,
    quantity,
    stock,
    seller,
    productId,
  } = request.body;

  const Userexist = await SaveItems.findOne({ user_id: _id });

  try {
    if (Userexist) {
      const findProduct = await SaveItems.findOne({
        user_id: _id,
        "AddtoSave.id": id,
      });

      if (findProduct) {
        const updateQuantity = await SaveItems.findOneAndUpdate(
          { user_id: _id, "AddtoSave.id": id },
          {
            $inc: {
              "AddtoSave.$.quantity": 1,
            },
          },
          { returnDocument: "after" }
        );

        return response.json({
          updateQuantity,
          message: `${title} has been Saved For Later.`,
        });
      }

      const UpdateSave = await SaveItems.findOneAndUpdate(
        { user_id: _id },
        {
          $push: {
            AddtoSave: {
              url: url,
              id: id,
              title: title,
              priceDiscount: priceDiscount,
              cost: cost,
              mrp: mrp,
              quantity: quantity,
              stock: stock,
              seller: seller,
              productId: productId,
            },
          },
        },
        { returnDocument: "after" }
      );

      return response
        .status(200)
        .json({ UpdateSave, message: `${title} has been Saved For Later.` });
    } else {
      const newSaveItem = new SaveItems({
        user_id: _id,
        AddtoSave: {
          url: url,
          id: id,
          title: title,
          priceDiscount: priceDiscount,
          cost: cost,
          mrp: mrp,
          quantity: quantity,
          stock: stock,
          seller: seller,
          productId: productId,
        },
      });

      await newSaveItem.save();
      return response
        .status(200)
        .json({ newSaveItem, message: `${title} has been Saved For Later.` });
    }
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

export const getSave = async (request, response) => {
  const { _id } = request.user;

  try {
    const findSave = await SaveItems.findOne({ user_id: _id });
    return response.status(200).json(findSave);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

export const DeleteSave = async (request, response) => {
  const { _id } = request.user;
  const { id, title } = request.body;
  const findUserCart = await SaveItems.findOne({ user_id: _id });
  try {
    if (findUserCart) {
      const savedelete = await SaveItems.findOneAndUpdate(
        {
          user_id: _id,
          "AddtoSave.id": id,
        },
        { $pull: { AddtoSave: { id: { $in: [id] } } } },
        { returnDocument: "after" }
      );

      return response.json({
        savedelete,
        message: `${title} has been removed from your saved list.`,
      });
    } else {
      return response.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};
