"use client";

import { useState } from "react";
import styles from "../dashboard.module.css";

type RewardCategory = "All" | "Internal" | "Marketplace";

type Reward = {
  id: number;
  title: string;
  points: number;
  status: "ACTIVE" | "SOLD OUT";
  category: "Internal" | "Marketplace";
  description: string;
  remaining: number;
  expiry: string;
  gradientFrom: string;
  gradientTo: string;
  categoryLabel: string;
};

const rewards: Reward[] = [
  {
    id: 1,
    title: "HelloFresh Meal Kit",
    points: 500,
    status: "ACTIVE",
    category: "Marketplace",
    description: "A week of fresh, pre-portioned ingredients delivered to your door. Includes 3 recipes designed for 2 people.",
    remaining: 18,
    expiry: "31/03/2025",
    gradientFrom: "#d1fae5",
    gradientTo: "#059669",
    categoryLabel: "Food & Lifestyle",
  },
  {
    id: 2,
    title: "Charity Donation Bundle",
    points: 250,
    status: "ACTIVE",
    category: "Marketplace",
    description: "Donate your points to one of three verified environmental charities. Choose from reforestation, ocean cleanup, or biodiversity projects.",
    remaining: 99,
    expiry: "30/06/2025",
    gradientFrom: "#e0f2fe",
    gradientTo: "#0284c7",
    categoryLabel: "Giving Back",
  },
  {
    id: 3,
    title: "Annual Gym Membership",
    points: 1000,
    status: "ACTIVE",
    category: "Marketplace",
    description: "12-month access to a PureGym or David Lloyd location of your choice. Includes digital classes and fitness tracking.",
    remaining: 5,
    expiry: "28/02/2025",
    gradientFrom: "#f5f3ff",
    gradientTo: "#7c3aed",
    categoryLabel: "Fitness & Wellbeing",
  },
  {
    id: 4,
    title: "Tree Planting Pack",
    points: 150,
    status: "ACTIVE",
    category: "Internal",
    description: "Plant 10 trees in your name through Workenvo's reforestation partner. Receive a digital certificate and GPS coordinates.",
    remaining: 44,
    expiry: "31/12/2025",
    gradientFrom: "#f0fdf4",
    gradientTo: "#166534",
    categoryLabel: "Carbon Action",
  },
  {
    id: 5,
    title: "Carbon Offset Certificate",
    points: 300,
    status: "ACTIVE",
    category: "Internal",
    description: "Offset 1 tonne of CO₂ on behalf of your household. Verified through Gold Standard. Includes a shareable digital certificate.",
    remaining: 31,
    expiry: "31/12/2025",
    gradientFrom: "#fefce8",
    gradientTo: "#2D6A4F",
    categoryLabel: "Carbon Action",
  },
  {
    id: 6,
    title: "Sustainable Fashion Voucher",
    points: 750,
    status: "SOLD OUT",
    category: "Marketplace",
    description: "£75 voucher for Patagonia, Thought Clothing, or another verified B Corp fashion brand. Excludes sale items.",
    remaining: 0,
    expiry: "15/01/2025",
    gradientFrom: "#fdf4ff",
    gradientTo: "#9333ea",
    categoryLabel: "Fashion & Lifestyle",
  },
];

const FILTERS: RewardCategory[] = ["All", "Internal", "Marketplace"];

function RewardCard({ reward, delay }: { reward: Reward; delay: number }) {
  const isSoldOut = reward.status === "SOLD OUT";

  return (
    <div
      className={`animate-fade-up flex flex-col overflow-hidden rounded-[1.5rem] bg-white ${styles.ambientShadow} ${isSoldOut ? "opacity-60" : ""}`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      {/* Image area */}
      <div
        className="relative h-36 w-full"
        style={{
          background: `linear-gradient(135deg, ${reward.gradientFrom}, ${reward.gradientTo})`,
        }}
      >
        <div className="absolute inset-0 flex flex-col items-start justify-end p-4">
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur-sm">
            {reward.categoryLabel}
          </span>
        </div>
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-black text-[#3e4941]">
              SOLD OUT
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="font-bold leading-tight text-[#1c1b1b]">{reward.title}</h3>
          <span
            className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
              isSoldOut
                ? "bg-[#e5e2e1] text-[#3e4941]"
                : reward.category === "Internal"
                  ? "bg-[#dcfce7] text-[#166534]"
                  : "bg-[#fff3cd] text-[#856404]"
            }`}
          >
            {isSoldOut ? "SOLD OUT" : "ACTIVE"}
          </span>
        </div>

        {/* Points badge */}
        <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#fff3cd] px-3 py-1.5">
          <svg viewBox="0 0 16 16" width="12" height="12" fill="#856404">
            <circle cx="8" cy="8" r="7" stroke="#856404" strokeWidth="1.5" fill="none" />
            <text x="8" y="12" textAnchor="middle" fontSize="8" fontWeight="900" fill="#856404">P</text>
          </svg>
          <span className="text-xs font-black text-[#856404]">{reward.points.toLocaleString()} pts</span>
        </div>

        <p className="flex-1 text-xs leading-relaxed text-[#3e4941] line-clamp-3">
          {reward.description}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-[#f0edec] pt-3 text-[10px] text-[#3e4941]">
          <span>
            Remaining:{" "}
            <span className="font-bold text-[#1c1b1b]">{reward.remaining}</span>
          </span>
          <span>
            Expires:{" "}
            <span className="font-bold text-[#1c1b1b]">{reward.expiry}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function SustRewardsView() {
  const [filter, setFilter] = useState<RewardCategory>("All");

  const filtered =
    filter === "All" ? rewards : rewards.filter((r) => r.category === filter);

  return (
    <div className="space-y-6">
      {/* Points summary bar */}
      <div
        className={`grid grid-cols-1 gap-6 rounded-[1.5rem] p-6 md:grid-cols-3 md:p-8 ${styles.ambientShadow}`}
        style={{ backgroundColor: "#f0f7f4" }}
      >
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#3e4941]">
            Organisation Reward Pool
          </p>
          <p className="mt-1 text-3xl font-black text-[#006841]">24,800</p>
          <p className="text-sm font-semibold text-[#3e4941]">pts available</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#3e4941]">
            Rewards Redeemed This Quarter
          </p>
          <p className="mt-1 text-3xl font-black text-[#006841]">142</p>
          <p className="text-sm font-semibold text-[#3e4941]">redemptions</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#3e4941]">
            Most Popular Reward
          </p>
          <p className="mt-1 text-xl font-black text-[#1c1b1b]">Tree Planting Pack</p>
          <p className="text-sm font-semibold text-[#3e4941]">44 redemptions</p>
        </div>
      </div>

      {/* Filter row + add button */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                filter === f
                  ? "bg-[#006841] text-white"
                  : "bg-[#f6f3f2] text-[#3e4941] hover:bg-[#ebe7e7]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          className={`rounded-full bg-[#008454] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 ${styles.ambientShadow}`}
        >
          + Add Reward
        </button>
      </div>

      {/* Rewards grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((reward, i) => (
          <RewardCard key={reward.id} reward={reward} delay={i * 50} />
        ))}
      </div>
    </div>
  );
}
