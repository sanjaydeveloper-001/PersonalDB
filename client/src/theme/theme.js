export const theme = {
  colors: {
    primary: '#3b82f6',
    primaryDark: '#1e40af',
    primaryLight: '#eff6ff',
    darkBg: '#0f172a',
    lightBg: '#ffffff',
    lightGray: '#f0f4f8',
    gray: '#64748b',
    lightBorder: 'rgba(59, 130, 246, 0.1)',
    darkBorder: 'rgba(0, 0, 0, 0.08)',
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f97316',
    info: '#3b82f6',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.04)',
    md: '0 10px 40px rgba(59, 130, 246, 0.1)',
    lg: '0 20px 60px rgba(59, 130, 246, 0.15)',
  },
  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    smooth: '0.4s ease',
  },
  gradient: {
    primary: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
    light: 'linear-gradient(180deg, #ffffff 0%, #f0f4f8 100%)',
  },
};

export const DashboardContainer = `
  min-height: calc(100vh - 80px);
  background: linear-gradient(180deg, #ffffff 0%, #f0f4f8 100%);
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const PageSection = `
  background: white;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(59, 130, 246, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const PageTitle = `
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const PageSubtitle = `
  color: #64748b;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
`;

export const Card = `
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(59, 130, 246, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 40px rgba(59, 130, 246, 0.15);
    border-color: #3b82f6;
  }
`;

export const PrimaryButton = `
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = `
  background: #f0f4f8;
  color: #1e40af;
  padding: 0.75rem 1.5rem;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: #eff6ff;
    border-color: #1e40af;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const InputField = `
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

export const ErrorMessage = `
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 0.3rem;
`;

export const SuccessMessage = `
  color: #22c55e;
  font-size: 0.85rem;
  margin-top: 0.3rem;
`;
