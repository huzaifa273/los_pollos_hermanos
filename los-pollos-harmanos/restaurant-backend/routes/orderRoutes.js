const express = require('express');
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/')
  .get(getOrders)
  .post(createOrder);

router.route('/:id')
  .get(getOrder)
  .put(updateOrder)
  .delete(deleteOrder);

module.exports = router;