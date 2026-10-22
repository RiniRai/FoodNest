import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
    {
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        image: {
            type: String,
            required: true
        },
isAvailable: {
    type: Boolean,
    default: true
},

// Discount settings
isDiscounted: {
    type: Boolean,
    default: false
},

discountPrice: {
    type: Number,
    min: 0
},

offerStartDate: {
    type: Date
},

offerEndDate: {
    type: Date
}
    },
    {
        timestamps: true
    }
);

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;