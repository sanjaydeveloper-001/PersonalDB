import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  Mail, Shield, Clock, MapPin, Send, CheckCircle,
  User, AtSign, Tag, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

/* ── Main wrapper ───────────────────────────────────────── */

const Wrapper = styled.div`
  max-width: 100%;
  margin: 0 auto;
`;

const PageTop = styled.div`
  margin-bottom: 24px;
  animation: ${fadeUp} 0.45s ease both;

  h1 {
    font-size: 24px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.3px;
    margin: 0 0 6px;
  }
  p {
    font-size: 14px;
    color: #64748b;
    margin: 0;
    font-weight: 400;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 24px;
  align-items: start;

  @media (max-width: 880px) { grid-template-columns: 1fr; }
`;

/* ── Left panel ─────────────────────────────────────────── */

const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: ${fadeUp} 0.45s 0.08s ease both;
`;

const InfoCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #d1d5db;
    background: #f9fafb;
  }
`;

const IcoBg = styled.div`
  width: 36px;
  height: 36px;
  min-width: 36px;
  background: #f3f4f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
`;

const InfoBody = styled.div`
  label {
    display: block;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    color: #9ca3af;
    margin-bottom: 2px;
  }
  p, a {
    font-size: 13px;
    font-weight: 500;
    color: #374151;
    margin: 0;
    text-decoration: none;
    word-break: break-all;
    overflow-wrap: break-word;
    display: block;
  }
  a:hover { color: #1e40af; text-decoration: underline; }
`;

const SecurityBox = styled.div`
  background: linear-gradient(135deg, #1e40af, #2563eb);
  border-radius: 10px;
  padding: 16px;
  color: white;
  margin-top: 4px;

  .head {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 12px;
    font-weight: 600;
  }
  p {
    font-size: 12px;
    line-height: 1.5;
    color: rgba(255,255,255,0.85);
    margin: 0;
  }
  a { color: #93c5fd; text-decoration: none; }
  a:hover { text-decoration: underline; }
`;

/* ── Form card ──────────────────────────────────────────── */

const FormCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 28px;
  animation: ${fadeUp} 0.45s 0.12s ease both;

  @media (max-width: 600px) { padding: 20px; }
`;

const FormHead = styled.div`
  margin-bottom: 24px;
  h2 {
    font-size: 18px;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 4px;
    letter-spacing: -0.2px;
  }
  p {
    font-size: 12px;
    color: #9ca3af;
    margin: 0;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 520px) { grid-template-columns: 1fr; }
`;

const Field = styled.div`
  margin-bottom: 16px;
  &:last-child { margin-bottom: 0; }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
  svg { color: #6b7280; }
  em { color: #ef4444; font-style: normal; margin-left: 1px; }
`;

const inputCss = `
  width: 100%;
  padding: 9px 12px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 400;
  color: #1f2937;
  background: #f9fafb;
  transition: all 0.15s ease;
  line-height: 1.5;
  word-break: break-word;
  overflow-wrap: break-word;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
  }
  &::placeholder { color: #d1d5db; }
  &:disabled {
    background: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

const Input    = styled.input`${inputCss}`;
const Textarea = styled.textarea`${inputCss} resize: vertical; min-height: 110px;`;
const Select   = styled.select`
  ${inputCss}
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239ca3af' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-color: #f9fafb;
  padding-right: 36px;
`;

const Hint = styled.p`
  font-size: 11px;
  color: ${p => p.$warn ? '#ef4444' : '#9ca3af'};
  margin: 4px 0 0;
  text-align: right;
`;

const SendBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.05px;
  transition: all 0.2s ease;
  margin-top: 4px;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(59,130,246,0.2);
  }
  &:active:not(:disabled) { transform: translateY(0); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const Success = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 20px;
  animation: ${fadeIn} 0.3s ease both;

  svg { color: #16a34a; flex-shrink: 0; margin-top: 1px; }
  strong { display: block; font-size: 12px; color: #15803d; margin-bottom: 2px; }
  p { font-size: 12px; color: #166534; margin: 0; line-height: 1.5; }
`;

/* ══════════════════════════════════════════════════════════ */

export default function ContactPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    issueType: '',
    message: '',
  });
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Sync form when user data loads
  useEffect(() => {
    if (user?.username || user?.email) {
      setForm(p => ({
        ...p,
        username: user.username || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const issueTypes = [
    { value: 'bug',      label: 'Bug Report' },
    { value: 'feature',  label: 'Feature Request' },
    { value: 'general',  label: 'General Support' },
    { value: 'billing',  label: 'Billing Question' },
    { value: 'security', label: 'Security Issue' },
    { value: 'other',    label: 'Other' },
  ];

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.username.trim())                                 { toast.error('Username is required'); return false; }
    if (!form.email.trim() || !form.email.includes('@'))       { toast.error('Valid email is required'); return false; }
    if (!form.issueType)                                       { toast.error('Please select an issue type'); return false; }
    if (!form.message.trim() || form.message.length < 10)     { toast.error('Message must be at least 10 characters'); return false; }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res  = await fetch('http://localhost:5000/api/contact/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        setForm({ username: '', email: '', issueType: '', message: '' });
        toast.success("Message sent! We'll get back to you soon.");
        setTimeout(() => setSubmitted(false), 6000);
      } else {
        toast.error(data.message || 'Failed to send message');
      }
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <PageTop>
        <h1>Contact Support</h1>
        <p>We usually respond within a few hours. Fill in the details below and we'll get back to you.</p>
      </PageTop>

      <Grid>
        <Left>
          <InfoCard>
            <IcoBg><Mail size={17} /></IcoBg>
            <InfoBody>
              <label>Email Support</label>
              <a href="mailto:noreply.josantechnologies@gmail.com">noreply.josantechnologies@gmail.com</a>
            </InfoBody>
          </InfoCard>

          <InfoCard>
            <IcoBg><Shield size={17} /></IcoBg>
            <InfoBody>
              <label>Security Issues</label>
              <a href="mailto:noreply.josantechnologies@gmail.com">noreply.josantechnologies@gmail.com</a>
            </InfoBody>
          </InfoCard>

          <InfoCard>
            <IcoBg><Clock size={17} /></IcoBg>
            <InfoBody>
              <label>Response Time</label>
              <p>Usually within 24 hours</p>
            </InfoBody>
          </InfoCard>

          <InfoCard>
            <IcoBg><MapPin size={17} /></IcoBg>
            <InfoBody>
              <label>Location</label>
              <p>India</p>
            </InfoBody>
          </InfoCard>

          <SecurityBox>
            <div className="head"><Shield size={15} /> Security First</div>
            <p>
              For urgent security vulnerabilities, email{' '}
              <a href="mailto:noreply.josantechnologies@gmail.com">noreply.josantechnologies@gmail.com</a>{' '}
              directly — we treat these with the highest priority.
            </p>
          </SecurityBox>
        </Left>

        <FormCard>
          <FormHead>
            <h2>Send a Message</h2>
            <p>All fields marked * are required</p>
          </FormHead>

          {submitted && (
            <Success>
              <CheckCircle size={17} />
              <div>
                <strong>Message sent successfully!</strong>
                <p>We'll review it and respond within 24 hours.</p>
              </div>
            </Success>
          )}

          <form onSubmit={handleSubmit}>
            <Row>
              <Field>
                <Label><User size={12} /> Username <em>*</em></Label>
                <Input
                  type="text" name="username" placeholder="your_username"
                  value={form.username} onChange={handleChange} disabled={!!user}
                />
              </Field>
              <Field>
                <Label><AtSign size={12} /> Email Address <em>*</em></Label>
                <Input
                  type="email" name="email" placeholder="you@example.com"
                  value={form.email} onChange={handleChange} disabled={!!user}
                />
              </Field>
            </Row>

            <Field>
              <Label><Tag size={12} /> Issue Type <em>*</em></Label>
              <Select name="issueType" value={form.issueType} onChange={handleChange}>
                <option value="">Select what this is about...</option>
                {issueTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </Select>
            </Field>

            <Field>
              <Label><FileText size={12} /> Message <em>*</em></Label>
              <Textarea
                name="message"
                placeholder="Describe your issue or question in detail..."
                value={form.message} onChange={handleChange}
              />
              {form.message.length > 0 && (
                <Hint $warn={form.message.length < 10}>
                  {form.message.length} chars{form.message.length < 10 ? ` — ${10 - form.message.length} more needed` : ''}
                </Hint>
              )}
            </Field>

            <SendBtn type="submit" disabled={loading}>
              <Send size={14} />
              {loading ? 'Sending...' : 'Send Message'}
            </SendBtn>
          </form>
        </FormCard>
      </Grid>
    </Wrapper>
  );
}