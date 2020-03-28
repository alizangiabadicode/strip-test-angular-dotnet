using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Stripe;

namespace server.Controllers {
    [ApiController]
    [Route ("stripe")]
    public class WeatherForecastController : ControllerBase {
        [HttpGet ("pay")]
        public async Task<IActionResult> Pay () {
            StripeConfiguration.ApiKey = "sk_test_sd6hLSzaaSdWchuLII5rcYI700nJV5t5ee";

            var options = new PaymentIntentCreateOptions {
                Amount = 1099,
                Currency = "gbp",
                // Verify your integration in this guide by including this parameter
                Metadata = new Dictionary<String, String> () { { "integration_check", "accept_a_payment" },
                }
            };

            var service = new PaymentIntentService ();
            var paymentIntent = service.Create (options);
            
            return Ok(new {client_secret= paymentIntent.ClientSecret});
        }

        private static readonly string[] Summaries = new [] {
            "Freezing",
            "Bracing",
            "Chilly",
            "Cool",
            "Mild",
            "Warm",
            "Balmy",
            "Hot",
            "Sweltering",
            "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController (ILogger<WeatherForecastController> logger) {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<WeatherForecast> Get () {
            var rng = new Random ();
            return Enumerable.Range (1, 5).Select (index => new WeatherForecast {
                    Date = DateTime.Now.AddDays (index),
                        TemperatureC = rng.Next (-20, 55),
                        Summary = Summaries[rng.Next (Summaries.Length)]
                })
                .ToArray ();
        }
    }
}