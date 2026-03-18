"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  sellerId: string;
  listingId?: string;
  listingTitle?: string;
  rating: number;          // 1–5
  comment: string;
  tags: string[];          // quick-pick tags like "Fast replies", "Item as described"
  sellerReply?: string;
  createdAt: Date;
  helpful: number;         // upvotes
  helpfulVoters: string[]; // reviewer ids who clicked helpful
}

export interface ReviewStats {
  average: number;
  total: number;
  breakdown: Record<1 | 2 | 3 | 4 | 5, number>; // count per star
}

interface ReviewContextType {
  reviews: Review[];
  getSellerReviews: (sellerId: string) => Review[];
  getSellerStats: (sellerId: string) => ReviewStats;
  addReview: (r: Omit<Review, "id" | "createdAt" | "helpful" | "helpfulVoters">) => void;
  addReply: (reviewId: string, reply: string) => void;
  voteHelpful: (reviewId: string, userId: string) => void;
  canReview: (reviewerId: string, sellerId: string) => boolean;
}

const Ctx = createContext<ReviewContextType | null>(null);
const KEY = "p2p_reviews_v1";

// ── Seed mock data ────────────────────────────────────────────────────────────
const SEED: Review[] = [
  {
    id: "r1", reviewerId: "user-2", reviewerName: "Maria Santos",
    sellerId: "current-user", listingId: "s1", listingTitle: "Casio G-Shock GA-2100",
    rating: 5, comment: "Legit seller! Item was exactly as described. Very fast to respond and accommodating. Met up at SM and everything went smoothly. Highly recommended!",
    tags: ["Item as described", "Fast replies", "Smooth transaction"],
    helpful: 4, helpfulVoters: ["u3", "u4", "u5", "u6"],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "r2", reviewerId: "user-3", reviewerName: "Pedro Reyes",
    sellerId: "current-user", listingId: "s2", listingTitle: "MacBook Pro M1 2022",
    rating: 5, comment: "Sobrang bait ng seller. Nagbigay pa ng charger at accessories na hindi naka-list. MacBook works perfectly. 10/10 would transact again!",
    tags: ["Item as described", "Above & beyond", "Trusted seller"],
    helpful: 7, helpfulVoters: ["u1", "u2", "u3", "u4", "u5", "u6", "u7"],
    sellerReply: "Thanks Pedro! Hope you enjoy the MacBook. Feel free to message me if you have questions. 😊",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "r3", reviewerId: "user-4", reviewerName: "Ana Reyes",
    sellerId: "current-user", listingId: "s3", listingTitle: "Honda Click 125",
    rating: 4, comment: "Good condition yung scooter. Minor scratches lang pero as expected for the price. Seller was honest about it upfront. Transaction was smooth.",
    tags: ["Fast replies", "Smooth transaction"],
    helpful: 2, helpfulVoters: ["u1", "u2"],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: "r4", reviewerId: "user-5", reviewerName: "Carlos Mendoza",
    sellerId: "current-user", listingId: "s1", listingTitle: "Casio G-Shock GA-2100",
    rating: 5, comment: "Very responsive seller. Madaling kausap. Watch was brand new looking. Will definitely come back for future purchases.",
    tags: ["Fast replies", "Item as described"],
    helpful: 1, helpfulVoters: ["u1"],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: "r5", reviewerId: "user-6", reviewerName: "Lisa Fernandez",
    sellerId: "current-user",
    rating: 3, comment: "Item was okay but took a bit long to respond. Eventual transaction was fine. Price was negotiable which was nice.",
    tags: ["Smooth transaction"],
    helpful: 0, helpfulVoters: [],
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
  },
];

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        setReviews(JSON.parse(raw).map((r: Review) => ({ ...r, createdAt: new Date(r.createdAt) })));
      } else {
        setReviews(SEED);
      }
    } catch {
      setReviews(SEED);
    }
  }, []);

  useEffect(() => {
    if (reviews.length > 0) localStorage.setItem(KEY, JSON.stringify(reviews));
  }, [reviews]);

  const getSellerReviews = useCallback((sellerId: string) =>
    reviews.filter((r) => r.sellerId === sellerId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    [reviews]
  );

  const getSellerStats = useCallback((sellerId: string): ReviewStats => {
    const sr = reviews.filter((r) => r.sellerId === sellerId);
    if (sr.length === 0) return { average: 0, total: 0, breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1|2|3|4|5, number>;
    sr.forEach((r) => { breakdown[r.rating as 1|2|3|4|5]++; });
    return {
      average: sr.reduce((s, r) => s + r.rating, 0) / sr.length,
      total: sr.length,
      breakdown,
    };
  }, [reviews]);

  const addReview = useCallback((r: Omit<Review, "id" | "createdAt" | "helpful" | "helpfulVoters">) => {
    setReviews((prev) => [{ ...r, id: `r-${Date.now()}`, createdAt: new Date(), helpful: 0, helpfulVoters: [] }, ...prev]);
  }, []);

  const addReply = useCallback((reviewId: string, reply: string) => {
    setReviews((prev) => prev.map((r) => r.id === reviewId ? { ...r, sellerReply: reply } : r));
  }, []);

  const voteHelpful = useCallback((reviewId: string, userId: string) => {
    setReviews((prev) => prev.map((r) => {
      if (r.id !== reviewId) return r;
      const voted = r.helpfulVoters.includes(userId);
      return {
        ...r,
        helpful: voted ? r.helpful - 1 : r.helpful + 1,
        helpfulVoters: voted ? r.helpfulVoters.filter((id) => id !== userId) : [...r.helpfulVoters, userId],
      };
    }));
  }, []);

  // One review per reviewer per seller
  const canReview = useCallback((reviewerId: string, sellerId: string) =>
    !reviews.some((r) => r.reviewerId === reviewerId && r.sellerId === sellerId),
    [reviews]
  );

  return (
    <Ctx.Provider value={{ reviews, getSellerReviews, getSellerStats, addReview, addReply, voteHelpful, canReview }}>
      {children}
    </Ctx.Provider>
  );
}

export function useReviews() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useReviews must be used within ReviewProvider");
  return ctx;
}
