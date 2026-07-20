import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    image: {
      type: String,
      required: true
    },

    cuisine: {
      type: String,
      required: true
    },

    address: {
      type: String,
      required: true
    },

    rating: {
      type: Number,
      default: 4.5
    },

    deliveryTime: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;