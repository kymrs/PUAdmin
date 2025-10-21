const express = require('express');
const router = express.Router();
const { auth } = require('../../middleware');
const chatService = require('../../services/chat.service');

// Tampilan chat
router.get('/', auth.ensureAuth, async (req, res) => {
    try {
        const messages = await chatService.getAll();

        res.render('chat/chat', {
            user: req.session.user,
            username: req.session.user?.username || 'Guest',
            fullname: req.session.user?.fullname || 'Guest',
            messages
        });
    }
    catch (error) {
        console.log('❌ Error loading chat:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;