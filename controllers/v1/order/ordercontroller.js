const Product=require("../../../models/product.js");
const Order = require ("../../../models/order.js");
const { ErrorHandler } = require("../../../helper/error-handler.js");

// Create new Order  =>  /api/v1/orders/new
const newOrder = async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
    user: req.user._id,
  });

  res.status(200).json({
    order,
  });
};

 const myOrders = async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });
  
    res.status(200).json({
      orders,
    });
  };

  const getOrderDetails = async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
  
    if (!order) {
      return next(new ErrorHandler(404,"No Order found with this ID"));
    }
  
    res.status(200).json({
      order,
    });
  };

  // Get all orders - ADMIN  =>  /api/v1/admin/orders
const allOrders = async (req, res, next) => {
  const orders = await Order.find();

  res.status(200).json({
    orders,
  });
};

// Update Order - ADMIN  =>  /api/v1/admin/orders/:id
const updateOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler(404,"No Order found with this ID"));
  }

  if (order?.orderStatus === "Delivered") {
    return next(new ErrorHandler(400,"You have already delivered this order"));
  }

  // Update products stock
  order?.orderItems?.forEach(async (item) => {
    const product = await Product.findById(item?.product?.toString());
    if (!product) {
      return next(new ErrorHandler(404,"No Product found with this ID"));
    }
    product.stock = product.stock - item.quantity;
    await product.save({ validateBeforeSave: false });
  });

  order.orderStatus = req.body.status;
  order.deliveredAt = Date.now();

  await order.save();

  res.status(200).json({
    success: true,
  });
}

// Delete order  =>  /api/v1/admin/orders/:id
 const deleteOrder =async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler(404,"No Order found with this ID"));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
  });
}

module.exports={newOrder,myOrders,getOrderDetails,allOrders,updateOrder,deleteOrder}