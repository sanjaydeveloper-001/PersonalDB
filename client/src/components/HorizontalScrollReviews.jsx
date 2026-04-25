import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';

// ─── Star Icon ─────────────────────────────────────────────────────────────
const StarIcon = ({ filled = true, size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? '#f59e0b' : 'none'}
    stroke={filled ? '#f59e0b' : '#d1d5db'}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'inline-block', flexShrink: 0 }}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const StarRating = ({ count, max = 5 }) => (
  <StarsRow>
    {Array.from({ length: max }).map((_, i) => (
      <StarIcon key={i} filled={i < count} size={14} />
    ))}
  </StarsRow>
);

// ─── Styled Components ──────────────────────────────────────────────────────
const StarsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  margin-bottom: 0.75rem;
`;

const Outer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 1rem 0;
  cursor: grab;
  &:active { cursor: grabbing; }

  /* Fade edges */
  &::before, &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 60px;
    z-index: 2;
    pointer-events: none;
  }
  &::before {
    left: 0;
    background: linear-gradient(to right, rgba(255,255,255,0.95), transparent);
  }
  &::after {
    right: 0;
    background: linear-gradient(to left, rgba(255,255,255,0.95), transparent);
  }
`;

const Track = styled.div`
  display: flex;
  gap: 1.2rem;
  padding: 0.75rem 0;
  width: max-content;
  will-change: transform;
`;

const ReviewCard = styled.div`
  flex: 0 0 300px;
  width: 300px;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.35s ease,
              border-color 0.35s ease;
  position: relative;
  overflow: hidden;
  user-select: none;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #1e40af);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s ease;
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 15px 35px rgba(59, 130, 246, 0.14);
    border-color: rgba(59, 130, 246, 0.35);
    &::before { transform: scaleX(1); }
  }

  .review-text {
    color: #64748b;
    line-height: 1.65;
    font-size: 0.85rem;
    margin-bottom: 1rem;
    font-style: italic;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .author {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(59, 130, 246, 0.08);

    .avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6, #1e40af);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 0.9rem;
      flex-shrink: 0;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .author-info {
      .name {
        font-weight: 600;
        color: #0f172a;
        font-size: 0.85rem;
        line-height: 1.3;
      }
      .role {
        color: #94a3b8;
        font-size: 0.73rem;
        margin-top: 1px;
      }
    }
  }

  @media (max-width: 768px) {
    flex: 0 0 260px;
    width: 260px;
    padding: 1.2rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #94a3b8;
  font-size: 0.9rem;
`;

const ErrorText = styled(EmptyState)`color: #ef4444;`;

// ─── Constants ──────────────────────────────────────────────────────────────
const SPEED = 1.2;          // px per frame
const RESUME_DELAY = 200;  // ms after user releases

// ─── Component ──────────────────────────────────────────────────────────────
const HorizontalScrollReviews = ({ reviews = [], loading = false, error = null }) => {
  const trackRef = useRef(null);
  const rafRef   = useRef(null);

  // All mutable state lives in one ref — no re-renders needed
  const s = useRef({
    offset: 0,
    halfW: 0,
    paused: false,
    dragging: false,
    dragStartX: 0,
    dragStartOffset: 0,
    resumeTimer: null,
  });

  // 3 copies → always content visible left and right, middle copy is the "real" one
  const tripled = reviews.length ? [...reviews, ...reviews, ...reviews] : reviews;

  const getHalfW = () => {
    if (s.current.halfW) return s.current.halfW;
    const w = trackRef.current ? trackRef.current.scrollWidth / 3 : 0;
    s.current.halfW = w;
    return w;
  };

  const applyOffset = (offset) => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${-offset}px)`;
    }
  };

  const wrapOffset = (offset) => {
    const halfW = getHalfW();
    if (!halfW) return offset;
    return ((offset % halfW) + halfW) % halfW;
  };

  // Animation loop
  const tick = useCallback(() => {
    if (!s.current.paused) {
      const halfW = getHalfW();
      if (halfW > 0) {
        s.current.offset = wrapOffset(s.current.offset + SPEED);
        applyOffset(s.current.offset);
      }
    }
    rafRef.current = requestAnimationFrame(tick);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!reviews.length) return;
    // Reset halfW so it re-measures after render
    s.current.halfW = 0;
    s.current.offset = 0;
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(s.current.resumeTimer);
    };
  }, [reviews.length, tick]);

  // Pause / resume helpers
  const doPause = () => {
    s.current.paused = true;
    clearTimeout(s.current.resumeTimer);
  };
  const doScheduleResume = () => {
    clearTimeout(s.current.resumeTimer);
    s.current.resumeTimer = setTimeout(() => {
      s.current.paused = false;
    }, RESUME_DELAY);
  };

  // ── Mouse ──────────────────────────────────────────────────────────────
  const onMouseDown = (e) => {
    doPause();
    s.current.dragging = true;
    s.current.dragStartX = e.clientX;
    s.current.dragStartOffset = s.current.offset;
  };

  const onMouseMove = (e) => {
    if (!s.current.dragging) return;
    const delta = s.current.dragStartX - e.clientX;
    s.current.offset = wrapOffset(s.current.dragStartOffset + delta);
    applyOffset(s.current.offset);
  };

  const onMouseUp = () => {
    if (!s.current.dragging) return;
    s.current.dragging = false;
    doScheduleResume();
  };

  // ── Touch ──────────────────────────────────────────────────────────────
  const onTouchStart = (e) => {
    doPause();
    s.current.dragging = true;
    s.current.dragStartX = e.touches[0].clientX;
    s.current.dragStartOffset = s.current.offset;
  };

  const onTouchMove = (e) => {
    if (!s.current.dragging) return;
    const delta = s.current.dragStartX - e.touches[0].clientX;
    s.current.offset = wrapOffset(s.current.dragStartOffset + delta);
    applyOffset(s.current.offset);
  };

  const onTouchEnd = () => {
    s.current.dragging = false;
    doScheduleResume();
  };

  // ── Render ─────────────────────────────────────────────────────────────
  if (loading) return <EmptyState>Loading reviews…</EmptyState>;
  if (error)   return <ErrorText>Unable to load reviews. Please try again later.</ErrorText>;
  if (!reviews.length) return <EmptyState>No reviews yet. Be the first to leave one!</EmptyState>;

  return (
    <Outer
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Track ref={trackRef}>
        {tripled.map((review, idx) => (
          <ReviewCard key={`${review._id}-${idx}`}>
            <StarRating count={review.stars} />
            <p className="review-text">"{review.message}"</p>
            <div className="author">
              <div className="avatar">
                {review.profileImageUrl
                  ? <img src={review.profileImageUrl} alt={review.reviewerName || 'Reviewer'} />
                  : review.reviewerName?.charAt(0).toUpperCase() || '?'
                }
              </div>
              <div className="author-info">
                <div className="name">{review.reviewerName || 'Anonymous'}</div>
                {review.role && <div className="role">{review.role}</div>}
              </div>
            </div>
          </ReviewCard>
        ))}
      </Track>
    </Outer>
  );
};

export default HorizontalScrollReviews;