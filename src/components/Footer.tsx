import { useState } from "react";
import { Star, Send } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import ReviewCards from "./ReviewCards";

const CONTACTS = [
  {
    label: "Facebook Group",
    url: "https://www.facebook.com/groups/782756980483108/",
    icon: "/icons/fb.png",
    description: "Join our community",
    bgColor: "bg-white",
  },
  {
    label: "Telegram",
    url: "https://t.me/+qx3HtQnFiUk0OWI1",
    icon: "/icons/tele.png",
    description: "Instant updates",
    bgColor: "bg-white",
  },
  {
    label: "WhatsApp",
    url: "https://wa.me/8801998570766",
    icon: "/icons/whatsapp.png",
    description: "+880 1998-570766",
    bgColor: "bg-white",
  },
  {
    label: "Messenger",
    url: "https://m.me/61558319146658",
    icon: "/icons/messenger.png",
    description: "Quick support",
    bgColor: "bg-white",
  },
  {
    label: "YouTube",
    url: "https://www.youtube.com/@AllInOneOTT.official",
    icon: "/icons/youtube.png",
    description: "Watch tutorials",
    bgColor: "bg-white",
  },
  {
    label: "Facebook Page",
    url: "https://www.facebook.com/allinone5080/",
    icon: "/icons/fb.png",
    description: "Watch tutorials",
    bgColor: "bg-white",
  },
];

export default function AppFooter() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [stars, setStars] = useState(0);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (stars === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user data
      const userData = JSON.parse(localStorage.getItem("user") || "{}");

      await api.submitFeedback({
        name,
        email: email || undefined,
        message,
        rating: stars,
        username: userData.username || undefined,
      });

      // Reset form
      setName("");
      setMessage("");
      setStars(0);
      setEmail("");

      toast({
        title: "Thank you!",
        description:
          "Your feedback has been submitted successfully. We appreciate your review!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Brand Section - Center Aligned */}
        <div className="text-center mb-12">
          {/* Logo Image */}
          <div className="flex justify-center mb-4">
            <img
              src="/logo.png"
              alt="All in One OTT Logo"
              className="h-24 w-auto md:h-32 drop-shadow-lg"
              style={{ objectFit: 'contain' }}
            />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            All in One OTT
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Your ultimate destination for movies, TV shows, live TV, and sports
            streaming.
            <br className="hidden sm:block" />
            Experience entertainment like never before.
          </p>
          {/* Social Media Buttons with PNG icons */}
          <div className="flex justify-center gap-6 flex-wrap">
            {CONTACTS.map((contact) => (
              <a
                key={contact.label}
                href={contact.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group w-28
        border border-border rounded-xl p-2
        sm:border-none sm:rounded-none sm:p-0"
                title={`${contact.label} - ${contact.description}`}
              >
                <div className="w-16 h-16 flex items-center justify-center mx-auto">
                  <img
                    src={contact.icon}
                    alt={contact.label}
                    className="w-14 h-14 object-contain transition-all duration-300 hover:scale-110"
                  />
                </div>
                <span className="text-base font-semibold text-foreground group-hover:text-primary transition text-center break-words w-full">
                  {contact.label}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Review Section */}
        <div className="pt-8 border-t border-border">
          {/* Display existing reviews */}
          <ReviewCards />
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-foreground text-center mb-6">
              Share Your Experience
            </h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="px-4 py-3 rounded-lg border border-border bg-input/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email (optional)"
                  className="px-4 py-3 rounded-lg border border-border bg-input/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <textarea
                placeholder="Tell us about your experience with All in One OTT..."
                className="w-full px-4 py-3 rounded-lg border border-border bg-input/50 text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">
                    Rate your experience:
                  </span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setStars(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            star <= stars
                              ? "text-yellow-400"
                              : "text-muted-foreground hover:text-yellow-300"
                          }`}
                          fill={star <= stars ? "#facc15" : "none"}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}
