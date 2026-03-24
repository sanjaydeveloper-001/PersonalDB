import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Search, X, Loader } from 'lucide-react';
import searchService from '../../services/searchService';

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: #f1f5f9;
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #3b82f6;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  svg {
    width: 18px;
    height: 18px;
    color: #64748b;
    margin-right: 0.5rem;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.95rem;
  color: #0f172a;

  &::placeholder {
    color: #94a3b8;
  }
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: color 0.2s;

  &:hover {
    color: #0f172a;
  }

  svg {
    width: 18px;
    height: 18px;
    margin: 0;
  }
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-top: none;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: -2px;
`;

const ResultItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f8fafc;
  }

  &.highlighted {
    background: #eff6ff;
  }
`;

const ResultUsername = styled.div`
  font-weight: 500;
  color: #0f172a;
  font-size: 0.95rem;

  .highlight {
    background: #fef08a;
    padding: 0 2px;
    border-radius: 2px;
  }
`;

const EmptyState = styled.div`
  padding: 1.5rem 1rem;
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
`;

const LoadingState = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #64748b;

  svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const SearchBar = ({ placeholder = 'Search users...' }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Debounced search
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    debounceTimerRef.current = setTimeout(async () => {
      const searchResults = await searchService.searchUsers(query);
      setResults(searchResults);
      setShowDropdown(true);
      setHighlightedIndex(-1);
      setLoading(false);
    }, 300);

    return () => clearTimeout(debounceTimerRef.current);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!showDropdown || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelectUser(results[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowDropdown(false);
        break;
      default:
        break;
    }
  };

  const handleSelectUser = (user) => {
    navigate(`/u/${user.username}`);
    setQuery('');
    setShowDropdown(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowDropdown(false);
  };

  const highlightMatch = (text, query) => {
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="highlight">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <SearchContainer ref={searchRef}>
      <SearchInputWrapper>
        <Search />
        <SearchInput
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <ClearButton onClick={handleClear}>
            <X />
          </ClearButton>
        )}
      </SearchInputWrapper>

      {showDropdown && (
        <DropdownContainer>
          {loading ? (
            <LoadingState>
              <Loader size={16} />
              Searching...
            </LoadingState>
          ) : results.length > 0 ? (
            results.map((user, index) => (
              <ResultItem
                key={user.id}
                className={highlightedIndex === index ? 'highlighted' : ''}
                onClick={() => handleSelectUser(user)}
              >
                <ResultUsername>
                  {highlightMatch(user.username, query)}
                </ResultUsername>
              </ResultItem>
            ))
          ) : (
            <EmptyState>
              {query.length >= 2
                ? 'No users found'
                : 'Type at least 2 characters'}
            </EmptyState>
          )}
        </DropdownContainer>
      )}
    </SearchContainer>
  );
};

export default SearchBar;