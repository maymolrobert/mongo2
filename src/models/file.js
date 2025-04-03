// src/models/file.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    path: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', fileSchema);
