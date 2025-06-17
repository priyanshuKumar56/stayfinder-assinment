import Stripe from "stripe"

// Validate environment variables
const validateEnvVars = () => {
  const requiredVars = {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    NODE_ENV: process.env.NODE_ENV,
  }

  const missing = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }

  return requiredVars as Record<string, string>
}

// Initialize environment variables
const env = validateEnvVars()

// Initialize Stripe with proper error handling
const initializeStripe = (): Stripe => {
  try {
    return new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
      typescript: true,
      maxNetworkRetries: 3,
      timeout: 30000, // 30 seconds
    })
  } catch (error) {
    console.error("Failed to initialize Stripe:", error)
    throw new Error("Stripe initialization failed")
  }
}

const stripe = initializeStripe()

export const stripeConfig = {
  publishableKey: env.STRIPE_PUBLISHABLE_KEY,
  // Never expose secret key in config
  isProduction: env.NODE_ENV === "production",
  apiVersion: "2024-06-20" as const,
} as const

export default stripe

// Error handling wrapper
const handleStripeError = (error: any, operation: string) => {
  console.error(`Stripe ${operation} error:`, error)
  
  if (error.type === "StripeCardError") {
    throw new Error(`Payment failed: ${error.message}`)
  } else if (error.type === "StripeRateLimitError") {
    throw new Error("Too many requests. Please try again later.")
  } else if (error.type === "StripeInvalidRequestError") {
    throw new Error(`Invalid request: ${error.message}`)
  } else if (error.type === "StripeAPIError") {
    throw new Error("Payment service temporarily unavailable. Please try again.")
  } else if (error.type === "StripeConnectionError") {
    throw new Error("Network error. Please check your connection and try again.")
  } else if (error.type === "StripeAuthenticationError") {
    throw new Error("Authentication error. Please contact support.")
  } else {
    throw new Error("An unexpected error occurred. Please try again.")
  }
}

// Input validation helpers
const validateAmount = (amount: number): void => {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Amount must be a positive number")
  }
  if (amount < 0.5) {
    throw new Error("Amount must be at least $0.50")
  }
  if (amount > 999999.99) {
    throw new Error("Amount exceeds maximum limit")
  }
}

const validateEmail = (email: string): void => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format")
  }
}

const validateMetadata = (metadata: Record<string, string>): void => {
  const maxKeys = 50
  const maxKeyLength = 40
  const maxValueLength = 500

  if (Object.keys(metadata).length > maxKeys) {
    throw new Error(`Metadata cannot have more than ${maxKeys} keys`)
  }

  for (const [key, value] of Object.entries(metadata)) {
    if (key.length > maxKeyLength) {
      throw new Error(`Metadata key "${key}" exceeds ${maxKeyLength} characters`)
    }
    if (value.length > maxValueLength) {
      throw new Error(`Metadata value for "${key}" exceeds ${maxValueLength} characters`)
    }
  }
}

// Helper functions for payment processing
export const createPaymentIntent = async (
  amount: number,
  metadata: Record<string, string> = {},
  currency: string = "usd"
): Promise<Stripe.PaymentIntent> => {
  try {
    validateAmount(amount)
    validateMetadata(metadata)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        ...metadata,
        created_at: new Date().toISOString(),
        environment: env.NODE_ENV,
      },
      automatic_payment_methods: {
        enabled: true,
      },
      // Add idempotency for production
      idempotencyKey: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    })

    return paymentIntent
  } catch (error) {
    handleStripeError(error, "createPaymentIntent")
    throw error // Re-throw after handling
  }
}

export const retrievePaymentIntent = async (
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> => {
  try {
    if (!paymentIntentId || typeof paymentIntentId !== "string") {
      throw new Error("Valid payment intent ID is required")
    }

    return await stripe.paymentIntents.retrieve(paymentIntentId)
  } catch (error) {
    handleStripeError(error, "retrievePaymentIntent")
    throw error
  }
}

export const createCustomer = async (
  email: string,
  name: string,
  metadata: Record<string, string> = {}
): Promise<Stripe.Customer> => {
  try {
    validateEmail(email)
    validateMetadata(metadata)

    if (!name || name.trim().length === 0) {
      throw new Error("Customer name is required")
    }

    const customer = await stripe.customers.create({
      email: email.toLowerCase().trim(),
      name: name.trim(),
      metadata: {
        ...metadata,
        created_at: new Date().toISOString(),
        environment: env.NODE_ENV,
      },
    })

    return customer
  } catch (error) {
    handleStripeError(error, "createCustomer")
    throw error
  }
}

export const createConnectedAccount = async (
  email: string,
  country: string = "US",
  metadata: Record<string, string> = {}
): Promise<Stripe.Account> => {
  try {
    validateEmail(email)
    validateMetadata(metadata)

    const validCountries = ["US", "CA", "GB", "AU", "DE", "FR", "JP", "SG"]
    if (!validCountries.includes(country.toUpperCase())) {
      throw new Error(`Unsupported country: ${country}`)
    }

    const account = await stripe.accounts.create({
      type: "express",
      email: email.toLowerCase().trim(),
      country: country.toUpperCase(),
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      metadata: {
        ...metadata,
        created_at: new Date().toISOString(),
        environment: env.NODE_ENV,
      },
    })

    return account
  } catch (error) {
    handleStripeError(error, "createConnectedAccount")
    throw error
  }
}

// Additional production helpers
export const createAccountLink = async (
  accountId: string,
  refreshUrl: string,
  returnUrl: string
): Promise<Stripe.AccountLink> => {
  try {
    if (!accountId || !refreshUrl || !returnUrl) {
      throw new Error("Account ID, refresh URL, and return URL are required")
    }

    return await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: "account_onboarding",
    })
  } catch (error) {
    handleStripeError(error, "createAccountLink")
    throw error
  }
}

export const webhookHandler = (
  payload: string | Buffer,
  signature: string,
  endpointSecret: string
): Stripe.Event => {
  try {
    if (!endpointSecret) {
      throw new Error("Webhook endpoint secret is required")
    }

    return stripe.webhooks.constructEvent(payload, signature, endpointSecret)
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    throw new Error("Invalid webhook signature")
  }
}

// Export types for TypeScript users
export type PaymentIntentCreateParams = {
  amount: number
  currency?: string
  metadata?: Record<string, string>
}

export type CustomerCreateParams = {
  email: string
  name: string
  metadata?: Record<string, string>
}

export type ConnectedAccountCreateParams = {
  email: string
  country?: string
  metadata?: Record<string, string>
}