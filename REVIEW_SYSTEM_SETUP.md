# Review System - Quick Start Guide

## What Was Created

### Backend Files
1. **Model**: `server/models/common/Review.js`
2. **Controller**: `server/controllers/reviewController.js`
3. **Routes**: `server/routes/reviewRoutes.js`
4. **Integration**: Updated `server/server.js` to include review routes

### Frontend Components
1. **ReviewModal.jsx** - Modal for submitting reviews
2. **ReviewSection.jsx** - Display reviews with statistics
3. **PendingReviewsPanel.jsx** - Admin review management

### Page Updates
1. **PublicProfilePage.jsx** - Added review button & section
2. **Dashboard.jsx** - Added ReviewSection
3. **AdminDashboard.jsx** - Added review management tab
4. **Home.jsx** - Added review info card

## How to Use

### For Regular Users
1. Go to any user's public profile (`/u/[portdomain]`)
2. Click "Leave a Review" button
3. Select rating (1-5 stars)
4. Write review message
5. Click "Submit Review"
6. Review goes to pending status

### For Portfolio Owners
1. Go to Dashboard
2. Scroll down to "Reviews & Ratings" section
3. View all approved reviews
4. See review statistics (avg rating, distribution)

### For Admins
1. Go to Admin Dashboard (if role is 'admin')
2. Click "Reviews" tab in sidebar
3. Manage pending reviews:
   - **Approve**: Published and visible on profile
   - **Reject**: Rejected and not published
   - **Delete**: Permanently remove review
4. Switch between Pending/Approved/Rejected tabs

## Review Status Flow
```
User Creates Review
    ↓
Review Created (Status: pending)
    ↓
Admin Reviews
    ↓
Approve → Published (isPublished: true)
Reject → Rejected (isPublished: false)
    ↓
Visible on User's Profile or Rejected List
```

## API Testing with cURL

### Create Review
```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Cookie: [your_auth_cookie]" \
  -d '{
    "reviewedUserId": "[userId]",
    "stars": 5,
    "message": "Great portfolio and professional!"
  }'
```

### Get Published Reviews
```bash
curl http://localhost:5000/api/reviews/user/[userId]
```

### Get Statistics
```bash
curl http://localhost:5000/api/reviews/stats/[userId]
```

### Approve Review (Admin)
```bash
curl -X PATCH http://localhost:5000/api/reviews/[reviewId]/approve \
  -H "Content-Type: application/json" \
  -H "Cookie: [admin_auth_cookie]" \
  -d '{"publish": true}'
```

## Notes
- Reviews require authentication
- Users cannot review themselves
- Professional role auto-populated from Experience model
- User role falls back to "User" if no experience found
- All reviews are pending until admin approval
- Admin moderation is automatic (no email notifications yet)

## Troubleshooting
- If reviews not showing: Check isPublished and status fields
- If user role shows "User": User has no Experience entry
- If modal won't open: Ensure user is logged in and not viewing own profile
