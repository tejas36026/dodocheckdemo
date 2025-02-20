// File: server.js
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import DodoPayments from 'dodopayments';
import { Webhook } from 'standardwebhooks';

// Get current directory (ES module fix)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());

// Serve static files from the root directory
app.use(express.static(__dirname));

// Initialize DodoPayments client
const client = new DodoPayments({
    bearerToken: "KeOySXZ8FjugNSAm.ZzCh4zq4pTRKKc8XXW3DBB5WQdVUORJwjFVQrwAwDO03VpWH",
});

// API endpoint for creating payments
app.post('/api/create-payment', async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        
        const payment = await client.payments.create({
            payment_link: true,
            billing: { 
                city: 'city', 
                country: 'IN', 
                state: 'state', 
                street: 'street', 
                zipcode: 0 
            },
            customer: { 
                email: 'email@email.com', 
                name: 'Customer Name' 
            },
            product_cart: [{ 
                product_id: productId, 
                quantity: quantity 
            }],
        });
        
        console.log('Payment created:', payment);
        res.json({
            success: true,
            paymentUrl: payment.checkout_url,
            paymentId: payment.id
        });
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment',
            error: error.message
        });
    }
});

// Webhook endpoint
app.post('/webhook/dodo-payments', async (req, res) => {
    try {
        // Get the webhook headers
        const webhookId = req.headers['webhook-id'];
        const webhookTimestamp = req.headers['webhook-timestamp'];
        const signature = req.headers['webhook-signature'];
        
        // Create webhook instance
        const webhookInstance = new Webhook('whsec_9OcSv0FU4Gx2aQ2oZz96d0JA');
        
        try {
            // Verify the webhook
            webhookInstance.verify(JSON.stringify(req.body), {
                id: webhookId,
                timestamp: webhookTimestamp,
                signature: signature
            });
            
            // Process the webhook event
            console.log('Webhook verified successfully:', req.body);
            
            // Respond with success
            res.status(200).json({ received: true });
        } catch (verifyError) {
            console.error('Webhook verification failed:', verifyError);
            res.status(400).json({ error: 'Invalid webhook signature' });
        }
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pricing.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});