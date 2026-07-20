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