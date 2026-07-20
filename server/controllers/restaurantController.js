import Restaurant from "../models/Restaurant.js";

// Add Restaurant
export const addRestaurant = async (req, res) => {

    try {

        const restaurant = await Restaurant.create(req.body);

        res.status(201).json({
            success: true,
            message: "Restaurant Added Successfully",
            restaurant
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};
// Get All Restaurants
export const getRestaurants = async (req, res) => {
    try {

        const restaurants = await Restaurant.find();

        res.status(200).json({
            success: true,
            count: restaurants.length,
            restaurants
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};
// Get Restaurant By ID
export const getRestaurantById = async (req, res) => {
    try {

        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }

        res.status(200).json({
            success: true,
            restaurant
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};
// Update Restaurant
export const updateRestaurant = async (req, res) => {
    try {

        const restaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Restaurant Updated Successfully",
            restaurant
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};
// Delete Restaurant
export const deleteRestaurant = async (req, res) => {
    try {

        const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Restaurant Deleted Successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};
