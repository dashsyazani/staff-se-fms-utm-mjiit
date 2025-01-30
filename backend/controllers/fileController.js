// controllers/fileController.js
const File = require('../models/File');
const fs = require('fs');

exports.uploadFile = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

    const {
      section,
      lecturerName,
      courseNameCode,
      sessionSemester,
      courseOwner,
      isPublic
    } = req.body;

    const newFile = new File({
      userId,
      section,
      metadata: {
        lecturerName,
        courseNameCode,
        sessionSemester,
        courseOwner
      },
      filename: req.file.filename,
      filePath: req.file.path,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      isPublic: isPublic === 'true',
      lastEdited: new Date()
    });

    await newFile.save();
    res.status(201).json({ msg: 'File uploaded successfully', file: newFile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.getFiles = async (req, res) => {
  try {
    const userId = req.user.userId;
    const files = await File.find({ userId }).sort({ createdAt: -1 });
    res.json({ files });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const fileId = req.params.id;
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ msg: 'File not found' });
    if (file.userId.toString() !== userId) return res.status(401).json({ msg: 'Not authorized' });

    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }
    await File.findByIdAndDelete(fileId);
    res.json({ msg: 'File deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.getPublicFiles = async (req, res) => {
  try {
    const publicFiles = await File.find({ isPublic: true }).sort({ createdAt: -1 });
    res.json({ files: publicFiles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateFile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const fileId = req.params.id;
    const { isPublic } = req.body;

    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ msg: 'File not found' });
    if (file.userId.toString() !== userId) return res.status(401).json({ msg: 'Not authorized' });

    file.isPublic = isPublic === 'true';
    file.lastEdited = new Date();
    await file.save();
    res.json({ msg: 'File updated', file });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
