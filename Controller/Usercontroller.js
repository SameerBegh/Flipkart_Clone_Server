import User from "../module/userSchema.js";
import bcrypt from "bcrypt";
import AddAddress from "../module/address.js";
import jwt from "jsonwebtoken";
import CartItems from "../module/CartSchema.js";
import SaveItems from "../module/saveSchema.js";
import Wishlist from "../module/WishlistSchema.js";
import Product from "../module/Schema.js";


export const userSignup = async (request, response) => {
  const { Name, Password, Mobile, Email } = request.body;
  try {
    // if user already exist
    const exist = await User.findOne({
      $or: [{ Name: Name }, { Mobile: Mobile }],
    });

    if (exist) {
      return response
        .status(422)
        .json({ error: "You are already Signup. Please login" });
    }

    // Hashing Password
    const hashedPassword = await bcrypt.hash(Password, 12);

    const newUser = new User({ Name, Password: hashedPassword, Mobile, Email });

    await newUser.save();

    response.status(201).json({ newUser, message: "Signup Successfully" });
  } catch (error) {
    response.status(500).json(error.response);
  }
};

export const userlogin = async (request, response) => {
  try {
    const { Name, Password } = request.body;
    if (!Name || !Password) {
      return response
        .status(400)
        .json({ error: "Please enter User Name & Password" });
    }

    const user = await User.findOne({ Name: Name });

    if (user) {
      // verify Password with hashing Password
      const isMatch = await bcrypt.compare(Password, user.Password);

      if (isMatch) {
        //  Generate JWT
        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);

        //  To excluding password from the User & mongoose return unneccessary {}data to avoid converting into json-form
        const { Password, ...USER } = Object.assign({}, user.toJSON());
        return response
          .status(200)
          .json({ token, USER, message: "Login Successfully" });
      } else {
        return response
          .status(401)
          .json({ error: "Authentication failure: Invalid Password " });
      }
    } else {
      return response
        .status(404)
        .json({ error: "Authentication failure: Invalid User name " });
    }
  } catch (error) {
    return response.status(500).json(error.response);
  }
};

export const updateProfile = async (request, response) => {
  const { Name, Email, Mobile, Gender } = request.body;
  const { _id } = request.user;

  try {
    if (_id) {
      const findUser = await User.findOneAndUpdate(
        { _id: _id },
        {
          $set: {
            Name: Name,
            Mobile: Mobile,
            Email: Email,
            Gender: Gender,
          },
        },
        { returnDocument: "after" }
      );
       //  To excluding password from the User & mongoose return unneccessary {}data to avoid converting into json-form
       const { Password, ...Profile } = Object.assign({}, findUser.toJSON());
      return response
        .status(200)
        .json({ Profile, message: "Profile Saved Successfully" });
    } else {
      return response.status(401).json({ message: "User not Found" });
    }
  } catch (error) {
    return response.status(500).json(error);
  }
};

export const addAddress = async (request, response) => {
  const {
    Name,
    Mobile,
    Pincode,
    Landmark,
    City,
    Address,
    AddressType,
    Locality,
    State,
    Phone,
  } = request.body;
  const { _id } = request.user;

  const data = await AddAddress.findOne({ user_id: _id });

  try {
    if (data) {
      const addnewAddress = await AddAddress.findOneAndUpdate(
        { user_id: _id },
        {
          $push: {
            addAddress: {
              Name: Name,
              Mobile: Mobile,
              Pincode: Pincode,
              Landmark: Landmark,
              City: City,
              Address: Address,
              AddressType: AddressType,
              Locality: Locality,
              State: State,
              Phone: Phone,
            },
          },
        },
        { returnDocument: "after" }
      );

      response.status(201).json(addnewAddress);
    } else {
      const newAddress = new AddAddress({
        user_id: _id,
        addAddress: {
          Name: Name,
          Mobile: Mobile,
          Pincode: Pincode,
          Landmark: Landmark,
          City: City,
          Address: Address,
          AddressType: AddressType,
          Locality: Locality,
          State: State,
          Phone: Phone,
        },
      });
      await newAddress.save();
      response.status(201).json(newAddress);
    }
  } catch (error) {
    response.status(500).json(error.message);
  }
};

export const getAddress = async (request, response) => {
  const { _id } = request.user;
  try {
    const getAddress = await AddAddress.findOne({ user_id: _id });
    return response.status(200).json(getAddress);
  } catch (error) {
    return response.status(500).json(error.response);
  }
};

export const deleteAddress = async (request, response) => {
  const { _id } = request.user;
  const id = request.params.id;

  const data = await AddAddress.findOne({ user_id: _id });
  // response.json(data)
  try {
    if (data) {
      const addressUpdate = await AddAddress.findOneAndUpdate(
        {
          user_id: _id,
          "addAddress._id": id,
        },
        { $pull: { addAddress: { _id: { $in: [id] } } } },
        { returnDocument: "after" }
      );

      response
        .status(201)
        .json({ addressUpdate, message: "Address Deleted Successfully" });
    } else {
      return response.status(422).json({ message: "Something went to wrong" });
    }
  } catch (error) {
    response.status(500).json({
      message: "There was an error deleting the Address",
      error: error,
    });
  }
};

export const deactiveAccount = async (request, response) => {
  const { _id } = request.user; // {from Authentication}
  const findUser = await User.findOne({ _id: _id });

  try {
    if (findUser) {
      const isMatch = await bcrypt.compare(
        request.params.password,
        findUser.Password
      );
      if (isMatch) {
        const findCart = await CartItems.findOneAndDelete({ user_id: _id });
        const data = await AddAddress.findOneAndDelete({ user_id: _id });
        const Userexist = await SaveItems.findOneAndDelete({ user_id: _id });
        const datawish = await Wishlist.findOneAndDelete({ user_id: _id });
        const addUserid = await Product.updateMany(
          {},
          {
            $pull: { CartBy: request.user._id },
          },
          { returnDocument: "after" }
        );
        const wishItem = await Product.updateMany(
          {},
          {
            $pull: { wishlist: request.user._id },
          }
        );

        const user = await User.findOneAndDelete({ _id: findUser._id });

     
        return response.status(200).json({ 
          findCart,
          findUser,
          data,
          Userexist,
          datawish,
          addUserid,
          wishItem,
          user,
          message: "Account Deactivated Successfully",
        });
      } else {
        return response
          .status(401)
          .json({ error: "Authentication failure: Invalid Password " });
      }
    } else {
      return response.status(404).json({ error: "Invalid User" });
    }
  } catch (error) {
    return response.status(500).json({
      message: "There was an error deleting the Address",
      error: error,
    });
  }
};
