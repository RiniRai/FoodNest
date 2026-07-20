import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {

    try {

        const { name, email, phone, password } = req.body;

        // Check all fields
        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }

        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword
});

res.status(201).json({
    success: true,
    message: "User Registered Successfully",
    user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
    }
});
    } catch (error) {

        console.log("Registered Error:",error);

        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });

    }

};
export const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });

    } catch (error) {

        console.error("Login Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};
