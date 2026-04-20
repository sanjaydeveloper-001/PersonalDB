import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Star, Users, ThumbsUp } from 'lucide-react';

const Container = styled.div`
  width: 100%;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #f3f4f6;
  padding-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
`;

const StatCard = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #1e40af;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
  margin-top: 0.5rem;
`;

const RatingDistribution = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const RatingLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  min-width: 80px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 4px;
`;

const Count = styled.div`
  min-width: 40px;
  text-align: right;
  font-size: 0.9rem;
  color: #6b7280;
`;

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ReviewCard = styled.div`
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ReviewerImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #e5e7eb;
  object-fit: cover;
`;

const ReviewerInfo = styled.div`
  flex: 1;
`;

const ReviewerName = styled.div`
  font-weight: 600;
  color: #1f2937;
`;

const ReviewerRole = styled.div`
  font-size: 0.85rem;
  color: #6b7280;
`;

const ReviewRating = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;
`;

const ReviewDate = styled.div`
  font-size: 0.85rem;
  color: #9ca3af;
  margin-left: auto;
`;

const ReviewMessage = styled.p`
  color: #374151;
  line-height: 1.6;
  margin: 0;
  font-size: 0.95rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`;

export default function ReviewSection({ userId }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [userId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/user/${userId}`);
      const data = await response.json();

      if (data.success) {
        setReviews(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/reviews/stats/${userId}`);
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const renderStars = (count) => {
    return (
      <ReviewRating>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            fill={i < count ? '#fbbf24' : '#e5e7eb'}
            color={i < count ? '#fbbf24' : '#e5e7eb'}
          />
        ))}
      </ReviewRating>
    );
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>Loading reviews...</LoadingSpinner>
      </Container>
    );
  }

  const totalReviews = stats?.totalReviews || 0;
  const avgRating = stats?.averageRating || 0;

  return (
    <Container>
      <Header>
        <Title>
          <Users size={24} />
          Reviews & Ratings
        </Title>
      </Header>

      {stats && (
        <StatsContainer>
          <StatCard>
            <StatValue>
              <span>{avgRating}</span>
              <Star size={28} fill="#fbbf24" color="#fbbf24" />
            </StatValue>
            <StatLabel>Average Rating</StatLabel>
          </StatCard>

          <StatCard>
            <StatValue>{totalReviews}</StatValue>
            <StatLabel>Total Reviews</StatLabel>
          </StatCard>

          <StatCard>
            <RatingDistribution>
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.ratingBreakdown[rating] || 0;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                return (
                  <RatingRow key={rating}>
                    <RatingLabel>
                      {rating} <Star size={14} fill="#fbbf24" color="#fbbf24" />
                    </RatingLabel>
                    <ProgressBar>
                      <Progress style={{ width: `${percentage}%` }} />
                    </ProgressBar>
                    <Count>{count}</Count>
                  </RatingRow>
                );
              })}
            </RatingDistribution>
          </StatCard>
        </StatsContainer>
      )}

      {reviews.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <ThumbsUp />
          </EmptyIcon>
          <p>No reviews yet. Be the first to leave a review!</p>
        </EmptyState>
      ) : (
        <ReviewsList>
          {reviews.map((review) => (
            <ReviewCard key={review._id}>
              <ReviewHeader>
                {review.profileImage && (
                  <ReviewerImage src={review.profileImage} alt={review.reviewerName} />
                )}
                <ReviewerInfo>
                  <ReviewerName>{review.reviewerName}</ReviewerName>
                  <ReviewerRole>{review.userRole}</ReviewerRole>
                </ReviewerInfo>
                <div>
                  {renderStars(review.stars)}
                  <ReviewDate>{formatDate(review.date)}</ReviewDate>
                </div>
              </ReviewHeader>
              <ReviewMessage>{review.message}</ReviewMessage>
            </ReviewCard>
          ))}
        </ReviewsList>
      )}
    </Container>
  );
}
