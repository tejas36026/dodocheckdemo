import DodoPayments from 'dodopayments';

const client = new DodoPayments({
bearerToken: "KeOySXZ8FjugNSAm.ZzCh4zq4pTRKKc8XXW3DBB5WQdVUORJwjFVQrwAwDO03VpWH", // This is the default and can be omitted
});

async function main() {
const payment = await client.payments.create({
payment_link: true,
billing: { city: 'city', country: 'IN', state: 'state', street: 'street', zipcode: 0 },
customer: { email: 'email@email.com', name: 'name' },
product_cart: [{ product_id: 'pdt_LdOBRrwZHDDSxblLDYu3D', quantity: 1 }],
});

console.log(payment);
const options = {
  method: 'POST',
  headers: {
    'webhook-id': '<webhook-id>',
    'webhook-signature': '<webhook-signature>',
    'webhook-timestamp': '<webhook-timestamp>',
    'Content-Type': 'application/json'
  },
  body: '{"business_id":"<string>","data":{"business_id":"<string>","created_at":"2023-11-07T05:31:56Z","currency":"AED","customer":{"customer_id":"<string>","email":"<string>","name":"<string>"},"discount_id":"<string>","disputes":[{"amount":"<string>","business_id":"<string>","created_at":"2023-11-07T05:31:56Z","currency":"<string>","dispute_id":"<string>","dispute_stage":"pre_dispute","dispute_status":"dispute_opened","payment_id":"<string>"}],"error_message":"<string>","metadata":{},"payment_id":"<string>","payment_link":"<string>","payment_method":"<string>","payment_method_type":"<string>","product_cart":[{"product_id":"<string>","quantity":1}],"refunds":[{"amount":123,"business_id":"<string>","created_at":"2023-11-07T05:31:56Z","currency":"AED","payment_id":"<string>","reason":"<string>","refund_id":"<string>","status":"succeeded"}],"status":"succeeded","subscription_id":"<string>","tax":123,"total_amount":123,"updated_at":"2023-11-07T05:31:56Z","payload_type":"Payment"},"timestamp":"2023-11-07T05:31:56Z","type":"payment.succeeded"}'
};

fetch('https://test.dodopayments.com/your-webhook-url', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
  
}

main();