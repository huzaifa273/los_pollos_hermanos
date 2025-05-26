const Order = require('../models/Order');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all orders
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single order
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new order
exports.createOrder = async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  try {
    const order = await Order.create(req.body);
    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update order
exports.updateOrder = async (req, res, next) => {
  try {
    let order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
    }
    // Make sure user is order owner
    if (order.user.toString() !== req.user.id) {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this order`, 401));
    }
    order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete order
exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
    }
    // Make sure user is order owner
    if (order.user.toString() !== req.user.id) {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this order`, 401));
    }
    await order.remove();
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};