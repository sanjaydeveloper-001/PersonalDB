import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, Star, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #1f2937;
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
`;

const StarsContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const StarButton = styled.button`
  background: none;
  border: 2px solid #e5e7eb;
  width: 50px;
  height: 50px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: #d1d5db;

  &:hover {
    border-color: #fbbf24;
    color: #fbbf24;
    transform: scale(1.05);
  }

  ${(props) =>
    props.selected &&
    `
    background: #fbbf24;
    border-color: #fbbf24;
    color: white;
  `}
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
`;

const CharacterCount = styled.p`
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
`;

const InfoBox = styled.div`
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  gap: 0.75rem;
  color: #1e40af;
`;

const ModalFooter = styled.div`
  display: flex;
  gap: 1rem;
  padding: 2rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-size: 0.95rem;

  &.cancel {
    background: white;
    border: 1.5px solid #e5e7eb;
    color: #374151;

    &:hover {
      background: #f9fafb;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &.submit {
    background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
`;

const ErrorMessage = styled.p`
  color: #dc2626;
  font-size: 0.9rem;
  margin: 0;
`;

export default function ReviewModal({ isOpen, onClose, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('You must be logged in to submit a review');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (message.trim().length < 10) {
      setError('Review message must be at least 10 characters');
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post('/reviews', {
        stars: rating,
        message: message.trim(),
      });

      toast.success('Review submitted successfully! Awaiting approval.');
      setRating(0);
      setMessage('');
      onClose();
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit review. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Share Your Feedback About PersonalDB</ModalTitle>
          <CloseButton onClick={onClose} disabled={loading}>
            <X size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <InfoBox>
            <AlertCircle size={20} />
            <span>Help us improve! Share your experience with PersonalDB. Your review will be pending approval before being published.</span>
          </InfoBox>

          <FormGroup>
            <Label>Rating</Label>
            <StarsContainer>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarButton
                  key={star}
                  selected={rating >= star}
                  onClick={() => setRating(star)}
                  disabled={loading}
                  type="button"
                >
                  <Star size={24} fill={rating >= star ? 'currentColor' : 'none'} />
                </StarButton>
              ))}
            </StarsContainer>
          </FormGroup>

          <FormGroup>
            <Label>Your Review</Label>
            <TextArea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your experience with PersonalDB..."
              disabled={loading}
              maxLength={1000}
            />
            <CharacterCount>
              {message.length}/1000 characters
            </CharacterCount>
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}
        </ModalBody>

        <ModalFooter>
          <Button
            className="cancel"
            onClick={onClose}
            disabled={loading}
            type="button"
          >
            Cancel
          </Button>
          <Button
            className="submit"
            onClick={handleSubmit}
            disabled={loading || rating === 0 || message.trim().length < 10}
            type="button"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Overlay>
  );
}
