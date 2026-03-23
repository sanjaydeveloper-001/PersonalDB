import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Activity, Database, Key } from 'lucide-react';
import { apiService } from '../../services/apiService';
import toast from 'react-hot-toast';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 1rem;
`;

const StatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
  border-radius: 0.75rem;
  color: #0891b2;
  flex-shrink: 0;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatLabel = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 0.5rem 0;
  font-weight: 500;
`;

const StatValue = styled.p`
  font-size: 1.875rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;

const Section = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1.5rem 0;
`;

const ProgressBarContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #0f172a;
`;

const ProgressValue = styled.span`
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 0.75rem;
  background: #e2e8f0;
  border-radius: 9999px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  border-radius: 9999px;
  width: ${props => Math.min(props.$percentage, 100)}%;
  transition: width 0.6s ease;
`;

const WarningBox = styled.div`
  background: ${props => props.$severe ? '#fee2e2' : '#fef3c7'};
  border-left: 4px solid ${props => props.$severe ? '#dc2626' : '#f59e0b'};
  padding: 1rem;
  border-radius: 0.375rem;
  margin-top: 1rem;
  color: ${props => props.$severe ? '#7f1d1d' : '#78350f'};
  font-size: 0.9rem;
  line-height: 1.5;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;

  th, td {
    padding: 0.875rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }

  th {
    background: #f8fafc;
    color: #0f172a;
    font-weight: 700;
    font-size: 0.875rem;
  }

  tr:last-child td {
    border-bottom: none;
  }

  td {
    color: #475569;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #64748b;
`;

const Spinner = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border: 3px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
  margin-right: 0.5rem;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #64748b;
  font-size: 0.95rem;
`;

const ApiAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await apiService.getUsageStats();
      setStats(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch usage statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner /> Loading analytics...
      </LoadingContainer>
    );
  }

  if (!stats) {
    return (
      <Container>
        <Section>
          <EmptyState>Unable to load analytics. Please try again later.</EmptyState>
        </Section>
      </Container>
    );
  }

  const storagePercentage = (stats.storageUsed / stats.storageLimit) * 100;
  const storageGB = (stats.storageUsed / 1024).toFixed(2);
  const limitGB = (stats.storageLimit / 1024).toFixed(2);

  return (
    <Container>
      <StatsGrid>
        <StatCard>
          <StatIcon>
            <Activity />
          </StatIcon>
          <StatInfo>
            <StatLabel>Total Requests</StatLabel>
            <StatValue>{stats.totalRequests.toLocaleString()}</StatValue>
            <ProgressValue>This month: {stats.requestsThisMonth.toLocaleString()}</ProgressValue>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon>
            <Key />
          </StatIcon>
          <StatInfo>
            <StatLabel>Active API Keys</StatLabel>
            <StatValue>{stats.activeKeys}/{stats.totalKeys}</StatValue>
            <ProgressValue>Keys available: {Math.max(0, 10 - stats.totalKeys)}</ProgressValue>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon>
            <Database />
          </StatIcon>
          <StatInfo>
            <StatLabel>Storage Used</StatLabel>
            <StatValue>{storageGB} GB</StatValue>
            <ProgressValue>Limit: {limitGB} GB</ProgressValue>
          </StatInfo>
        </StatCard>
      </StatsGrid>

      <Section>
        <SectionTitle>Storage Usage</SectionTitle>
        <ProgressBarContainer>
          <ProgressLabel>
            <span>Disk Space</span>
            <ProgressValue>
              {stats.storageUsed} MB / {stats.storageLimit} MB ({storagePercentage.toFixed(1)}%)
            </ProgressValue>
          </ProgressLabel>
          <ProgressBar>
            <ProgressFill $percentage={storagePercentage} />
          </ProgressBar>
        </ProgressBarContainer>

        {storagePercentage > 80 && (
          <WarningBox $severe={storagePercentage > 95}>
            {storagePercentage > 95 ? (
              <>
                <strong>⚠️ Critical:</strong> You are running out of storage space. Please delete some files or upgrade your plan.
              </>
            ) : (
              <>
                <strong>⚠️ Warning:</strong> You are using {storagePercentage.toFixed(1)}% of your storage. Consider cleaning up unused files.
              </>
            )}
          </WarningBox>
        )}
      </Section>

      {stats.requestsByKey && stats.requestsByKey.length > 0 && (
        <Section>
          <SectionTitle>API Key Usage</SectionTitle>
          <Table>
            <thead>
              <tr>
                <th>Key Name</th>
                <th>Requests</th>
                <th>Last Used</th>
              </tr>
            </thead>
            <tbody>
              {stats.requestsByKey.map(key => (
                <tr key={key._id}>
                  <td><strong>{key.name}</strong></td>
                  <td>{key.requestCount.toLocaleString()}</td>
                  <td>{key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Section>
      )}

      <Section>
        <SectionTitle>📋 Usage Guidelines</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#475569', lineHeight: '1.6' }}>
          <div>
            <strong style={{ color: '#0f172a' }}>Rate Limiting</strong><br />
            Each API key is rate-limited to prevent abuse. Check the response headers for rate limit information.
          </div>
          <div>
            <strong style={{ color: '#0f172a' }}>Storage Limit</strong><br />
            Your account includes {limitGB} GB of storage. This includes all uploaded files, profile images, and project media.
          </div>
          <div>
            <strong style={{ color: '#0f172a' }}>Request Tracking</strong><br />
            Each API key tracks its own request count and last used timestamp, allowing you to monitor which integrations are actively using the API.
          </div>
        </div>
      </Section>
    </Container>
  );
};

export default ApiAnalytics;
