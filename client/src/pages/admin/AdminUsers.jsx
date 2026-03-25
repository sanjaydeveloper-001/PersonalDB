import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Trash2, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import SearchBar from '../../components/common/SearchBar'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    width: 24px;
    height: 24px;
    color: #3b82f6;
  }
`

const SearchWrapper = styled.div`
  width: 100%;
  max-width: 500px;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`

const StatCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.875rem;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  }
`

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.5rem;
`

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`

const Table = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.875rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr 1fr 0.6fr;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #64748b;
  font-size: 0.875rem;

  @media (max-width: 768px) {
    display: none;
  }
`

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr 1fr 0.6fr;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  font-size: 0.875rem;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 1.5rem;
    background: #f8fafc;
    margin-bottom: 1rem;
    border-radius: 0.625rem;
  }
`

const UserName = styled.div`
  font-weight: 600;
  color: #0f172a;
`

const Email = styled.div`
  color: #64748b;
  font-size: 0.8rem;
`

const RoleSelect = styled.select`
  padding: 0.375rem 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.8rem;
  cursor: pointer;
  background: white;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`

const IconBtn = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 0.4rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg { width: 16px; height: 16px; }
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #64748b;

  svg {
    animation: spin 1s linear infinite;
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  }
`

const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: #94a3b8;
  font-size: 0.875rem;
`

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [updating, setUpdating] = useState(null)
  const [filteredUsers, setFilteredUsers] = useState([])

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  useEffect(() => {
    fetchUsers()
  }, [])

  // Update filtered users whenever users change
  useEffect(() => {
    setFilteredUsers(users)
  }, [users])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/admin/users`, {
        credentials: 'include',
      })
      const data = await response.json()

      if (data.success) {
        setUsers(data.users)
        setStats(data.stats)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateRole = async (userId, newRole) => {
    setUpdating(userId)
    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
        credentials: 'include',
      })
      const data = await response.json()

      if (data.success) {
        toast.success('User role updated')
        fetchUsers()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to update role')
    } finally {
      setUpdating(null)
    }
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return

    setDeleting(userId)
    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await response.json()

      if (data.success) {
        toast.success('User deleted')
        fetchUsers()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to delete user')
    } finally {
      setDeleting(null)
    }
  }

  // Handler for SearchBar - filters users by username or email
  const handleSearchSelect = (username) => {
    const selected = users.filter(user =>
      user.username.toLowerCase().includes(username.toLowerCase()) ||
      user.email.toLowerCase().includes(username.toLowerCase())
    )
    setFilteredUsers(selected)
  }

  if (loading) {
    return (
      <LoadingContainer>
        <Loader />
        Loading users...
      </LoadingContainer>
    )
  }

  return (
    <Container>
      <Header>
        <Title>👥 Users Management</Title>
        <SearchWrapper>
          <SearchBar onSelectUser={handleSearchSelect} />
        </SearchWrapper>
      </Header>

      {stats && (
        <StatsGrid>
          <StatCard>
            <StatValue>{stats.total}</StatValue>
            <StatLabel>Total Users</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.admins}</StatValue>
            <StatLabel>Admins</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.regularUsers}</StatValue>
            <StatLabel>Regular Users</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.activeToday}</StatValue>
            <StatLabel>Active Today</StatLabel>
          </StatCard>
        </StatsGrid>
      )}

      <Table>
        <TableHeader>
          <div>User</div>
          <div>Email</div>
          <div>Role</div>
          <div>Joined</div>
          <div>Actions</div>
        </TableHeader>

        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <TableRow key={user._id}>
              <UserName>@{user.username}</UserName>
              <Email>{user.email}</Email>
              <div>
                <RoleSelect
                  value={user.role}
                  onChange={e => handleUpdateRole(user._id, e.target.value)}
                  disabled={updating === user._id}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </RoleSelect>
              </div>
              <div>
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
              <Actions>
                <IconBtn
                  onClick={() => handleDelete(user._id)}
                  disabled={deleting === user._id}
                  title="Delete user"
                >
                  {deleting === user._id ? <Loader size={16} /> : <Trash2 />}
                </IconBtn>
              </Actions>
            </TableRow>
          ))
        ) : (
          <EmptyState>
            No users found
          </EmptyState>
        )}
      </Table>
    </Container>
  )
}

export default AdminUsers