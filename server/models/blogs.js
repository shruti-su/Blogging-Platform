// publish blog api fields
// blog type = string
// blog title = string
// blog sub title = string
// blog content rich text
// attached images (optional) =  blob


const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
    blogType: { type: String, required: true },
    blogTitle: { type: String, required: true },
    blogSubTitle: { type: String, required: true },
    blogContent: { type: String, required: true },
    attachedImages: [{ data: Buffer, contentType: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
});
module.exports = mongoose.model('Blogs', blogSchema);