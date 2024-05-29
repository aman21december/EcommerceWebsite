const express = require("express");
const app = express.Router();
const { general } = require("./general");
const { getProducts, newProducts, getProductDetails, updateProduct, deleteProduct, createProductReview, getProductReviews, deleteReview } = require("../../controllers/v1/products/productscontroller.js");
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserProfile, updatePassword, updateProfile, allUsers, getUserDetails, updateUser, deleteUser } = require("../../controllers/v1/auth/authcontroller.js");
const { isAuthenticatedUser, authorizeRoles } = require("../../middleware/auth2.js");
const {newOrder, myOrders, getOrderDetails, allOrders, updateOrder, deleteOrder}=require("../../controllers/v1/order/ordercontroller.js")
app.route('/products').get(getProducts)
app
  .route("/admin/products")
  .post(isAuthenticatedUser,authorizeRoles("admin"),newProducts);

app.route("/products/:id").get(getProductDetails);

app
  .route("/admin/products/:id")
  .put(isAuthenticatedUser,authorizeRoles("admin"),updateProduct);
app
  .route("/admin/products/:id")
  .delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct);

  app.route("/register").post(registerUser)
  app.route("/login").post(loginUser)
  app.route("/logout").get(logout)
  app.route("/password/forgot").post(forgotPassword)
  app.route("/password/reset/:token").put(resetPassword)
  app.route("/me").get(isAuthenticatedUser,getUserProfile)
  app.route("/password/update").put(isAuthenticatedUser,updatePassword)
  app.route("/me/update").put(isAuthenticatedUser,updateProfile)
  app.route("/admin/users").get(isAuthenticatedUser,authorizeRoles("admin"),  allUsers)
  app.route("/admin/users/:id").get(isAuthenticatedUser,authorizeRoles("admin"),  getUserDetails)
  .put(isAuthenticatedUser,authorizeRoles("admin"),  updateUser)
  .delete(isAuthenticatedUser,authorizeRoles("admin"),  deleteUser)
app.route("/order/new").post(isAuthenticatedUser,newOrder)
app.route("/me/order").get(isAuthenticatedUser,myOrders)
app.route("/order/:id").get(isAuthenticatedUser,getOrderDetails)
app
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), allOrders);

app
  .route("/admin/orders/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

  app
  .route("/reviews")
  .get(isAuthenticatedUser, getProductReviews)
  .put(isAuthenticatedUser, createProductReview);

  app
  .route("/admin/reviews")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview);
//app.use("/", general);
module.exports = app;
