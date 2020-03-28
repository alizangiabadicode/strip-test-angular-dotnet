require("stripe")
require("rack")
require("thin")
app = ->(env) do
Stripe.api_key = 'sk_test_sd6hLSzaaSdWchuLII5rcYI700nJV5t5ee'

intent = Stripe::PaymentIntent.create({
  amount: 1099,
  currency: 'gbp',
  # Verify your integration in this guide by including this parameter
  metadata: {integration_check: 'accept_a_payment'},
})
[
    200,
    {},
    env
]
end

Rack::Handler::Thin.run app