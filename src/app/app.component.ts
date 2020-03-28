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
    const stripe = await loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
    // Set up Stripe.js and Elements to use in checkout form
    var style = {
      base: {
        color: "#32325d",
      }
    };
    const elements = stripe.elements();
    var card = elements.create("card", { style: style });
    card.mount("#card-element");


    // show errors
    // (document.getElementById("#card-element")).addEventListener('change', function (event: any) {
    //   var displayError = document.getElementById('card-errors');
    //   if (event.error) {
    //     displayError.textContent = event.error.message;
    //   } else {
    //     displayError.textContent = '';
    //   }
    // });

    this.http.get(
      'http://localhost:5000/stripe/pay'
    ).subscribe(
      (n: any) => {
        alert("client secret is returned")
        this.http.post('http://localhost:5000/stripe/pay/'+n.id+"/confirm", {})
        .subscribe(
          n => {
            alert('successfull confirm')
          }
        )
        var form = document.getElementById('payment-form');

        form.addEventListener('submit', function (ev) {
          ev.preventDefault();
          stripe.confirmCardPayment(n.client_secret, {
            payment_method: {
              card: card,
              billing_details: {
                name: 'Jenny Rosen'
              }
            }
          }).then(function (result) {
            if (result.error) {
              // Show error to your customer (e.g., insufficient funds)
              console.log(result.error.message);
            } else {
              // The payment has been processed!
              if (result.paymentIntent.status === 'succeeded') {
                alert("success")
                // Show a success message to your customer
                // There's a risk of the customer closing the window before callback
                // execution. Set up a webhook or plugin to listen for the
                // payment_intent.succeeded event that handles any business critical
                // post-payment actions.
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
