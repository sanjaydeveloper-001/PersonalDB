import User from '../models/common/User.js';
import Profile from '../models/portfolio/Profile.js';
import Item from '../models/vault/Item.js';
import transporter from '../services/email/transporter.js';
import { generateSignedUrl } from './vault/uploadController.js';

// Get unused users - criteria:
// - Less than 5 items in vault
// - Incomplete portfolio
// - Inactive for 60 days
export const getUnusedUsers = async (req, res) => {
  try {
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // Get all users
    const allUsers = await User.find({ role: 'user' })
      .select('-password')
      .lean();

    const unusedUsers = [];

    for (let user of allUsers) {
      // Check last activity (updatedAt)
      const lastActivity = new Date(user.updatedAt);
      const isInactive = lastActivity < sixtyDaysAgo;

      if (!isInactive) continue; // Skip active users

      // Count vault items
      const vaultItemCount = await Item.countDocuments({ user: user._id, deleted: false });

      if (vaultItemCount >= 5) continue; // Skip if they have 5+ items

      // Check portfolio completeness
      const profile = await Profile.findOne({ user: user._id });
      const isPortfolioIncomplete =
        !profile ||
        !profile.name ||
        !profile.domain ||
        !profile.summary ||
        ((!profile.contact || profile.contact.length === 0) &&
          (!profile.social || profile.social.length === 0));

      if (!isPortfolioIncomplete) continue; // Skip if portfolio is complete

      // Generate signed URL for profile image if it exists
      let signedProfileImage = user.profileImage;
      if (user.profileImage?.startsWith('avatars/')) {
        try {
          signedProfileImage = await generateSignedUrl(user.profileImage, 3600);
        } catch (err) {
          console.warn('[getUnusedUsers] Could not generate signed URL:', err.message);
        }
      }

      unusedUsers.push({
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: signedProfileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        vaultItems: vaultItemCount,
        lastActivity,
        deletionWarning: user.deletionWarning || {},
      });
    }

    // Separate into two groups
    const warningNotSent = unusedUsers.filter(u => !u.deletionWarning.emailSentAt);
    const warningNotActivated = unusedUsers.filter(
      u => u.deletionWarning.emailSentAt && !u.deletionWarning.becameActiveAfter
    );

    res.json({
      success: true,
      data: {
        warningNotSent,
        warningNotActivated,
        stats: {
          totalUnused: unusedUsers.length,
          pendingWarning: warningNotSent.length,
          pendingDeletion: warningNotActivated.length,
        },
      },
    });
  } catch (error) {
    console.error('getUnusedUsers error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Send deletion warning email to user
export const sendDeletionWarningEmail = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.email) {
      return res.status(400).json({
        success: false,
        message: 'User has no email address',
      });
    }

    // Calculate deletion date (7 days from now)
    const deletionScheduledFor = new Date();
    deletionScheduledFor.setDate(deletionScheduledFor.getDate() + 7);

    // Send email
    const emailContent = `
      <h2>Account Inactive Notice</h2>
      <p>Dear ${user.username},</p>
      <p>Your account has been inactive for 60 days and meets our criteria for unused accounts:</p>
      <ul>
        <li>Less than 5 items in vault</li>
        <li>Incomplete portfolio</li>
        <li>No activity for 60+ days</li>
      </ul>
      <p><strong>Your account will be scheduled for deletion in 7 days (${deletionScheduledFor.toLocaleDateString()}) if you don't become active.</strong></p>
      <p>To keep your account active, please log in and complete your portfolio or upload vault items.</p>
      <p>If you have any questions, please contact our support team.</p>
      <p>Best regards,<br>PersonalDB Team</p>
    `;

    await transporter.sendMail({
      from: `"PersonalDB" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Account Deletion Notice - Action Required',
      html: emailContent,
    });

    // Update user with warning info
    user.deletionWarning = {
      emailSentAt: new Date(),
      deletionScheduledFor,
      becameActiveAfter: false,
    };
    await user.save();

    res.json({
      success: true,
      message: 'Warning email sent successfully',
      deletionScheduledFor,
    });
  } catch (error) {
    console.error('sendDeletionWarningEmail error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Check if user became active and update status
export const checkUserActivity = async (req, res) => {
  try {
    const users = await User.find({
      'deletionWarning.emailSentAt': { $ne: null },
      'deletionWarning.becameActiveAfter': false,
    }).lean();

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    let updatedCount = 0;

    for (let user of users) {
      const lastActivity = new Date(user.updatedAt);
      const emailSentAt = new Date(user.deletionWarning.emailSentAt);

      // If user was active AFTER the warning email was sent
      if (lastActivity > emailSentAt) {
        await User.findByIdAndUpdate(
          user._id,
          { 'deletionWarning.becameActiveAfter': true },
          { new: true }
        );
        updatedCount++;
      }
    }

    res.json({
      success: true,
      message: `Activity check completed. ${updatedCount} users updated.`,
      updatedCount,
    });
  } catch (error) {
    console.error('checkUserActivity error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get ready-to-delete users (email sent 7+ days ago and still inactive)
export const getReadyForDeletion = async (req, res) => {
  try {
    const now = new Date();

    const readyForDeletion = await User.find({
      'deletionWarning.deletionScheduledFor': { $lte: now },
      'deletionWarning.becameActiveAfter': false,
    })
      .select('-password')
      .lean();

    res.json({
      success: true,
      data: readyForDeletion,
      count: readyForDeletion.length,
    });
  } catch (error) {
    console.error('getReadyForDeletion error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
