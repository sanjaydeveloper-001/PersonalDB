import styled from 'styled-components';
import PendingReviewsPanel from '../../components/Admin/PendingReviewsPanel';

/* ── Shell ── */
const Page = styled.div`
  width: 100%;
  animation: fadeUp 0.4s ease both;

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const PageHead = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #0d1117;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0.5rem 0 0 0;
`;

export default function AdminReviews() {
  return (
    <Page>
      <PageHead>
        <div>
          <Title>📋 Review Moderation</Title>
          <Subtitle>Manage and approve user reviews submitted about PersonalDB</Subtitle>
        </div>
      </PageHead>

      <PendingReviewsPanel />
    </Page>
  );
}
