"use client";

import React, { useEffect, useCallback } from "react";

export interface LightboxItem {
  id: string | number;
  image: string;
  videoUrl?: string | null;
  isVideo?: boolean;
}

interface CleanPortfolioLightboxProps {
  items: LightboxItem[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

// Helper to extract YouTube Video ID from any YouTube URL format
function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    // Pattern for youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
    const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
    const match = url.match(regExp);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    }
  } catch {
    // Fallback if parsing fails
  }
  return null;
}

export default function CleanPortfolioLightbox({
  items,
  currentIndex,
  onClose,
  onNavigate,
}: CleanPortfolioLightboxProps) {
  const isOpen = currentIndex !== null && currentIndex >= 0 && currentIndex < items.length;
  const currentItem = isOpen ? items[currentIndex] : null;

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (currentIndex === null || items.length === 0) return;
      const prevIdx = (currentIndex - 1 + items.length) % items.length;
      onNavigate(prevIdx);
    },
    [currentIndex, items.length, onNavigate]
  );

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (currentIndex === null || items.length === 0) return;
      const nextIdx = (currentIndex + 1) % items.length;
      onNavigate(nextIdx);
    },
    [currentIndex, items.length, onNavigate]
  );

  // Keyboard navigation: Escape to close, ArrowLeft/ArrowRight to navigate
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Lock background page scroll while lightbox is active
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handlePrev, handleNext, onClose]);

  if (!isOpen || !currentItem) return null;

  const isVideoItem = Boolean(currentItem.isVideo || currentItem.videoUrl);
  const ytEmbedUrl = currentItem.videoUrl ? getYouTubeEmbedUrl(currentItem.videoUrl) : null;

  return (
    <div
      className="clean-lightbox-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Clean portfolio viewer"
    >
      {/* Top-Right Minimal Close Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="clean-lightbox-close"
        aria-label="Close viewer"
        title="Close (Esc)"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Navigation Arrow: Previous (←) */}
      {items.length > 1 && (
        <button
          type="button"
          onClick={handlePrev}
          className="clean-lightbox-nav clean-nav-prev"
          aria-label="Previous work"
          title="Previous (Left Arrow)"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* Navigation Arrow: Next (→) */}
      {items.length > 1 && (
        <button
          type="button"
          onClick={handleNext}
          className="clean-lightbox-nav clean-nav-next"
          aria-label="Next work"
          title="Next (Right Arrow)"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Media Presentation Container */}
      <div
        className="clean-lightbox-content"
        onClick={(e) => e.stopPropagation()}
      >
        {isVideoItem ? (
          /* Video Popup Player: YouTube Iframe or Video Player */
          <div className="clean-lightbox-video-frame">
            {ytEmbedUrl ? (
              <iframe
                src={ytEmbedUrl}
                title="Commercial Video Showcase"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="clean-lightbox-iframe"
              />
            ) : currentItem.videoUrl ? (
              <video
                src={currentItem.videoUrl}
                controls
                autoPlay
                playsInline
                className="clean-lightbox-direct-video"
              />
            ) : (
              /* Fallback if no specific video URL provided yet: High-res freeze frame */
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentItem.image}
                alt="Clean Design View"
                className="clean-lightbox-img"
              />
            )}
          </div>
        ) : (
          /* Clean Image Display: 100% pure image, zero text */
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={currentItem.id}
            src={currentItem.image}
            alt="Clean Design View"
            className="clean-lightbox-img"
          />
        )}
      </div>

      <style jsx global>{`
        /* Fullscreen Overlay with Frosted Glass Blur */
        .clean-lightbox-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: rgba(4, 5, 8, 0.94);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: cleanLightboxFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          user-select: none;
        }

        @keyframes cleanLightboxFadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        /* Minimal Close Button */
        .clean-lightbox-close {
          position: fixed;
          top: 24px;
          right: 28px;
          z-index: 100002;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .clean-lightbox-close:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
          transform: scale(1.08);
        }

        /* Minimal Navigation Arrows */
        .clean-lightbox-nav {
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          z-index: 100001;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(18, 20, 26, 0.7);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .clean-lightbox-nav:hover {
          background: rgba(212, 255, 0, 0.15);
          border-color: var(--accent);
          color: var(--accent);
          transform: translateY(-50%) scale(1.1);
        }
        .clean-nav-prev {
          left: 28px;
        }
        .clean-nav-next {
          right: 28px;
        }

        @media (max-width: 768px) {
          .clean-lightbox-nav {
            width: 40px;
            height: 40px;
          }
          .clean-nav-prev {
            left: 12px;
          }
          .clean-nav-next {
            right: 12px;
          }
          .clean-lightbox-close {
            top: 16px;
            right: 16px;
            width: 40px;
            height: 40px;
          }
        }

        /* Media Presentation Content */
        .clean-lightbox-content {
          position: relative;
          max-width: 90vw;
          max-height: 88vh;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: cleanLightboxScaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes cleanLightboxScaleUp {
          0% {
            opacity: 0;
            transform: scale(0.96);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Clean Image Styling */
        .clean-lightbox-img {
          max-width: 88vw;
          max-height: 86vh;
          width: auto;
          height: auto;
          object-fit: contain;
          border-radius: 12px;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: block;
        }

        /* Cinema Video Frame */
        .clean-lightbox-video-frame {
          width: min(88vw, 1060px);
          aspect-ratio: 16 / 9;
          background: #000000;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.12);
          position: relative;
        }

        .clean-lightbox-iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }

        .clean-lightbox-direct-video {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
      `}</style>
    </div>
  );
}
