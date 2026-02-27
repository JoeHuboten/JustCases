'use client';

import { useState, useEffect } from 'react';
import { FiStar, FiThumbsUp, FiEdit3, FiTrash2, FiUser, FiSend, FiCheckCircle } from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollAnimation from './ScrollAnimation';

interface Review {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  
  // Review form state
  const [showForm, setShowForm] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [productId, sortBy, page]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/reviews?productId=${productId}&sortBy=${sortBy}&page=${page}&limit=5`
      );
      
      if (!response.ok) {
        console.log('Reviews API not available, using empty state');
        setReviews([]);
        setTotalPages(0);
        setAverageRating(0);
        setTotalReviews(0);
        return;
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.log('Response is not JSON, using empty state');
        setReviews([]);
        return;
      }

      const data = await response.json();
      setReviews(data.reviews || []);
      setTotalPages(data.pagination?.pages || 0);
      setAverageRating(data.averageRating || 0);
      setTotalReviews(data.totalReviews || 0);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
      setTotalPages(0);
      setAverageRating(0);
      setTotalReviews(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError('');
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          productId,
          rating: formData.rating,
          title: formData.title.trim() || undefined,
          comment: formData.comment.trim() || undefined,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || t('product.reviews.failedSubmit', 'Неуспешно публикуване на отзива'));
      }
      
      setSubmitSuccess(true);
      setFormData({ rating: 5, title: '', comment: '' });
      setShowForm(false);
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : t('product.reviews.failedSubmit', 'Неуспешно публикуване на отзива'));
    } finally {
      setSubmitLoading(false);
    }
  };

  const renderInteractiveStars = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData({ ...formData, rating: star })}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-1 transition-transform hover:scale-110"
          >
            <FiStar
              size={28}
              className={`transition-colors ${
                star <= (hoverRating || formData.rating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-500'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };



  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            size={16}
            className={`${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {t('product.reviews.title', 'Reviews')}
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {renderStars(Math.round(averageRating ?? 0))}
              <span className="text-white font-medium">
                {(averageRating ?? 0).toFixed(1)} ({totalReviews ?? 0} {t('product.reviews', 'reviews')})
              </span>
            </div>
          </div>
        </div>
        
        {/* Write Review Button */}
        {!showForm && !submitSuccess && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <FiEdit3 size={18} />
            {t('product.reviews.writeReview', 'Write a Review')}
          </button>
        )}
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 flex items-center gap-3">
          <FiCheckCircle className="text-green-400 flex-shrink-0" size={24} />
          <div>
            <p className="text-green-400 font-medium">
              {t('product.reviews.thankYou', 'Thank you for your review!')}
            </p>
            <p className="text-green-400/70 text-sm">
              {t('product.reviews.pending', 'Your review is pending moderation and will appear shortly.')}
            </p>
          </div>
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <ScrollAnimation animation="fadeIn">
          <form 
            onSubmit={handleSubmitReview}
            className="bg-primary/40 border border-gray-700/50 rounded-2xl p-6 space-y-4"
          >
            <h4 className="text-lg font-semibold text-white mb-4">
              {t('product.reviews.shareExperience', 'Share your experience')}
            </h4>
            
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                {t('product.reviews.yourRating', 'Your Rating')} *
              </label>
              {renderInteractiveStars()}
            </div>
            
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                {t('product.reviews.reviewTitle', 'Review Title')}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={t('product.reviews.titlePlaceholder', 'Summarize your experience')}
                className="w-full px-4 py-3 bg-primary/50 border border-gray-700/50 rounded-xl text-white placeholder-text-secondary focus:outline-none focus:border-accent/50 transition-all"
                maxLength={100}
              />
            </div>
            
            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                {t('product.reviews.yourReview', 'Your Review')}
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                placeholder={t('product.reviews.commentPlaceholder', 'Tell others about your experience with this product...')}
                rows={4}
                className="w-full px-4 py-3 bg-primary/50 border border-gray-700/50 rounded-xl text-white placeholder-text-secondary focus:outline-none focus:border-accent/50 transition-all resize-none"
                maxLength={1000}
              />
              <p className="text-text-secondary text-xs mt-1">
                {formData.comment.length}/1000
              </p>
            </div>
            
            {/* Error Message */}
            {submitError && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-400 text-sm">{submitError}</p>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={submitLoading}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {submitLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('product.reviews.submitting', 'Submitting...')}
                  </>
                ) : (
                  <>
                    <FiSend size={18} />
                    {t('product.reviews.submitReview', 'Submit Review')}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setSubmitError('');
                  setFormData({ rating: 5, title: '', comment: '' });
                }}
                className="btn-ghost"
              >
                {t('common.cancel', 'Cancel')}
              </button>
            </div>
          </form>
        </ScrollAnimation>
      )}

      {/* Sort Options */}
      <div className="flex items-center gap-4">
        <span className="text-text-secondary">
          {t('product.reviews.sortBy', 'Sort by:')}
        </span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 bg-primary/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-accent/50"
        >
          <option value="newest">{t('product.reviews.newest', 'Newest')}</option>
          <option value="oldest">{t('product.reviews.oldest', 'Oldest')}</option>
          <option value="rating_high">{t('product.reviews.ratingHigh', 'Highest Rating')}</option>
          <option value="rating_low">{t('product.reviews.ratingLow', 'Lowest Rating')}</option>
          <option value="helpful">{t('product.reviews.helpful', 'Most Helpful')}</option>
        </select>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-text-secondary">
            {t('product.reviews.noReviews', 'No reviews for this product yet.')}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <ScrollAnimation key={review.id} animation="fadeIn" delay={index * 0.1}>
              <div className="bg-primary/30 border border-gray-700/50 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                      {review.user.image ? (
                        <img
                          src={review.user.image}
                          alt={review.user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <FiUser size={20} className="text-accent" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="text-white font-medium">{review.user.name}</h5>
                        {review.verified && (
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-medium">
                            ✓ {t('product.reviews.verified', 'Verified Purchase')}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-text-secondary text-sm">
                          {new Date(review.createdAt).toLocaleDateString('bg-BG')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {review.title && (
                  <h6 className="text-white font-medium mb-2">{review.title}</h6>
                )}
                
                {review.comment && (
                  <p className="text-text-secondary leading-relaxed">{review.comment}</p>
                )}

                <div className="flex items-center justify-between mt-4">
                  <button className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors">
                    <FiThumbsUp size={16} />
                    <span>{t('product.reviews.helpful', 'Helpful')} ({review.helpful})</span>
                  </button>
                </div>
              </div>
            </ScrollAnimation>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('product.reviews.previous', 'Previous')}
              </button>
              <span className="text-text-secondary">
                {t('product.reviews.page', 'Page')} {page} {t('product.reviews.of', 'of')} {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('product.reviews.next', 'Next')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
