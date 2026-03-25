import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Search, X, Loader, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import searchService from '../../services/searchService';

/* ─── Animations ─────────────────────────────────────────── */
const fadeSlideDown = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
`;

/* ─── Styled Components ───────────────────────────────────── */
const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  font-family: 'Outfit', system-ui, sans-serif;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 12px;
  border: 2px solid ${({ $focused }) => ($focused ? '#3b82f6' : '#dbeafe')};
  background: #fff;
  transition: border-color 0.25s, box-shadow 0.25s;
  box-shadow: ${({ $focused }) =>
    $focused
      ? '0 0 0 4px rgba(59,130,246,0.12), 0 4px 20px rgba(59,130,246,0.08)'
      : '0 2px 8px rgba(15,45,107,0.06)'};
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ $focused }) => ($focused ? '#3b82f6' : '#94a3b8')};
  display: flex;
  align-items: center;
  pointer-events: none;
  transition: color 0.25s;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.8rem 2.75rem 0.8rem 2.75rem;
  border: none;
  border-radius: 12px;
  font-size: 0.92rem;
  font-family: 'Outfit', system-ui, sans-serif;
  font-weight: 450;
  color: #1e293b;
  background: transparent;
  caret-color: #3b82f6;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #b0bec5;
    font-weight: 400;
  }

  @media (max-width: 640px) {
    padding: 0.7rem 2.5rem 0.7rem 2.5rem;
    font-size: 0.87rem;
  }
`;

const RightIconWrapper = styled.div`
  position: absolute;
  right: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const ClearBtn = styled.button`
  background: #eff6ff;
  border: none;
  color: #93c5fd;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s, transform 0.15s;

  &:hover {
    background: #dbeafe;
    color: #3b82f6;
    transform: scale(1.1);
  }
  &:active {
    transform: scale(0.95);
  }
`;

const SpinningLoader = styled(Loader)`
  animation: ${spin} 0.8s linear infinite;
  color: #3b82f6;
`;

/* ─── Dropdown ────────────────────────────────────────────── */
const DropdownContainer = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1.5px solid #dbeafe;
  border-radius: 12px;
  max-height: 320px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow:
    0 12px 40px rgba(15, 45, 107, 0.12),
    0 4px 12px rgba(59, 130, 246, 0.08);
  animation: ${fadeSlideDown} 0.18s ease;

  /* Custom scrollbar */
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-track { background: #f8fafc; border-radius: 99px; }
  &::-webkit-scrollbar-thumb { background: #bfdbfe; border-radius: 99px; }
  &::-webkit-scrollbar-thumb:hover { background: #93c5fd; }
`;

const DropdownHeader = styled.div`
  padding: 0.55rem 1rem 0.4rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #94a3b8;
  border-bottom: 1px solid #f1f5f9;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 0.7rem 1rem;
  border: none;
  background: ${({ $active }) => ($active ? '#eff6ff' : 'transparent')};
  text-align: left;
  cursor: pointer;
  transition: background 0.15s;
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: 0.9rem;
  color: ${({ $active }) => ($active ? '#1e40af' : '#334155')};
  border-bottom: 1px solid #f8fafc;
  display: flex;
  align-items: center;
  gap: 0.65rem;

  &:last-child {
    border-bottom: none;
    border-radius: 0 0 12px 12px;
  }
  &:first-of-type {
    border-radius: ${({ $hasHeader }) => ($hasHeader ? '0' : '12px 12px 0 0')};
  }

  &:hover {
    background: #eff6ff;
    color: #1e40af;
  }

  @media (max-width: 640px) {
    padding: 0.65rem 0.875rem;
    font-size: 0.86rem;
  }
`;

const AvatarCircle = styled.div`
  width: 30px;
  height: 30px;
  min-width: 30px;
  border-radius: 50%;
  background: ${({ $active }) =>
    $active
      ? 'linear-gradient(135deg, #3b82f6, #6366f1)'
      : 'linear-gradient(135deg, #bfdbfe, #e0e7ff)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $active }) => ($active ? '#fff' : '#93c5fd')};
  font-size: 0.75rem;
  font-weight: 600;
  transition: background 0.2s;
`;

const Username = styled.span`
  flex: 1;
  font-weight: 500;
`;

const Handle = styled.span`
  font-size: 0.76rem;
  color: ${({ $active }) => ($active ? '#93c5fd' : '#cbd5e1')};
  font-weight: 400;
`;

const ArrowHint = styled(ArrowRight)`
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  color: #3b82f6;
  transition: opacity 0.15s;

  ${DropdownItem}:hover & {
    opacity: 1;
  }
`;

const EmptyMessage = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: #94a3b8;
  font-size: 0.875rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  span {
    font-weight: 600;
    color: #64748b;
  }
`;

const LoadingContainer = styled.div`
  padding: 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const ShimmerLine = styled.div`
  height: ${({ $h }) => $h || '16px'};
  width: ${({ $w }) => $w || '100%'};
  border-radius: 6px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 400px 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
`;

const ShimmerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const KbdHint = styled.div`
  padding: 0.4rem 1rem;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
  border-radius: 0 0 12px 12px;
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Kbd = styled.kbd`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.68rem;
  color: #94a3b8;
  font-family: 'Outfit', system-ui, sans-serif;

  span {
    background: #e2e8f0;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    padding: 1px 5px;
    font-size: 0.66rem;
    color: #64748b;
    line-height: 1.4;
  }
`;

/* ─── Component ───────────────────────────────────────────── */
const SearchBar = ({ onSelectUser }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef(null);
  const listRef = useRef(null);

  /* Debounced search */
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 0) {
        setLoading(true);
        try {
          const users = await searchService.searchPublicUsers(query);
          setResults(users || []);
          setShowDropdown(true);
          setActiveIndex(-1);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  /* Scroll active item into view */
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-item]');
      items[activeIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const handleSelectUser = useCallback(
    (username) => {
      navigate(`/u/${username}`);
      setQuery('');
      setResults([]);
      setShowDropdown(false);
      setActiveIndex(-1);
      if (onSelectUser) onSelectUser(username);
    },
    [navigate, onSelectUser]
  );

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowDropdown(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && results[activeIndex]) {
        handleSelectUser(results[activeIndex].username);
      }
    } else if (e.key === 'Escape') {
      handleClear();
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  const getInitials = (username) =>
    username ? username.slice(0, 2).toUpperCase() : '??';

  return (
    <SearchContainer>
      <InputWrapper $focused={focused}>
        <SearchIconWrapper $focused={focused}>
          <Search size={17} strokeWidth={2.2} />
        </SearchIconWrapper>

        <SearchInput
          ref={inputRef}
          type="text"
          placeholder="Search public profiles..."
          value={query}
          autoComplete="off"
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setFocused(true);
            if (query && results.length) setShowDropdown(true);
          }}
          onBlur={() => {
            setTimeout(() => {
              setShowDropdown(false);
              setFocused(false);
            }, 160);
          }}
          onKeyDown={handleKeyDown}
          aria-label="Search public profiles"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
        />

        <RightIconWrapper>
          {loading && <SpinningLoader size={15} />}
          {query && !loading && (
            <ClearBtn onClick={handleClear} aria-label="Clear search">
              <X size={14} strokeWidth={2.5} />
            </ClearBtn>
          )}
        </RightIconWrapper>
      </InputWrapper>

      {showDropdown && (
        <DropdownContainer role="listbox" ref={listRef}>
          {loading ? (
            <LoadingContainer>
              {[80, 65, 75].map((w, i) => (
                <ShimmerRow key={i}>
                  <ShimmerLine $h="30px" $w="30px" style={{ borderRadius: '50%', minWidth: '30px' }} />
                  <ShimmerLine $h="14px" $w={`${w}%`} />
                </ShimmerRow>
              ))}
            </LoadingContainer>
          ) : results.length > 0 ? (
            <>
              <DropdownHeader>Profiles · {results.length} found</DropdownHeader>
              {results.map((user, idx) => (
                <DropdownItem
                  key={user._id}
                  data-item
                  $active={idx === activeIndex}
                  $hasHeader
                  role="option"
                  aria-selected={idx === activeIndex}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseLeave={() => setActiveIndex(-1)}
                  onClick={() => handleSelectUser(user.username)}
                >
                  <AvatarCircle $active={idx === activeIndex}>
                    {getInitials(user.username)}
                  </AvatarCircle>
                  <Username>@{user.username}</Username>
                  {user.displayName && (
                    <Handle $active={idx === activeIndex}>{user.displayName}</Handle>
                  )}
                  <ArrowHint size={14} $active={idx === activeIndex} />
                </DropdownItem>
              ))}
              <KbdHint>
                <Kbd><span>↑↓</span> navigate</Kbd>
                <Kbd><span>↵</span> select</Kbd>
                <Kbd><span>Esc</span> dismiss</Kbd>
              </KbdHint>
            </>
          ) : query.length > 0 ? (
            <EmptyMessage>
              <Search size={22} strokeWidth={1.5} />
              No results for <span>"{query}"</span>
            </EmptyMessage>
          ) : null}
        </DropdownContainer>
      )}
    </SearchContainer>
  );
};

export default SearchBar;