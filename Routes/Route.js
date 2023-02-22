import express from "express";
import {
  userSignup,
  userlogin,
  addAddress,
  getAddress,
  deleteAddress,
  updateProfile,
  deactiveAccount,
} from "../Controller/Usercontroller.js";
import {
  getProducts,
  getProductByid,
  wishlistByidTrue,
  wishlistByidFalse,
  addWishlist,
  removeWishlist,
  getwishlist,
} from "../Controller/ProductController.js";
import {
  addpaymentGateway,
  paymentresponse,
} from "../Controller/paymentController.js";
import Authentication from "../Middleware/Authentication.js";
import {
  addToCart,
  getCart,
  updateIncrement,
  updateDecrement,
  DeleteCart,
  saveItem,
  getSave,
  DeleteSave,
  clearCart,
} from "../Controller/CartController.js";

const router = express.Router();

// Post Api
router.post("/signup", userSignup);
router.post("/login", userlogin);
router.post("/payment", addpaymentGateway);
router.post("/callback", paymentresponse);
router.post("/address", Authentication, addAddress);
router.post("/wishlist", Authentication, addWishlist);
router.post("/cart", Authentication, addToCart);
router.post("/save", Authentication, saveItem);

// Get Api
router.get("/products", getProducts);
router.get("/product/:id", getProductByid);
router.get("/address", Authentication, getAddress);
router.get("/wishlistproduct", Authentication, getwishlist);
router.get("/cart", Authentication, getCart);
router.get("/save", Authentication, getSave);

// Put/Update Api
router.put("/like", Authentication, wishlistByidTrue);
router.put("/unlike", Authentication, wishlistByidFalse);
router.put("/update/Profile", Authentication, updateProfile);
router.put("/cartIncrement", Authentication, updateIncrement);
router.put("/cartDecrement", Authentication, updateDecrement);
router.put("/UpdateCart", Authentication, DeleteCart);
router.put("/UpdateSave", Authentication, DeleteSave);

// delete Api
router.delete("/deleteAddress/:id", Authentication, deleteAddress);
router.delete("/removeWishlist/:id", Authentication, removeWishlist);
router.delete("/deactivate/:password", Authentication, deactiveAccount);
router.delete("/clearCart", Authentication, clearCart);

export default router;
