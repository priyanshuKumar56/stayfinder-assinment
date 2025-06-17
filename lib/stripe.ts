import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export const stripeConfig = {
  publishableKey:
    "pk_test_51RaAwoQrDn58L7mxJufincEdQPoAV0nqwW1fSJ16GVM8vLMfS2368NiVsXO7osNv4GJcQKM7Yw9krRQMeuLmByqJ00l8Yyocpg",
  secretKey:
    "sk_test_51RaAwoQrDn58L7mx1ECtNo2ORBVrbyPxgkYXcOWvrQ0P7Dub9zZ3l2EQDoZnykYDJ8Ti76mWI3CVjJl8UNitWi2H00nFtQNRYx",
}

export default stripe

// Helper functions for payment processing
export const createPaymentIntent = async (amount: number, metadata: Record<string, string>) => {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: "usd",
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  })
}

export const retrievePaymentIntent = async (paymentIntentId: string) => {
  return await stripe.paymentIntents.retrieve(paymentIntentId)
}

export const createCustomer = async (email: string, name: string) => {
  return await stripe.customers.create({
    email,
    name,
  })
}

export const createConnectedAccount = async (email: string, country = "US") => {
  return await stripe.accounts.create({
    type: "express",
    email,
    country,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  })
}
