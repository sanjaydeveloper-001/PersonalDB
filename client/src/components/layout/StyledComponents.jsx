import styled from 'styled-components';

export const DashboardPageContainer = styled.div`
  min-height: calc(100vh - 80px);
  background: linear-gradient(180deg, #ffffff 0%, #f0f4f8 100%);
  padding: 2rem;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const PageHeader = styled.div`
  margin-bottom: 2.5rem;
`;

export const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    color: #3b82f6;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const PageSubtitle = styled.p`
  color: #64748b;
  font-size: 0.95rem;
`;

export const PageContent = styled.div`
  flex: 1;
`;

export const Section = styled.section`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(59, 130, 246, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 1.5rem;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(59, 130, 246, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 40px rgba(59, 130, 246, 0.15);
    border-color: #3b82f6;
  }
`;

export const StatCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

export const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.color || 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)'};

  svg {
    color: white;
    width: 28px;
    height: 28px;
  }
`;

export const StatContent = styled.div``;

export const StatLabel = styled.p`
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

export const StatValue = styled.p`
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background: #f8fafc;
    border-bottom: 2px solid #e2e8f0;
  }

  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #0f172a;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  td {
    padding: 1rem;
    border-bottom: 1px solid #e2e8f0;
    color: #475569;
  }

  tbody tr {
    transition: background 0.2s ease;

    &:hover {
      background: #f8fafc;
    }
  }
`;

export const BadgeContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const Badge = styled.span`
  background: ${props => {
    switch (props.variant) {
      case 'success':
        return '#d1fae5';
      case 'error':
        return '#fee2e2';
      case 'warning':
        return '#fef3c7';
      case 'info':
        return '#dbeafe';
      default:
        return '#f0f4f8';
    }
  }};
  color: ${props => {
    switch (props.variant) {
      case 'success':
        return '#065f46';
      case 'error':
        return '#7f1d1d';
      case 'warning':
        return '#78350f';
      case 'info':
        return '#0c4a6e';
      default:
        return '#1e40af';
    }
  }};
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;

  svg {
    width: 80px;
    height: 80px;
    color: #cbd5e1;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.25rem;
    color: #0f172a;
    margin-bottom: 0.5rem;
  }

  p {
    color: #64748b;
    margin-bottom: 1.5rem;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
`;

export const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
    background: linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 0.8rem 1.25rem;
  }
`;

export const SecondaryButton = styled.button`
  background: white;
  color: #1e40af;
  padding: 0.75rem 1.5rem;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover:not(:disabled) {
    background: #eff6ff;
    border-color: #1e40af;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 0.8rem 1.25rem;
  }
`;

export const DangerButton = styled.button`
  background: white;
  color: #ef4444;
  padding: 0.75rem 1.5rem;
  border: 2px solid #fca5a5;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover:not(:disabled) {
    background: #fee2e2;
    border-color: #ef4444;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 0.8rem 1.25rem;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.6rem;
  font-size: 0.95rem;
`;

export const InputField = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  font-size: 0.95rem;
  color: #0f172a;
  background: white;
  transition: all 0.3s ease;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: #eff6ff;
  }

  &::placeholder {
    color: #94a3b8;
  }

  &:disabled {
    background: #f8fafc;
    color: #94a3b8;
    cursor: not-allowed;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  font-size: 0.95rem;
  color: #0f172a;
  background: white;
  transition: all 0.3s ease;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: #eff6ff;
  }

  &::placeholder {
    color: #94a3b8;
  }

  &:disabled {
    background: #f8fafc;
    color: #94a3b8;
    cursor: not-allowed;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  font-size: 0.95rem;
  color: #0f172a;
  background: white;
  transition: all 0.3s ease;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: #eff6ff;
  }

  &:disabled {
    background: #f8fafc;
    color: #94a3b8;
    cursor: not-allowed;
  }
`;

export const ErrorText = styled.span`
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 0.3rem;
  display: block;
`;

export const SuccessText = styled.span`
  color: #22c55e;
  font-size: 0.85rem;
  margin-top: 0.3rem;
  display: block;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(59, 130, 246, 0.1);
  margin: 2rem 0;
`;
