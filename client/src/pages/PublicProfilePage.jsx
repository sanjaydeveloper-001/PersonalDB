import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Mail, MapPin, Globe, Linkedin, Github, ExternalLink, Code2, Award, Briefcase, BookOpen } from 'lucide-react';
import { publicService } from '../services/publicService';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, 
    rgba(59, 130, 246, 0.05) 0%,
    rgba(30, 64, 175, 0.02) 100%
  );
  padding: 2rem 1rem;
`;

const Content = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  color: #64748b;
`;

const Spinner = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 1rem;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  background: #fee2e2;
  border: 1px solid #fca5a5;
  border-radius: 0.75rem;
  padding: 1.5rem;
  text-align: center;
  color: #dc2626;
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ErrorTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
`;

const BackButton = styled.button`
  margin-top: 1rem;
  background: white;
  color: #dc2626;
  border: 1px solid #fca5a5;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  
  &:hover {
    background: #fef2f2;
  }
`;

// Profile Header Section
const ProfileHeader = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 1.5rem 1rem;
  }
`;

const ProfilePhoto = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 0.75rem;
  object-fit: cover;
  background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }
`;

const ProfilePhotoPlaceholder = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0891b2;
  font-size: 2.5rem;

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
    font-size: 1.75rem;
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ProfileName = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ProfileTitle = styled.p`
  font-size: 1.125rem;
  color: #3b82f6;
  margin: 0;
  font-weight: 600;
`;

const ProfileMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.95rem;

  svg {
    width: 1rem;
    height: 1rem;
    color: #3b82f6;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  background: #f1f5f9;
  border-radius: 0.5rem;
  color: #3b82f6;
  transition: all 0.3s;
  text-decoration: none;

  &:hover {
    background: #e0f2fe;
    transform: translateY(-2px);
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: #3b82f6;
  }
`;

const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Card = styled.div`
  padding: 1.5rem;
  background: #f8fafc;
  border-left: 4px solid #3b82f6;
  border-radius: 0.5rem;
  transition: all 0.3s;

  &:hover {
    background: #f1f5f9;
    border-left-color: #0891b2;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
`;

const CardSubtitle = styled.p`
  color: #3b82f6;
  margin: 0 0 0.5rem 0;
  font-size: 0.95rem;
  font-weight: 600;
`;

const CardMeta = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin: 0 0 0.75rem 0;
`;

const CardDescription = styled.p`
  color: #475569;
  margin: 0;
  line-height: 1.6;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const Tag = styled.span`
  display: inline-block;
  background: #dbeafe;
  color: #0891b2;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const SkillCategory = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SkillCategoryTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #3b82f6;
`;

const SkillChip = styled.span`
  display: inline-block;
  background: #06b6d4;
  color: white;
  padding: 0.5rem 0.875rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const InterestsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const InterestBadge = styled.span`
  display: inline-block;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  padding: 0.625rem 1.25rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.95rem;
`;

const SummaryText = styled.p`
  color: #475569;
  line-height: 1.7;
  font-size: 1rem;
  margin: 0;
`;

const LinkButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  width: fit-content;

  &:hover {
    color: #1e40af;
    gap: 0.75rem;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const EmptyMessage = styled.p`
  color: #94a3b8;
  text-align: center;
  padding: 2rem 1rem;
  font-style: italic;
`;

const PublicProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const data = await publicService.getPortfolio(username);
        setPortfolio(data);

        // Try to get signed URL for profile photo if it exists
        if (data.profile?.photo) {
          try {
            const url = await publicService.getSignedUrl(data.profile.photo);
            setImageUrls(prev => ({ ...prev, profilePhoto: url }));
          } catch (err) {
            console.warn('Could not fetch signed URL for profile photo', err);
          }
        }
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError(err.message || 'Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchPortfolio();
    }
  }, [username]);

  if (loading) {
    return (
      <Container>
        <Content>
          <LoadingContainer>
            <Spinner />
            Loading portfolio...
          </LoadingContainer>
        </Content>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Content>
          <ErrorContainer>
            <ErrorTitle>User Not Found</ErrorTitle>
            <p>{error}</p>
            <BackButton onClick={() => navigate('/')}>Go Home</BackButton>
          </ErrorContainer>
        </Content>
      </Container>
    );
  }

  if (!portfolio) {
    return (
      <Container>
        <Content>
          <ErrorContainer>
            <ErrorTitle>No Portfolio Data</ErrorTitle>
            <p>This user hasn't set up their portfolio yet.</p>
            <BackButton onClick={() => navigate('/')}>Go Home</BackButton>
          </ErrorContainer>
        </Content>
      </Container>
    );
  }

  const { profile, education, experience, projects, skills, certifications, interests } = portfolio;

  return (
    <Container>
      <Content>
        {/* Profile Header */}
        {profile && Object.keys(profile).length > 0 && (
          <ProfileHeader>
            {imageUrls.profilePhoto ? (
              <ProfilePhoto src={imageUrls.profilePhoto} alt={profile.firstName} />
            ) : (
              <ProfilePhotoPlaceholder>👤</ProfilePhotoPlaceholder>
            )}
            <ProfileInfo>
              <div>
                <ProfileName>{profile.firstName} {profile.lastName}</ProfileName>
                {profile.domain && <ProfileTitle>{profile.domain}</ProfileTitle>}
              </div>
              <ProfileMeta>
                {profile.location && (
                  <MetaItem>
                    <MapPin />
                    {profile.location}
                  </MetaItem>
                )}
                {profile.email && (
                  <MetaItem>
                    <Mail />
                    {profile.email}
                  </MetaItem>
                )}
              </ProfileMeta>
              <SocialLinks>
                {profile.website && (
                  <SocialLink href={profile.website} target="_blank" rel="noopener noreferrer" title="Website">
                    <Globe />
                  </SocialLink>
                )}
                {profile.linkedin && (
                  <SocialLink href={profile.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                    <Linkedin />
                  </SocialLink>
                )}
                {profile.github && (
                  <SocialLink href={profile.github} target="_blank" rel="noopener noreferrer" title="GitHub">
                    <Github />
                  </SocialLink>
                )}
              </SocialLinks>
              {profile.summary && (
                <SummaryText>{profile.summary}</SummaryText>
              )}
            </ProfileInfo>
          </ProfileHeader>
        )}

        {/* Education Section */}
        {education && education.length > 0 && (
          <Section>
            <SectionTitle>
              <BookOpen />
              Education
            </SectionTitle>
            <SectionContent>
              {education.map((edu) => (
                <Card key={edu._id}>
                  <CardTitle>{edu.school}</CardTitle>
                  <CardSubtitle>{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</CardSubtitle>
                  <CardMeta>
                    {edu.startDate && new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    {edu.endDate && ` - ${new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                  </CardMeta>
                  {edu.description && <CardDescription>{edu.description}</CardDescription>}
                </Card>
              ))}
            </SectionContent>
          </Section>
        )}

        {/* Experience Section */}
        {experience && experience.length > 0 && (
          <Section>
            <SectionTitle>
              <Briefcase />
              Experience
            </SectionTitle>
            <SectionContent>
              {experience.map((exp) => (
                <Card key={exp._id}>
                  <CardTitle>{exp.title}</CardTitle>
                  <CardSubtitle>{exp.company}</CardSubtitle>
                  <CardMeta>
                    {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    {exp.endDate ? ` - ${new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : ' - Present'}
                  </CardMeta>
                  {exp.description && <CardDescription>{exp.description}</CardDescription>}
                </Card>
              ))}
            </SectionContent>
          </Section>
        )}

        {/* Projects Section */}
        {projects && projects.length > 0 && (
          <Section>
            <SectionTitle>
              <Code2 />
              Projects
            </SectionTitle>
            <SectionContent>
              {projects.map((proj) => (
                <Card key={proj._id}>
                  <CardTitle>{proj.name}</CardTitle>
                  {proj.description && <CardDescription>{proj.description}</CardDescription>}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <TagContainer>
                      {proj.technologies.map((tech, idx) => (
                        <Tag key={idx}>{tech}</Tag>
                      ))}
                    </TagContainer>
                  )}
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                    {proj.link && (
                      <LinkButton href={proj.link} target="_blank" rel="noopener noreferrer">
                        View Project <ExternalLink />
                      </LinkButton>
                    )}
                    {proj.repository && (
                      <LinkButton href={proj.repository} target="_blank" rel="noopener noreferrer">
                        Repository <ExternalLink />
                      </LinkButton>
                    )}
                  </div>
                </Card>
              ))}
            </SectionContent>
          </Section>
        )}

        {/* Skills Section */}
        {skills && Object.keys(skills).length > 1 && (
          <Section>
            <SectionTitle>
              <Code2 />
              Skills
            </SectionTitle>
            <SkillsGrid>
              {skills.languages && skills.languages.length > 0 && (
                <SkillCategory>
                  <SkillCategoryTitle>Languages</SkillCategoryTitle>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {skills.languages.map((lang, idx) => (
                      <SkillChip key={idx}>{lang}</SkillChip>
                    ))}
                  </div>
                </SkillCategory>
              )}
              {skills.frameworks && skills.frameworks.length > 0 && (
                <SkillCategory>
                  <SkillCategoryTitle>Frameworks</SkillCategoryTitle>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {skills.frameworks.map((fw, idx) => (
                      <SkillChip key={idx}>{fw}</SkillChip>
                    ))}
                  </div>
                </SkillCategory>
              )}
              {skills.tools && skills.tools.length > 0 && (
                <SkillCategory>
                  <SkillCategoryTitle>Tools</SkillCategoryTitle>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {skills.tools.map((tool, idx) => (
                      <SkillChip key={idx}>{tool}</SkillChip>
                    ))}
                  </div>
                </SkillCategory>
              )}
            </SkillsGrid>
          </Section>
        )}

        {/* Certifications Section */}
        {certifications && certifications.length > 0 && (
          <Section>
            <SectionTitle>
              <Award />
              Certifications
            </SectionTitle>
            <SectionContent>
              {certifications.map((cert) => (
                <Card key={cert._id}>
                  <CardTitle>{cert.name}</CardTitle>
                  <CardSubtitle>{cert.issuer}</CardSubtitle>
                  <CardMeta>
                    {cert.issuedDate && new Date(cert.issuedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    {cert.expirationDate && ` - Expires: ${new Date(cert.expirationDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                  </CardMeta>
                  {cert.url && (
                    <LinkButton href={cert.url} target="_blank" rel="noopener noreferrer">
                      View Credential <ExternalLink />
                    </LinkButton>
                  )}
                </Card>
              ))}
            </SectionContent>
          </Section>
        )}

        {/* Interests Section */}
        {interests && interests.interests && interests.interests.length > 0 && (
          <Section>
            <SectionTitle>Interests</SectionTitle>
            <InterestsContainer>
              {interests.interests.map((interest, idx) => (
                <InterestBadge key={idx}>{interest}</InterestBadge>
              ))}
            </InterestsContainer>
          </Section>
        )}
      </Content>
    </Container>
  );
};

export default PublicProfilePage;
