import express from 'express';
import Chat from '../model/ChatSchema.js';

const router = express.Router();

// Get chat by orderId
router.get('/:orderId', async (req, res) => {
    try {
        let chat = await Chat.findOne({ orderId: req.params.orderId });
        if (!chat) {
            const { userId, adminId } = req.query; // Send these during first fetch if empty
            if(userId && adminId) {
                chat = new Chat({ orderId: req.params.orderId, userId, adminId, messages: [] });
                await chat.save();
            } else {
                return res.status(404).json({ message: 'Chat not initialized' });
            }
        }
        res.json(chat);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add message
router.post('/:orderId/msg', async (req, res) => {
    try {
        const { senderRole, senderId, text } = req.body;
        const msg = { senderRole, senderId, text, timestamp: new Date() };
        const chat = await Chat.findOneAndUpdate(
            { orderId: req.params.orderId },
            { $push: { messages: msg } },
            { new: true, upsert: true }
        );
        // Dispatch to socket via app 'io' instance if active
        const io = req.app.get('io');
        if (io) {
            io.to(req.params.orderId).emit('receive_message', msg);
        }
        res.json(chat);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
