
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Menu from "../models/Menu.js";
import Coupon from "../models/Coupon.js";

// Calculate estimated delivery time based on order status
const getEstimatedDeliveryTime = (orderStatus) => {
  const minutesByStatus = {
    Pending: 45,
    Preparing: 30,
    "Out for Delivery": 15,
  };

  if (orderStatus === "Delivered") {
    return null;
  }

  const minutes = minutesByStatus[orderStatus];

  if (minutes === undefined) {
    return null;
  }

  return new Date(Date.now() + minutes * 60 * 1000);
};

// Calculate coupon discount on the server
const calculateCouponDiscount = (coupon, subtotal) => {
  let discount = 0;

  if (coupon.discountType === "percentage") {
    discount = (subtotal * coupon.discountValue) / 100;

    if (coupon.maxDiscountAmount != null) {
      discount = Math.min(discount, coupon.maxDiscountAmount);
    }
  } else if (coupon.discountType === "flat") {
    discount = coupon.discountValue;
  }

  // Never discount more than the order subtotal
  discount = Math.min(discount, subtotal);

  return Math.round(discount * 100) / 100;
};

// Place Order
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      deliveryAddress,
      paymentMethod = "COD",
      couponCode,
    } = req.body;

    if (
      typeof deliveryAddress !== "string" ||
      !deliveryAddress.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required",
      });
    }

    if (paymentMethod !== "COD") {
      return res.status(400).json({
        success: false,
        message: "Only Cash on Delivery is currently supported",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const menuIds = cart.items.map((item) => item.menuItem);

    const menuItems = await Menu.find({
      _id: { $in: menuIds },
    });

    const menuMap = new Map(
      menuItems.map((menu) => [menu._id.toString(), menu])
    );

    let subtotal = 0;

    for (const item of cart.items) {
      const menu = menuMap.get(item.menuItem.toString());

      if (!menu) {
        return res.status(400).json({
          success: false,
          message: "A menu item in your cart no longer exists",
        });
      }

      if (!menu.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `${menu.name} is currently unavailable`,
        });
      }

      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Invalid item quantity in cart",
        });
      }

      const price = Number(menu.price);

      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid price for ${menu.name}`,
        });
      }

      subtotal += price * item.quantity;
    }

    subtotal = Math.round(subtotal * 100) / 100;

    // Validate the coupon again at order placement
    let appliedCouponCode = null;
    let discountAmount = 0;

    if (couponCode != null && couponCode !== "") {
      if (typeof couponCode !== "string" || !couponCode.trim()) {
        return res.status(400).json({
          success: false,
          message: "Invalid coupon code",
        });
      }

      const normalizedCode = couponCode.trim().toUpperCase();

      const coupon = await Coupon.findOne({
        code: normalizedCode,
      });

      if (!coupon) {
        return res.status(400).json({
          success: false,
          message: "Coupon not found",
        });
      }

      if (!coupon.isActive) {
        return res.status(400).json({
          success: false,
          message: "This coupon is inactive",
        });
      }

      if (
        !coupon.expiryDate ||
        new Date(coupon.expiryDate).getTime() <= Date.now()
      ) {
        return res.status(400).json({
          success: false,
          message: "This coupon has expired",
        });
      }

      if (subtotal < Number(coupon.minOrderAmount || 0)) {
        return res.status(400).json({
          success: false,
          message: `Minimum order amount for this coupon is ₹${Number(
            coupon.minOrderAmount || 0
          ).toFixed(2)}`,
        });
      }

      if (
        !["percentage", "flat"].includes(coupon.discountType) ||
        !Number.isFinite(Number(coupon.discountValue)) ||
        Number(coupon.discountValue) <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "This coupon has an invalid discount configuration",
        });
      }

      if (
        coupon.discountType === "percentage" &&
        (Number(coupon.discountValue) > 100 ||
          (coupon.maxDiscountAmount != null &&
            (!Number.isFinite(Number(coupon.maxDiscountAmount)) ||
              Number(coupon.maxDiscountAmount) <= 0)))
      ) {
        return res.status(400).json({
          success: false,
          message: "This coupon has an invalid discount configuration",
        });
      }

      discountAmount = calculateCouponDiscount(coupon, subtotal);
      appliedCouponCode = coupon.code;
    }

    const totalAmount =
      Math.round((subtotal - discountAmount) * 100) / 100;

    const order = await Order.create({
      userId,
      items: cart.items.map((item) => ({
        menuItem: item.menuItem,
        quantity: item.quantity,
      })),
      subtotal,
      couponCode: appliedCouponCode,
      discountAmount,
      totalAmount,
      deliveryAddress: deliveryAddress.trim(),
      paymentMethod: "COD",
      orderStatus: "Pending",
      estimatedDeliveryTime: getEstimatedDeliveryTime("Pending"),
    });

    // Clear the cart after the order has been created
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Order Placed Successfully",
      order,
    });
  } catch (error) {
    console.error("Place Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get All Orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("items.menuItem", "name price");

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Order By ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email")
      .populate("items.menuItem", "name price");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const isOwner =
      order.userId._id.toString() === req.user.id.toString();

    if (req.user.role !== "admin" && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get Order By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update Order Status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const allowedStatuses = [
      "Pending",
      "Preparing",
      "Out for Delivery",
      "Delivered",
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = orderStatus;
    order.estimatedDeliveryTime =
      getEstimatedDeliveryTime(orderStatus);

    await order.save();

    // Notify only the customer who owns this order
    const io = req.app.get("io");

    if (io) {
      io.to(`user:${order.userId.toString()}`).emit(
        "orderStatusUpdated",
        {
          orderId: order._id.toString(),
          orderStatus: order.orderStatus,
          estimatedDeliveryTime: order.estimatedDeliveryTime,
          updatedAt: new Date().toISOString(),
        }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Order status and delivery estimate updated",
      order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Logged-in User Orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user.id,
    }).populate("items.menuItem", "name price image");

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
