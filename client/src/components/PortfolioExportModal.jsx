import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  X, Download, FileJson, FileText, File, Loader2, AlertCircle, CheckCircle2,
  Eye, EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeIn} 0.3s ease;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${slideUp} 0.4s ease;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10000;

  @media (max-width: 600px) {
    max-width: 95%;
    border-radius: 12px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;

  h2 {
    font-size: 1.35rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    color: #1e293b;
  }
`;

const Body = styled.div`
  padding: 24px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.h3`
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  color: #94a3b8;
  letter-spacing: 0.6px;
  margin: 0;
`;

const PreviewBox = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  color: #334155;
  max-height: 300px;
  overflow-y: auto;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
`;

const FormatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
`;

const FormatBtn = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  border: 2px solid ${p => p.$active ? '#3b82f6' : '#e2e8f0'};
  border-radius: 12px;
  background: ${p => p.$active ? '#eff6ff' : '#f8fafc'};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  color: ${p => p.$active ? '#1e40af' : '#475569'};

  svg {
    width: 28px;
    height: 28px;
  }

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  flex-shrink: 0;
  flex-wrap: wrap;

  @media (max-width: 500px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const Btn = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelBtn = styled(Btn)`
  background: #f1f5f9;
  color: #475569;

  &:hover:not(:disabled) {
    background: #e2e8f0;
  }
`;

const ExportBtn = styled(Btn)`
  background: #3b82f6;
  color: white;

  &:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-1px);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 24px;
  color: #64748b;

  svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #991b1b;
  font-size: 14px;

  svg {
    min-width: 20px;
    margin-top: 2px;
  }
`;

const ToggleBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #3b82f6;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  transition: color 0.2s ease;

  &:hover {
    color: #1e40af;
  }
`;

const PortfolioExportModal = ({ isOpen, onClose }) => {
  const [selectedFormat, setSelectedFormat] = useState('json');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (isOpen) {
      fetchPortfolioData();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoints = [
        { key: 'profile', url: '/portfolio/profile' },
        { key: 'education', url: '/portfolio/education' },
        { key: 'experience', url: '/portfolio/experience' },
        { key: 'projects', url: '/portfolio/projects' },
        { key: 'skills', url: '/portfolio/skills' },
        { key: 'certifications', url: '/portfolio/certifications' },
        { key: 'interests', url: '/portfolio/interests' },
      ];

      const portfolioData = {};

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`${API_URL}${endpoint.url}`, {
            credentials: 'include',
          });

          if (response.ok) {
            const result = await response.json();
            portfolioData[endpoint.key] = result;
          }
        } catch (err) {
          console.warn(`Failed to fetch ${endpoint.key}:`, err);
        }
      }

      setData(portfolioData);
    } catch (err) {
      setError(err.message || 'Failed to load portfolio data');
      toast.error('Error loading portfolio data');
    } finally {
      setLoading(false);
    }
  };

  const generateTextContent = () => {
    if (!data) return '';

    let text = '═══════════════════════════════════════\n';
    text += 'PORTFOLIO EXPORT\n';
    text += '═══════════════════════════════════════\n\n';

    // Profile
    if (data.profile) {
      text += '📋 PROFILE\n';
      text += '───────────────────────────────────────\n';
      const profile = data.profile;
      if (profile.fullName) text += `Name: ${profile.fullName}\n`;
      if (profile.headline) text += `Headline: ${profile.headline}\n`;
      if (profile.bio) text += `Bio: ${profile.bio}\n`;
      if (profile.email) text += `Email: ${profile.email}\n`;
      if (profile.phone) text += `Phone: ${profile.phone}\n`;
      if (profile.location) text += `Location: ${profile.location}\n`;
      if (profile.website) text += `Website: ${profile.website}\n`;
      text += '\n';
    }

    // Experience
    if (data.experience && Array.isArray(data.experience) && data.experience.length > 0) {
      text += '💼 EXPERIENCE\n';
      text += '───────────────────────────────────────\n';
      data.experience.forEach((exp, i) => {
        text += `${i + 1}. ${exp.position} at ${exp.company}\n`;
        if (exp.startDate) text += `   From: ${exp.startDate}\n`;
        if (exp.endDate) text += `   To: ${exp.endDate}\n`;
        if (exp.description) text += `   Description: ${exp.description}\n`;
        text += '\n';
      });
    }

    // Education
    if (data.education && Array.isArray(data.education) && data.education.length > 0) {
      text += '🎓 EDUCATION\n';
      text += '───────────────────────────────────────\n';
      data.education.forEach((edu, i) => {
        text += `${i + 1}. ${edu.degree} in ${edu.field}\n`;
        if (edu.school) text += `   School: ${edu.school}\n`;
        if (edu.startDate) text += `   From: ${edu.startDate}\n`;
        if (edu.endDate) text += `   To: ${edu.endDate}\n`;
        text += '\n';
      });
    }

    // Skills
    if (data.skills && Array.isArray(data.skills) && data.skills.length > 0) {
      text += '🛠️  SKILLS\n';
      text += '───────────────────────────────────────\n';
      data.skills.forEach((skill) => {
        text += `• ${skill.name}`;
        if (skill.proficiency) text += ` (${skill.proficiency})`;
        text += '\n';
      });
      text += '\n';
    }

    // Projects
    if (data.projects && Array.isArray(data.projects) && data.projects.length > 0) {
      text += '🚀 PROJECTS\n';
      text += '───────────────────────────────────────\n';
      data.projects.forEach((proj, i) => {
        text += `${i + 1}. ${proj.title}\n`;
        if (proj.description) text += `   Description: ${proj.description}\n`;
        if (proj.technologies) text += `   Technologies: ${proj.technologies.join(', ')}\n`;
        if (proj.link) text += `   Link: ${proj.link}\n`;
        text += '\n';
      });
    }

    // Certifications
    if (data.certifications && Array.isArray(data.certifications) && data.certifications.length > 0) {
      text += '🏆 CERTIFICATIONS\n';
      text += '───────────────────────────────────────\n';
      data.certifications.forEach((cert, i) => {
        text += `${i + 1}. ${cert.name}\n`;
        if (cert.issuer) text += `   Issuer: ${cert.issuer}\n`;
        if (cert.issueDate) text += `   Issue Date: ${cert.issueDate}\n`;
        text += '\n';
      });
    }

    // Interests
    if (data.interests && Array.isArray(data.interests) && data.interests.length > 0) {
      text += '⭐ INTERESTS\n';
      text += '───────────────────────────────────────\n';
      data.interests.forEach((interest) => {
        text += `• ${interest.name}\n`;
      });
      text += '\n';
    }

    text += '═══════════════════════════════════════\n';
    text += `Generated on: ${new Date().toLocaleString()}\n`;

    return text;
  };

  const getPreviewContent = () => {
    if (selectedFormat === 'json') {
      return JSON.stringify(data, null, 2);
    } else if (selectedFormat === 'text') {
      return generateTextContent();
    }
    return '';
  };

  const downloadFile = () => {
    try {
      if (!data) {
        toast.error('No data to export');
        return;
      }

      const filename = `portfolio-export-${new Date().getTime()}`;
      const profile = data.profile || {};
      const userName = profile.fullName?.replace(/\s+/g, '-') || 'portfolio';

      if (selectedFormat === 'json') {
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        downloadBlob(blob, `${userName}-portfolio.json`);
      } else if (selectedFormat === 'text') {
        const textContent = generateTextContent();
        const blob = new Blob([textContent], { type: 'text/plain' });
        downloadBlob(blob, `${userName}-portfolio.txt`);
      } else if (selectedFormat === 'pdf') {
        generatePDF();
      }

      toast.success('Portfolio exported successfully!');
      onClose();
    } catch (err) {
      toast.error('Error exporting portfolio');
      console.error(err);
    }
  };

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = margin;

    const setFont = (size = 10, type = 'normal') => {
      doc.setFont('helvetica', type);
      doc.setFontSize(size);
    };

    const addText = (text, options = {}) => {
      const { isBold = false, size = 10, spacing = 5 } = options;
      setFont(size, isBold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      
      lines.forEach((line) => {
        if (yPosition + 5 > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += spacing;
      });
    };

    // Title
    setFont(16, 'bold');
    yPosition = margin + 10;
    doc.text('PORTFOLIO', margin, yPosition);
    yPosition += 15;

    // Profile
    if (data.profile) {
      const profile = data.profile;
      addText('PROFILE', { isBold: true, size: 12, spacing: 6 });
      if (profile.fullName) addText(`Name: ${profile.fullName}`);
      if (profile.headline) addText(`Headline: ${profile.headline}`);
      if (profile.bio) addText(`Bio: ${profile.bio}`);
      if (profile.email) addText(`Email: ${profile.email}`);
      if (profile.phone) addText(`Phone: ${profile.phone}`);
      if (profile.location) addText(`Location: ${profile.location}`);
      yPosition += 5;
    }

    // Experience
    if (data.experience && Array.isArray(data.experience) && data.experience.length > 0) {
      addText('EXPERIENCE', { isBold: true, size: 12, spacing: 6 });
      data.experience.forEach((exp) => {
        addText(`${exp.position} at ${exp.company}`, { isBold: true });
        if (exp.startDate && exp.endDate) {
          addText(`${exp.startDate} - ${exp.endDate}`, { size: 9 });
        }
        if (exp.description) {
          addText(exp.description, { size: 9 });
        }
        yPosition += 3;
      });
    }

    // Education
    if (data.education && Array.isArray(data.education) && data.education.length > 0) {
      addText('EDUCATION', { isBold: true, size: 12, spacing: 6 });
      data.education.forEach((edu) => {
        addText(`${edu.degree} in ${edu.field}`, { isBold: true });
        if (edu.school) addText(`${edu.school}`, { size: 9 });
        yPosition += 3;
      });
    }

    // Skills
    if (data.skills && Array.isArray(data.skills) && data.skills.length > 0) {
      addText('SKILLS', { isBold: true, size: 12, spacing: 6 });
      const skillNames = data.skills.map(s => s.name).join(', ');
      addText(skillNames, { size: 9 });
      yPosition += 3;
    }

    // Projects
    if (data.projects && Array.isArray(data.projects) && data.projects.length > 0) {
      addText('PROJECTS', { isBold: true, size: 12, spacing: 6 });
      data.projects.forEach((proj) => {
        addText(proj.title, { isBold: true });
        if (proj.description) addText(proj.description, { size: 9 });
        yPosition += 3;
      });
    }

    const profile = data.profile || {};
    const userName = profile.fullName?.replace(/\s+/g, '-') || 'portfolio';
    doc.save(`${userName}-portfolio.pdf`);
  };

  if (!isOpen) return null;

  return (
    <Backdrop onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          <h2>
            <Download size={24} />
            Export Portfolio
          </h2>
          <CloseBtn onClick={onClose}>
            <X size={20} />
          </CloseBtn>
        </Header>

        <Body>
          {error && (
            <ErrorBox>
              <AlertCircle size={20} />
              {error}
            </ErrorBox>
          )}

          {loading ? (
            <LoadingContainer>
              <Loader2 />
              <p>Loading your portfolio data...</p>
            </LoadingContainer>
          ) : !data ? (
            <LoadingContainer>
              <AlertCircle size={32} />
              <p>No portfolio data found</p>
            </LoadingContainer>
          ) : (
            <>
              <Section>
                <SectionTitle>Select Export Format</SectionTitle>
                <FormatGrid>
                  <FormatBtn
                    $active={selectedFormat === 'json'}
                    onClick={() => setSelectedFormat('json')}
                  >
                    <FileJson />
                    JSON
                  </FormatBtn>
                  <FormatBtn
                    $active={selectedFormat === 'text'}
                    onClick={() => setSelectedFormat('text')}
                  >
                    <FileText />
                    Text
                  </FormatBtn>
                  <FormatBtn
                    $active={selectedFormat === 'pdf'}
                    onClick={() => setSelectedFormat('pdf')}
                  >
                    <File />
                    PDF
                  </FormatBtn>
                </FormatGrid>
              </Section>

              {showPreview && (selectedFormat === 'json' || selectedFormat === 'text') && (
                <Section>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <SectionTitle>Preview</SectionTitle>
                    <ToggleBtn onClick={() => setShowPreview(!showPreview)}>
                      <EyeOff size={14} />
                      Hide
                    </ToggleBtn>
                  </div>
                  <PreviewBox>{getPreviewContent()}</PreviewBox>
                </Section>
              )}
            </>
          )}
        </Body>

        <Footer>
          <CancelBtn onClick={onClose}>Cancel</CancelBtn>
          <ExportBtn onClick={downloadFile} disabled={loading || !data}>
            <Download size={16} />
            Download {selectedFormat.toUpperCase()}
          </ExportBtn>
        </Footer>
      </ModalContainer>
    </Backdrop>
  );
};

export default PortfolioExportModal;
