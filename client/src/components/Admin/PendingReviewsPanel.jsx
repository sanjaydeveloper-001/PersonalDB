import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Check, X, Eye, Trash2, AlertCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const Container = styled.div`
  width: 100%;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
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

const TabButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const TabButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  background: ${(props) => (props.active ? '#3b82f6' : 'white')};
  color: ${(props) => (props.active ? 'white' : '#6b7280')};
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    background: ${(props) => (props.active ? '#3b82f6' : '#f3f4f6')};
  }
`;

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ReviewItem = styled.div`
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
`;

const ReviewerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ReviewerImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e5e7eb;
  object-fit: cover;
`;

const ReviewerDetails = styled.div``;

const ReviewerName = styled.div`
  font-weight: 600;
  color: #1f2937;
`;

const ReviewerRole = styled.div`
  font-size: 0.85rem;
  color: #6b7280;
`;

const Stars = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;
`;

const ReviewContent = styled.div`
  margin-bottom: 1rem;
`;

const ReviewMessage = styled.p`
  color: #374151;
  line-height: 1.6;
  margin: 0.5rem 0 0;
  font-size: 0.95rem;
`;

const ReviewFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const ReviewDate = styled.div`
  font-size: 0.85rem;
  color: #6b7280;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 6px 12px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #374151;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    background: #f3f4f6;
  }

  &.approve {
    border-color: #10b981;
    color: #10b981;
    background: #f0fdf4;

    &:hover {
      background: #dcfce7;
    }
  }

  &.reject {
    border-color: #ef4444;
    color: #ef4444;
    background: #fef2f2;

    &:hover {
      background: #fee2e2;
    }
  }

  &.delete {
    border-color: #dc2626;
    color: #dc2626;
    background: #fef2f2;

    &:hover {
      background: #fee2e2;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;

  &.pending {
    background: #fef3c7;
    color: #b45309;
  }

  &.approved {
    background: #d1fae5;
    color: #065f46;
  }

  &.rejected {
    background: #fee2e2;
    color: #7f1d1d;
  }
`;

export default function PendingReviewsPanel() {
  const [tab, setTab] = useState('pending');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [tab]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      let url = '/reviews/admin/all';
      if (tab === 'pending') {
        url = '/reviews/admin/pending';
      }
      
      const { data } = await api.get(url);

      if (data.success) {
        let filteredReviews = data.data || [];
        if (tab === 'approved') {
          filteredReviews = filteredReviews.filter((r) => r.status === 'approved');
        } else if (tab === 'rejected') {
          filteredReviews = filteredReviews.filter((r) => r.status === 'rejected');
        }
        setReviews(filteredReviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      setActionLoading(reviewId);
      const { data } = await api.patch(`/reviews/${reviewId}/approve`, { publish: true });

      if (data.success) {
        toast.success('Review approved! Email sent to user.');
        fetchReviews();
      }
    } catch (error) {
      console.error('Error approving review:', error);
      toast.error('Failed to approve review');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (reviewId) => {
    try {
      setActionLoading(reviewId);
      const { data } = await api.patch(`/reviews/${reviewId}/reject`);

      if (data.success) {
        toast.success('Review rejected! Email sent to user.');
        fetchReviews();
      }
    } catch (error) {
      console.error('Error rejecting review:', error);
      toast.error('Failed to reject review');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      setActionLoading(reviewId);
      const { data } = await api.delete(`/reviews/${reviewId}`);

      if (data.success) {
        toast.success('Review deleted');
        fetchReviews();
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    } finally {
      setActionLoading(null);
    }
  };

  const renderStars = (count) => {
    return (
      <Stars>
        {[...Array(5)].map((_, i) => (
          <span key={i} style={{ color: i < count ? '#fbbf24' : '#e5e7eb' }}>
            ★
          </span>
        ))}
      </Stars>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
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

  return (
    <Container>
      <Header>
        <Title>
          <AlertCircle size={24} />
          Review Management
        </Title>
        <TabButtons>
          {['pending', 'approved', 'rejected'].map((t) => (
            <TabButton
              key={t}
              active={tab === t}
              onClick={() => setTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </TabButton>
          ))}
        </TabButtons>
      </Header>

      {reviews.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📋</EmptyIcon>
          <p>No {tab} reviews</p>
        </EmptyState>
      ) : (
        <ReviewsList>
          {reviews.map((review) => (
            <ReviewItem key={review._id}>
              <ReviewHeader>
                <ReviewerInfo>
                  {review.profileImage && (
                    <ReviewerImage src={review.profileImage} alt={review.reviewerName} />
                  )}
                  <ReviewerDetails>
                    <ReviewerName>{review.reviewerName}</ReviewerName>
                    <ReviewerRole>{review.userRole}</ReviewerRole>
                  </ReviewerDetails>
                </ReviewerInfo>
                <StatusBadge className={review.status}>
                  {review.status}
                </StatusBadge>
              </ReviewHeader>

              <ReviewContent>
                {renderStars(review.stars)}
                <ReviewMessage>{review.message}</ReviewMessage>
              </ReviewContent>

              <ReviewFooter>
                <ReviewDate>{formatDate(review.date)}</ReviewDate>
                {tab === 'pending' && (
                  <ActionButtons>
                    <Button
                      className="approve"
                      onClick={() => handleApprove(review._id)}
                      disabled={actionLoading === review._id}
                    >
                      <Check size={16} />
                      Approve
                    </Button>
                    <Button
                      className="reject"
                      onClick={() => handleReject(review._id)}
                      disabled={actionLoading === review._id}
                    >
                      <X size={16} />
                      Reject
                    </Button>
                  </ActionButtons>
                )}
                {tab !== 'pending' && (
                  <ActionButtons>
                    <Button
                      className="delete"
                      onClick={() => handleDelete(review._id)}
                      disabled={actionLoading === review._id}
                    >
                      <Trash2 size={16} />
                      Delete
                    </Button>
                  </ActionButtons>
                )}
              </ReviewFooter>
            </ReviewItem>
          ))}
        </ReviewsList>
      )}
    </Container>
  );
}
