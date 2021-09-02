const User = require('../models/User.model');
const Notification = require('../models/Notification.model');

const setNotificationsToUnread = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user.unreadNotification) {
      user.unreadNotification = true;
    }
  } catch (error) {
    console.error(error);
  }
};

const newLikeNotification = async (userToNotifyId, userWhoLikedId, postId) => {
  try {
    const userToNofify = await Notification.findOne({ user: userToNotifyId });
    const notification = {
      type: 'like',
      user: userWhoLikedId,
      post: postId,
      date: Date.now(),
    };

    userToNofify.notifications.unshift(notification);
    await userToNofify.save();

    await setNotificationsToUnread(userToNotifyId);
  } catch (error) {
    console.error(error);
  }
};

const removeLikeNotification = async (
  userToNotifyId,
  userWhoLikedId,
  postId
) => {
  try {
    await Notification.findOneAndUpdate(
      { user: userToNotifyId },
      {
        $pull: {
          notifications: {
            type: 'like',
            user: userWhoLikedId,
            post: postId,
          },
        },
      }
    );
  } catch (error) {
    console.error(error);
  }
};

const newCommentNotification = async (
  userToNotifyId,
  userWhoCommentedId,
  postId,
  commentId,
  commentText
) => {
  try {
    const userToNotify = await Notification.findOne({ user: userToNotifyId });
    const notification = {
      type: 'comment',
      user: userWhoCommentedId,
      post: postId,
      commentId,
      text: commentText,
      date: Date.now(),
    };

    userToNotify.notifications.unshift(notification);
    await userToNotify.save();

    await setNotificationsToUnread(userToNotifyId);
  } catch (error) {
    console.error(error);
  }
};

const removeCommentNotification = async (
  userToNotifyId,
  userWhoCommentedId,
  postId,
  commentId
) => {
  try {
    await Notification.findOneAndUpdate(
      { user: userToNotifyId },
      {
        $pull: {
          notifications: {
            type: 'comment',
            user: userWhoCommentedId,
            post: postId,
            commentId,
          },
        },
      }
    );
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  newLikeNotification,
  removeLikeNotification,
  newCommentNotification,
  removeCommentNotification,
};
