const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');

const router = express.Router();

// Validation middleware
const validateContact = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),
    
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('service')
        .isIn(['weddings', 'events', 'corporate', 'concerts', 'product', 'food', 'advertisement'])
        .withMessage('Please select a valid service'),
    
    body('message')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Message must be between 10 and 1000 characters')
];

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', validateContact, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { name, email, service, message } = req.body;

        // Check for duplicate submission (same email and message in last 5 minutes)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const existingContact = await Contact.findOne({
            email: email,
            message: message,
            submittedAt: { $gte: fiveMinutesAgo }
        });

        if (existingContact) {
            return res.status(429).json({
                success: false,
                message: 'Duplicate submission detected. Please wait before submitting again.',
                retryAfter: 300 // 5 minutes in seconds
            });
        }

        // Create new contact
        const contact = new Contact({
            name,
            email,
            service,
            message,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent')
        });

        await contact.save();

        console.log(`📩 New contact form submission from ${name} (${email}) for ${service}`);

        res.status(201).json({
            success: true,
            message: 'Thank you for your message! I will get back to you soon.',
            data: {
                id: contact._id,
                submittedAt: contact.submittedAt
            }
        });

    } catch (error) {
        console.error('❌ Error saving contact form:', error);
        
        res.status(500).json({
            success: false,
            message: 'Sorry, there was an error processing your message. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   GET /api/contact
// @desc    Get all contacts (Admin only - you can add authentication later)
// @access  Public (should be protected in production)
router.get('/', async (req, res) => {
    try {
        const { status, service, limit = 50, page = 1 } = req.query;
        
        // Build query
        let query = {};
        if (status) query.status = status;
        if (service) query.service = service;

        // Calculate skip for pagination
        const skip = (page - 1) * parseInt(limit);

        // Get contacts with pagination
        const contacts = await Contact.find(query)
            .sort({ submittedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await Contact.countDocuments(query);

        res.json({
            success: true,
            data: contacts,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / parseInt(limit)),
                count: contacts.length,
                totalRecords: total
            }
        });

    } catch (error) {
        console.error('❌ Error fetching contacts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contacts',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   PUT /api/contact/:id/status
// @desc    Update contact status
// @access  Public (should be protected in production)
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['new', 'read', 'replied', 'archived'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            message: 'Status updated successfully',
            data: contact
        });

    } catch (error) {
        console.error('❌ Error updating contact status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating contact status',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   GET /api/contact/stats
// @desc    Get contact statistics
// @access  Public (should be protected in production)
router.get('/stats', async (req, res) => {
    try {
        const stats = await Contact.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    newMessages: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
                    readMessages: { $sum: { $cond: [{ $eq: ['$status', 'read'] }, 1, 0] } },
                    repliedMessages: { $sum: { $cond: [{ $eq: ['$status', 'replied'] }, 1, 0] } }
                }
            }
        ]);

        const serviceStats = await Contact.aggregate([
            {
                $group: {
                    _id: '$service',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        res.json({
            success: true,
            data: {
                overview: stats[0] || { total: 0, newMessages: 0, readMessages: 0, repliedMessages: 0 },
                byService: serviceStats
            }
        });

    } catch (error) {
        console.error('❌ Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;
