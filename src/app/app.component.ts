import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';

import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'stripe';
  clientSecret;

  constructor(private http: HttpClient) {}
  async ngOnInit() {
    const stripe = await loadStripe('pk_test_sBEEea7pLzlT5ddJqCxHo9ra00m9b5GJx9');
    // Set up Stripe.js and Elements to use in checkout form
    var style = {
      base: {
        color: "#32325d",
      }
    };
    const elements = stripe.elements();
    var card = elements.create("card", { style: style });
    card.mount("#card-element");
    this.http.get(
      'http://localhost:5000/stripe/pay'
    ).subscribe(
      (n: any) => {
        alert("client secret is returned")
        var form = document.getElementById('payment-form');
        form.addEventListener('submit', function (ev) {
          ev.preventDefault();
          stripe.confirmCardPayment(n.client_secret, {
            payment_method: {
              card: card,
              billing_details: {
                name: 'ali zang'
              }
            }
          }).then(function (result) {
            if (result.error) {
              console.log(result.error.message);
            } else {
              if (result.paymentIntent.status === 'succeeded') {
                alert("success")
              }
            }
          });
        });
      },
      (e) => {
        alert("exeption occured")
        console.log(e)
      }
    )
  }
}
