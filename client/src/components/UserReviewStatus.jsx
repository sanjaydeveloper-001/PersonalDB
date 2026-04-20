import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import api from '../services/api';

const Container = styled.div`
  background: white;
  border-radius: 8px;
  border: 1.5px solid #e5e7eb;
  padding: 1.5rem;
  margin-top: 1rem;
`;

const StatusContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Icon = styled.div`
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TextContent = styled.div``;

const Title = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  color: #1f2937;
`;

const Description = styled.p`
  font-size: 0.85rem;
  margin: 0;
  color: #6b7280;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.5rem;
  
  ${(props) => {
    switch (props.status) {
      case 'pending':
        return `background: #fef3c7; color: #92400e;`;
      case 'approved':
        return `background: #d1fae5; color: #065f46;`;
      case 'rejected':
        return `background: #fee2e2; color: #991b1b;`;
      default:
        return `background: #f3f4f6; color: #374151;`;
    }
  }}
`;

const ReviewText = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #4b5563;
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: #6b7280;
`;

const StarRating = styled.div`
  display: flex;
  gap: 0.25rem;
`;

export default function UserReviewStatus() {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserReview();
  }, []);

  const fetchUserReview = async () => {
    try {
      const { data } = await api.get('/reviews/my-review');
      if (data.success && data.data) {
        setReview(data.data);
      }
    } catch (error) {
      console.error('Error fetching user review:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  if (!review) return null;

  const renderStatus = () => {
    switch (review.status) {
      case 'pending':
        return {
          icon: <Clock size={32} color="#f59e0b" />,
          title: 'Review Pending Approval',
          description: 'Your review is being reviewed by our team.',
          badge: 'PENDING',
        };
      case 'approved':
        return {
          icon: <CheckCircle size={32} color="#10b981" />,
          title: 'Review Approved',
          description: 'Your review is now published and visible to all users!',
          badge: 'APPROVED',
        };
      case 'rejected':
        return {
          icon: <AlertCircle size={32} color="#ef4444" />,
          title: 'Review Not Approved',
          description: 'Your review did not meet our community guidelines.',
          badge: 'REJECTED',
        };
      default:
        return {
          icon: <Clock size={32} color="#6b7280" />,
          title: 'Review Status',
          description: 'Unknown status',
          badge: 'UNKNOWN',
        };
    }
  };

  const status = renderStatus();

  return (
    <Container>
      <StatusContent>
        <Icon>{status.icon}</Icon>
        <TextContent>
          <Title>{status.title}</Title>
          <Description>{status.description}</Description>
          <StatusBadge status={review.status}>{status.badge}</StatusBadge>
        </TextContent>
      </StatusContent>

      {review.message && (
        <ReviewText>
          <ReviewHeader>
            <span>Your Review:</span>
            <StarRating>
              {'⭐'.repeat(review.stars)}
            </StarRating>
          </ReviewHeader>
          <blockquote style={{ margin: 0, fontStyle: 'italic', color: '#374151' }}>
            "{review.message}"
          </blockquote>
        </ReviewText>
      )}
    </Container>
  );
}
