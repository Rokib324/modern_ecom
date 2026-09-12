"use client";

import React from "react";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import { NEW_COMMENTS } from "./data";

interface NewCommentsProps {
  isDark: boolean;
}

export default function NewComments({ isDark }: NewCommentsProps) {
  return (
    <div
      className={`p-4 sm:p-6 rounded-2xl border shadow-sm flex flex-col justify-between ${
        isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
          New Comments
        </h2>
        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-800">
        {NEW_COMMENTS.map((c) => (
          <div key={c.id} className="pt-4 first:pt-0">
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-7 h-7 rounded-full overflow-hidden relative flex-shrink-0">
                <Image
                  src={c.avatar}
                  alt={c.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                  {c.name}
                </p>
                <div className="flex items-center text-amber-400 text-[10px] leading-none">
                  {"★".repeat(c.rating)}
                </div>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
              {c.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
