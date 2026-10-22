import Review from "../models/Review.js";
import Menu from "../models/Menu.js";
import Order from "../models/Order.js";

// Add or update a review for a food item
export const createReview = async (req, res) => {
  try {
    const { menuItem, rating, comment = "" } = req.body;
    const userId = req.user.id;

    if (!menuItem || !rating) {
      return res.status(400).json({
        success: false,
        message: "Food item and rating are required",
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a whole number between 1 and 5",
      });
    }

    if (typeof comment !== "string" || comment.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Comment must be 1000 characters or fewer",
      });
    }

    if (!Menu.db.base.Types.ObjectId.isValid(menuItem)) {
      return res.status(400).json({
        success: false,
        message: "Invalid food item ID",
      });
    }

    const itemExists = await Menu.findById(menuItem);

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }
    // Allow reviews only for delivered orders containing this food item.
const deliveredOrder = await Order.findOne({
  userId,
  orderStatus: "Delivered",
  "items.menuItem": menuItem,
});

if (!deliveredOrder) {
  return res.status(403).json({
    success: false,
    message:
      "You can review this dish only after your order has been delivered.",
  });
}

    // Update the customer's existing review, if any.
    const review = await Review.findOneAndUpdate(
      { menuItem, userId },
      {
        rating: numericRating,
        comment: comment.trim(),
      },
      {
        new: true,
        runValidators: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Create review error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit review",
    });
  }
};

// Get reviews for a food item
export const getMenuReviews = async (req, res) => {
  try {
    const { menuItemId } = req.params;

    if (!Menu.db.base.Types.ObjectId.isValid(menuItemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid food item ID",
      });
    }

    const itemExists = await Menu.exists({ _id: menuItemId });

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    const reviews = await Review.find({ menuItem: menuItemId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews === 0
        ? 0
        : Number(
            (
              reviews.reduce((sum, review) => sum + review.rating, 0) /
              totalReviews
            ).toFixed(1)
          );

    return res.status(200).json({
      success: true,
      totalReviews,
      averageRating,
      reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};

// Delete the logged-in customer's own review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!Menu.db.base.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID",
      });
    }

    const review = await Review.findOneAndDelete({
      _id: reviewId,
      userId: req.user.id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found or you cannot delete this review",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete review",
    });
  }
};