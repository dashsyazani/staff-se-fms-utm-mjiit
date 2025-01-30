// controllers/commentController.js
const Comment = require('../models/Comment');

exports.postComment = async (req, res) => {
  try {
    const { fileId, content } = req.body;
    const userId = req.user.userId;

    const newComment = new Comment({ fileId, userId, content });
    await newComment.save();
    res.json({ msg: 'Comment added', comment: newComment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { fileId } = req.params;
    const comments = await Comment.find({ fileId })
      .populate('userId', 'displayName profilePicture')
      .sort({ createdAt: -1 });
    res.json({ comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
