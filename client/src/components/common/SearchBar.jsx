import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { Search, Loader2, User } from 'lucide-react'
import { searchUsers } from '../../services/searchService'

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
`

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`

const SpinnerIcon = styled(Loader2)`
  width: 15px !important;
  height: 15px !important;
  color: #94a3b8;
  flex-shrink: 0;
  animation: ${spin} 0.8s linear infinite;
`

const Wrapper = styled.div`
  position: relative;
  width: ${props => props.$width || '260px'};
`

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f1f5f9;
  border: 1.5px solid transparent;
  border-radius: 10px;
  padding: 0.45rem 0.75rem;
  transition: border-color 0.2s, background 0.2s;

  &:focus-within {
    background: white;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  }

  svg { width: 15px; height: 15px; color: #94a3b8; flex-shrink: 0; }
`

const Input = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.875rem;
  color: #0f172a;
  outline: none;
  min-width: 0;

  &::placeholder { color: #94a3b8; }
`

const Dropdown = styled.ul`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid rgba(59, 130, 246, 0.15);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  list-style: none;
  margin: 0;
  padding: 0.375rem;
  z-index: 2000;
  animation: ${fadeIn} 0.15s ease;
  max-height: 320px;
  overflow-y: auto;
`

const ResultItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.625rem;
  border-radius: 7px;
  cursor: pointer;
  font-size: 0.875rem;
  color: #334155;
  transition: background 0.13s;

  &:hover, &[data-active='true'] {
    background: #eff6ff;
    color: #1e40af;
  }

  svg { width: 14px; height: 14px; color: #94a3b8; flex-shrink: 0; }
`

const Highlight = styled.mark`
  background: transparent;
  color: #1e40af;
  font-weight: 600;
`

const EmptyMsg = styled.li`
  padding: 0.6rem 0.625rem;
  font-size: 0.85rem;
  color: #94a3b8;
  text-align: center;
`

function highlightMatch(text, query) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <Highlight>{text.slice(idx, idx + query.length)}</Highlight>
      {text.slice(idx + query.length)}
    </>
  )
}

const SearchBar = ({ width, placeholder = 'Search users…' }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const navigate = useNavigate()
  const wrapperRef = useRef(null)
  const timerRef = useRef(null)

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      setOpen(false)
      return
    }
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await searchUsers(query)
        setResults(data)
        setOpen(true)
        setActiveIdx(-1)
      } catch (err) {
        console.error('User search failed:', err)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timerRef.current)
  }, [query])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const goToUser = useCallback((username) => {
    setOpen(false)
    setQuery('')
    navigate(`/u/${username}`)
  }, [navigate])

  const handleKeyDown = (e) => {
    if (!open || results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      goToUser(results[activeIdx].username)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <Wrapper $width={width} ref={wrapperRef}>
      <InputRow>
        {loading ? <SpinnerIcon /> : <Search />}
        <Input
          type="text"
          value={query}
          placeholder={placeholder}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (results.length > 0) setOpen(true) }}
          aria-label="Search users"
          aria-autocomplete="list"
          aria-expanded={open}
        />
      </InputRow>

      {open && (
        <Dropdown role="listbox">
          {results.length === 0 ? (
            <EmptyMsg>No users found</EmptyMsg>
          ) : (
            results.map((user, idx) => (
              <ResultItem
                key={user.username}
                role="option"
                data-active={idx === activeIdx}
                onMouseEnter={() => setActiveIdx(idx)}
                onClick={() => goToUser(user.username)}
              >
                <User />
                {highlightMatch(user.username, query.trim())}
              </ResultItem>
            ))
          )}
        </Dropdown>
      )}
    </Wrapper>
  )
}

export default SearchBar
