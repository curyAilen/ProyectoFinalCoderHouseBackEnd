import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    user: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
});

const MessageModel = mongoose.model('Message', messageSchema);

export default MessageModel;
