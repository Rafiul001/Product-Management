import { createReviewApi, getReviewsByProductApi } from "@/api/reviewApi";
import { Rating } from "@/components/Icons/Ratings";
import StarPicker from "@/components/molecules/StarPicker";
import type { PopulatedProduct } from "@/components/organisms/user/ProductItem";
import ReviewCard, {
  type TPopulatedReview,
} from "@/components/organisms/user/ReviewCard";
import { useCartStore } from "@/store/cartStore";
import { useProductStore } from "@/store/productStore";
import useUserAuthStore from "@/store/userAuthStore";
import { Button, Label, Spinner, TextArea } from "@heroui/react";
import { isAxiosError } from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { useNavigate, useParams } from "react-router";

const ViewProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedProduct, getProductById } = useProductStore();
  const { addItemToCart } = useCartStore();
  const { user, isLoggedIn } = useUserAuthStore();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [qty, setQty] = useState(1);

  const handleAddToCart = async () => {
    if (!selectedProduct) return;
    setIsAdding(true);
    await addItemToCart(selectedProduct._id, qty);
    setIsAdding(false);
  };

  const handleBuyNow = () => {
    if (!selectedProduct) return;
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    const p = selectedProduct as unknown as PopulatedProduct;
    navigate("/checkout", {
      state: {
        buyNow: {
          productId: selectedProduct._id,
          quantity: qty,
          unitPrice: p.offeredPrice ?? p.price,
          productName: p.productName,
          productImage: p.productImage,
        },
      },
    });
  };

  const [reviews, setReviews] = useState<TPopulatedReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (id) getProductById(id);
  }, [id, getProductById]);

  const fetchReviews = useCallback(async () => {
    if (!id) return;
    setReviewsLoading(true);
    try {
      const res = await getReviewsByProductApi(id);
      setReviews(res.data.data);
    } catch {
      // silently fail — reviews are non-critical
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await createReviewApi({
        product: id,
        rating,
        comment: comment || undefined,
      });
      setSubmitSuccess(true);
      setComment("");
      setRating(0);
      await fetchReviews();
    } catch (err) {
      if (isAxiosError<{ message: string }>(err)) {
        const status = err.response?.status;
        if (status === 401) {
          setSubmitError("You need to be logged in to leave a review.");
        } else {
          setSubmitError(err.response?.data.message ?? "Something went wrong.");
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const product = selectedProduct as unknown as PopulatedProduct | null;

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const discount = product.offeredPrice
    ? Math.round((1 - product.offeredPrice / product.price) * 100)
    : 0;
  const displayPrice = (product.offeredPrice ?? product.price).toFixed(2);
  const isOutOfStock = product.quantity <= 0;

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-10 mb-14">
        <div className="shrink-0 w-full md:w-80 flex items-center justify-center bg-gray-50 rounded-2xl p-8 min-h-64 relative">
          {discount > 0 && product.offeredPrice && (
            <span className="absolute top-4 right-4 bg-success-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
          {product.productImage ? (
            <img
              src={product.productImage}
              alt={product.productName}
              className="max-h-64 w-full object-contain drop-shadow-lg"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-300">
              <HiOutlineShoppingCart className="w-20 h-20" />
              <span className="text-sm">No image</span>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">
              {product.subCategory?.subCategoryName}
            </p>
            <h1 className="text-2xl font-bold text-gray-800">
              {product.productName}
            </h1>
          </div>

          {avgRating !== null && (
            <div className="flex items-center gap-2">
              <Rating rating={avgRating} className="w-24" />
              <span className="text-sm text-gray-500">
                {avgRating.toFixed(1)} ({reviews.length}{" "}
                {reviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">
              ৳{displayPrice}
            </span>
            {product.offeredPrice && (
              <span className="text-lg text-gray-400 line-through">
                ৳{product.price.toFixed(2)}
              </span>
            )}
          </div>

          {isOutOfStock ? (
            <p className="text-sm font-semibold text-danger-500">
              Out of Stock
            </p>
          ) : (
            product.quantity <= product.stockLimit * 0.2 && (
              <p className="text-sm font-medium text-warning-500">
                Only {product.quantity} left in stock
              </p>
            )
          )}

          {!isOutOfStock && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 font-medium">
                Quantity
              </span>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors text-lg leading-none"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  max={product.quantity}
                  value={qty}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val))
                      setQty(Math.min(product.quantity, Math.max(1, val)));
                  }}
                  className="w-12 py-1.5 text-sm font-semibold text-gray-800 text-center border-none outline-none bg-transparent"
                />
                <button
                  type="button"
                  onClick={() =>
                    setQty((q) => Math.min(product.quantity, q + 1))
                  }
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors text-lg leading-none"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-gray-400">
                {product.quantity} available
              </span>
            </div>
          )}

          <div className="flex gap-3 mt-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
              className="flex-1 py-3 flex items-center justify-center gap-2 border border-primary-500 text-primary-600 hover:bg-primary-50 disabled:border-gray-200 disabled:text-gray-400 font-semibold text-sm rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {isAdding ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <HiOutlineShoppingCart className="w-4 h-4" />
                  {isOutOfStock ? "Unavailable" : "Add to Cart"}
                </>
              )}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="flex-1 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {isOutOfStock ? "Unavailable" : "Buy Now"}
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Customer Reviews
          {reviews.length > 0 && (
            <span className="ml-2 text-base font-normal text-gray-400">
              ({reviews.length})
            </span>
          )}
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-3">
            {reviewsLoading ? (
              <div className="flex justify-center py-8">
                <Spinner size="md" />
              </div>
            ) : reviews.length === 0 ? (
              <p className="text-gray-400 text-sm py-4">
                No reviews yet. Be the first to review!
              </p>
            ) : (
              reviews.map((review) => (
                <ReviewCard
                  key={review._id.toString()}
                  review={review}
                  isOwn={review.user._id === user._id}
                  onUpdated={fetchReviews}
                />
              ))
            )}
          </div>

          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Write a Review</h3>
            <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Your Rating</p>
                <StarPicker value={rating} onChange={setRating} />
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-sm text-gray-600">
                  Comment (optional)
                </Label>
                <TextArea
                  placeholder="Share your experience with this product..."
                  value={comment}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setComment(e.target.value)
                  }
                  maxLength={500}
                  rows={3}
                />
              </div>

              {submitError && (
                <p className="text-sm text-danger-500">{submitError}</p>
              )}
              {submitSuccess && (
                <p className="text-sm text-success-600 font-medium">
                  Review submitted successfully!
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                isDisabled={submitting}
                className="w-full"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner size="sm" />
                    Submitting...
                  </span>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
