// models/File.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  section: { type: String, required: true },
  metadata: {
    lecturerName: { type: String },
    courseNameCode: { type: String },
    sessionSemester: { type: String },
    courseOwner: { type: String }
  },
  filename: { type: String, required: true },
  filePath: { type: String, required: true },
  fileSize: { type: Number },
  fileType: { type: String },
  isPublic: { type: Boolean, default: false },
  lastEdited: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);
