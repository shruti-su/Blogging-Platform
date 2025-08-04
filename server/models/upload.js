const mongoose = require('mongoose');
const UploadSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileName: {
        type: String,
        required: true,
        trim: true
    },
    fileType: {
        type: String,
        required: true,
        enum: ['xlsx', 'xls', 'csv'],
        trim: true
    },
    fileSize: {
        type: Number,
        required: true,
        min: 0
    },
    data: {
        type: Array,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    },
  
});
module.exports = mongoose.model('Upload', UploadSchema);