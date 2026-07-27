import Cart from "../models/Cart.js";
import Menu from "../models/Menu.js";

// Add Item to Cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { menuItemId, quantity } = req.body;

        if (!menuItemId || !quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Valid menuItemId and quantity are required"
            });
        }

       // Check if menu item exists
const menuItem = await Menu.findById(menuItemId);

if (!menuItem) {
    return res.status(404).json({
        success: false,
        message: "Menu Item Not Found"
    });
}

// Check if menu item is available
if (!menuItem.isAvailable) {
    return res.status(400).json({
        success: false,
        message: "Menu Item is currently unavailable"
    });
}

        // Find user's cart
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                items: [],
                totalPrice: 0
            });
        }

        // Check if item already exists
        const existingItem = cart.items.find(
            item => item.menuItem.toString() === menuItemId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                menuItem: menuItemId,
                quantity
            });
        }

        // Recalculate total
        let total = 0;

        for (const item of cart.items) {
            const food = await Menu.findById(item.menuItem);

            if (food) {
                total += food.price * item.quantity;
            }
        }

        cart.totalPrice = total;

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Item Added To Cart",
            cart
        });

    } catch (error) {
        console.error("Add Cart Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// Get User Cart
export const getUserCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId })
            .populate("items.menuItem");

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart Not Found"
            });
        }

        res.status(200).json({
            success: true,
            cart
        });

    } catch (error) {
        console.error("Get Cart Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// Update Cart Item
export const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { menuItemId, quantity } = req.body;

        if (!menuItemId || !quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Valid menuItemId and quantity are required"
            });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart Not Found"
            });
        }

        const item = cart.items.find(
            item => item.menuItem.toString() === menuItemId
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item Not Found In Cart"
            });
        }

        item.quantity = quantity;

        // Recalculate total
        let total = 0;

        for (const cartItem of cart.items) {
            const menu = await Menu.findById(cartItem.menuItem);

            if (menu) {
                total += menu.price * cartItem.quantity;
            }
        }

        cart.totalPrice = total;

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart Updated Successfully",
            cart
        });

    } catch (error) {
        console.error("Update Cart Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// Remove Item From Cart
export const removeCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { menuItemId } = req.body;

        if (!menuItemId) {
            return res.status(400).json({
                success: false,
                message: "menuItemId is required"
            });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart Not Found"
            });
        }

        cart.items = cart.items.filter(
            item => item.menuItem.toString() !== menuItemId
        );

        // Recalculate total
        let total = 0;

        for (const item of cart.items) {
            const menu = await Menu.findById(item.menuItem);

            if (menu) {
                total += menu.price * item.quantity;
            }
        }

        cart.totalPrice = total;

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Item Removed Successfully",
            cart
        });

    } catch (error) {
        console.error("Remove Cart Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};