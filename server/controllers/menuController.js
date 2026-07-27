import Menu from "../models/Menu.js";

// Add Menu Item
export const addMenuItem = async (req, res) => {
    try {

        const menu = await Menu.create(req.body);

        res.status(201).json({
            success: true,
            message: "Menu Item Added Successfully",
            menu
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};
// Get All Menu Items
export const getAllMenuItems = async (req, res) => {
    try {

        const menuItems = await Menu.find().populate("restaurantId", "name");

        res.status(200).json({
            success: true,
            count: menuItems.length,
            menuItems
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};
// Get Menu By Restaurant
export const getMenuByRestaurant = async (req, res) => {
    try {

        const menuItems = await Menu.find({
            restaurantId: req.params.restaurantId
        });

        res.status(200).json({
            success: true,
            count: menuItems.length,
            menuItems
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};
// Update Menu Item
export const updateMenuItem = async (req, res) => {
    try {

        const menu = await Menu.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!menu) {
            return res.status(404).json({
                success: false,
                message: "Menu Item Not Found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Menu Updated Successfully",
            menu
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};
// Delete Menu Item
export const deleteMenuItem = async (req, res) => {
    try {

        const menu = await Menu.findByIdAndDelete(req.params.id);

        if (!menu) {
            return res.status(404).json({
                success: false,
                message: "Menu Item Not Found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Menu Deleted Successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};
