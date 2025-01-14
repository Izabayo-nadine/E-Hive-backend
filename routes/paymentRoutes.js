require('dotenv').config(); // Load environment variables
const express = require('express');
const auth = require('../middleWare/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Joi = require('joi');
const rateLimit = require('express-rate-limit');
const { schema } = require('../models/userModel');

const router = express.Router();

// Joi validation schema
const paymentSchema = Joi.object({
    amount: Joi.number().positive().required(),
    paymentMethod: Joi.string().required(),
});

// Rate limiter (e.g., 5 requests per 15 minutes)
const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Max 5 requests per windowMs
    message: 'Too many payment requests, please try again later.'
});


/**
 * @swagger
 * /payment:
 *   post:
 *     summary:create a payment.
 *     tags:[payment]
 *     requestBody:
 *       required: true  
 *       content:
 *           application/json:
 *            schema:
 *               type:object
 *               properties:
 *                     amount:
 *                      type: number
 *                      description: Amount to be charged
 *                      example: 100
 *                     paymentMethod:
 *                         type: string
 *                         description: payment method modifier.
 *                         example: 'credit card'
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clientSecret:
 *                   type: string
 *                   description: Client secret for the payment
 *                   example: 'pi_1HhQ2E2eZvKYlo2C7HeMddwA_secret_k0swY3HgB9l2C0NQ0'
 *                 message:
 *                   type: string
 *                   example: 'Payment processed successfully.'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */



router.post('/payment', paymentLimiter, auth, async (req, res) => {
    const { amount, paymentMethod } = req.body;
    const { error } = paymentSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const payment = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'usd',
            payment_method: paymentMethod,
            confirmation_method: 'manual',
            confirm: true,
           
            return_url: 'https://your-redirect-url.com', // Change this to your actual return URL
            
        });

        res.status(200).json({ 
            paymentId: payment.id, 
            clientSecret: payment.client_secret, 
            message: 'Payment processed successfully.' 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Confirm Payment Intent
router.post('/payment/confirm', auth, async (req, res) => {
    const { paymentIntentId } = req.body;  // Make sure this is the PaymentIntent ID, not client_secret

    try {
        const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

        res.status(200).json({ 
            message: 'Payment confirmed successfully.',
            paymentIntent 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
