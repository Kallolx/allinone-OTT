import { useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { api } from "@/lib/api";

interface Review {
  id: number;
  name: string;
  message: string;
  rating: number;
  created_at: string;
}

export default function ReviewCards() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Use the public reviews endpoint that only returns approved reviews
        const response = await api.getPublicReviews();
        setReviews(response);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const truncateMessage = (message: string, maxLength: number = 120) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold text-foreground text-center mb-6">
          What Our Users Say
        </h3>
        <div className="flex gap-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-1 h-48 bg-muted rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-foreground text-center mb-6">
        What Our Users Say
      </h3>
      
      <Swiper
        modules={[Autoplay]}
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
        }}
        loop={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={800}
        allowTouchMove={true}
        className="reviews-swiper"
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id}>
            <div className="relative group h-full">
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] h-full flex flex-col">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-20">
                  <Quote className="w-8 h-8 text-primary" />
                </div>
                
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">
                    {review.rating}/5
                  </span>
                </div>

                {/* Review Message */}
                <p className="text-foreground/90 leading-relaxed flex-1 mb-4 text-sm">
                  "{truncateMessage(review.message)}"
                </p>

                {/* User Info */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-primary/10">
                      <span className="text-sm font-semibold text-primary">
                        {review.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    
                    {/* Name and Date */}
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground text-sm">
                        {review.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Verified Badge */}
                  <div className="flex items-center gap-1 bg-primary dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <span className="text-xs text-black font-medium">Users</span>
                  </div>
                </div>
              </div>

              {/* Gradient Border Effect on Hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
