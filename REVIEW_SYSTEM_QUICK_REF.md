# Review System - Developer Quick Reference

## 📋 Quick Overview
Review system allows users to rate/review each other's portfolios with admin moderation.

## 🔗 Main Files Location

### Backend
```
server/
├── models/common/Review.js          (Database schema)
├── controllers/reviewController.js  (Business logic)
└── routes/reviewRoutes.js           (API endpoints)
```

### Frontend
```
client/src/
├── components/
│   ├── ReviewModal.jsx              (Submit review form)
│   ├── ReviewSection.jsx            (Display reviews)
│   └── Admin/PendingReviewsPanel.jsx(Admin management)
└── pages/
    ├── PublicProfilePage.jsx        (Review on profiles)
    ├── dashboard/Dashboard.jsx      (See reviews received)
    ├── AdminDashboard.jsx           (Manage all reviews)
    └── Home.jsx                     (Review info card)
```

## 🎯 API Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/reviews` | Yes | Create review |
| GET | `/api/reviews/user/:userId` | No | Get published reviews |
| GET | `/api/reviews/stats/:userId` | No | Get rating stats |
| GET | `/api/reviews/pending/:userId` | Yes | Get pending reviews |
| PATCH | `/api/reviews/:reviewId/approve` | Yes | Approve review |
| PATCH | `/api/reviews/:reviewId/reject` | Yes | Reject review |
| GET | `/api/reviews/admin/all` | Admin | Get all reviews |
| DELETE | `/api/reviews/:reviewId` | Admin | Delete review |

## 💾 Review Status Flow

```
pending → (admin approves) → approved (+ isPublished: true)
       → (admin rejects)  → rejected (isPublished: false)
```

## 🖼️ Component Props

### ReviewModal
```jsx
<ReviewModal
  isOpen={boolean}
  onClose={() => {}}
  reviewedUserId={string}      // User being reviewed
  onReviewSubmitted={() => {}} // Callback when review submitted
/>
```

### ReviewSection
```jsx
<ReviewSection
  userId={string}  // User whose reviews to display
/>
```

### PendingReviewsPanel
```jsx
<PendingReviewsPanel />  // No props needed, fetches all reviews
```

## 🔑 Key Features

| Feature | Location | Details |
|---------|----------|---------|
| Auto Role Population | Controller | Fetches from Experience model |
| Self-Review Prevention | Modal & Controller | Can't review yourself |
| Duplicate Prevention | Controller | One review per user pair |
| Admin Moderation | Controller | All reviews pending by default |
| Stats Calculation | Controller | Auto-calculates rating average |
| Rating Distribution | Component | Shows breakdown of ratings |

## 🧪 Testing Checklist

- [ ] Create review from PublicProfilePage
- [ ] Review shows as pending
- [ ] Admin approves review
- [ ] Review appears in ReviewSection
- [ ] Statistics update correctly
- [ ] User role shows correctly
- [ ] Can't review yourself
- [ ] Can't duplicate review
- [ ] Reject hides review
- [ ] Delete removes review

## 📝 Common Code Snippets

### Fetch Reviews
```javascript
const response = await fetch(`/api/reviews/user/${userId}`);
const data = await response.json();
console.log(data.data); // Array of reviews
```

### Create Review
```javascript
const response = await fetch('/api/reviews', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    reviewedUserId: userId,
    stars: 5,
    message: 'Great work!'
  })
});
```

### Get Statistics
```javascript
const response = await fetch(`/api/reviews/stats/${userId}`);
const { data } = await response.json();
console.log(data.averageRating);      // "4.8"
console.log(data.totalReviews);       // 15
console.log(data.ratingBreakdown[5]); // 12
```

## 🔄 Integration Points

1. **PublicProfilePage**: Review button + modal + section
2. **Dashboard**: ReviewSection to show received reviews
3. **AdminDashboard**: PendingReviewsPanel for moderation
4. **Home**: Info card about reviews

## ⚠️ Important Notes

- Reviews require authentication (except viewing published)
- All reviews start as "pending"
- Only approved + published reviews show publicly
- Professional role auto-fetched from Experience
- Falls back to "User" if no experience found
- Admin-only endpoints require `adminOnly` middleware

## 🐛 Debugging

**Reviews not showing?**
- Check `isPublished: true` and `status: approved`
- Verify user is viewing published reviews

**User role shows "User"?**
- User has no Experience entry in portfolio
- Add work experience and reviews will show actual title

**Modal won't open?**
- User not logged in
- User viewing their own profile
- Check browser console for errors

**Stats incorrect?**
- Refresh page
- Check database for correct review count
- Verify status and isPublished fields

## 📚 Related Middleware

```javascript
// server/middleware/auth.js
auth  // Requires authenticated user

// server/middleware/adminOnly.js
adminOnly  // Requires admin role
```

## 🎨 Styling Notes

- Components use styled-components
- Colors: Blue (#3b82f6) primary, Yellow (#fbbf24) stars
- Responsive design: breakpoint at 768px
- Smooth animations and transitions
- Icons from lucide-react

## 🚀 Deployment Notes

- Review routes automatically included in server
- Database indexes created in model
- No additional environment variables needed
- Works with existing auth system
- MongoDB connection already established

---

**Last Updated**: 2024-04-20
**Status**: ✅ Production Ready
