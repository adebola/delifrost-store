import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Product } from '../../shared/classes/product';
import { ProductService } from '../../shared/services/product.service';
import { OrderService, OrderDetails } from '../../shared/services/order.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { AuthService } from 'src/app/auth/auth.service';

import '../../../assets/js/inline.js';
import '../../../assets/js/checkout.js';
import { Router } from '@angular/router';

declare var PaystackPop: any;
declare var Paylink: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {

  public checkoutForm: FormGroup;
  public products: Product[] = [];
  public payment = 'paystack';
  public shipping = 'pickup';
  public amount: any;
  private subscription: Subscription;
  private email: string;
  public alertMessage;
  public formValid = true;

  constructor(private fb: FormBuilder,
              private router: Router,
              public cartService: CartService,
              public productService: ProductService,
              public orderService: OrderService,
              public authService: AuthService) {

    this.checkoutForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {

    this.subscription = this.cartService.cartChanged
      .subscribe((cart: Product[]) => this.products = cart);

    if (this.authService.isLoggedIn) {
      this.subscription = this.authService.user$
        .subscribe(user => this.email = user.email);
    } else {
      this.email = 'delifrost@factorialsystems.io';
    }

    this.products = this.cartService.cartItems;

    // this.cartService.cartItems.subscribe(response => this.products = response);
    this.amount = this.cartService.cartTotalAmount;
  }

  public get getTotal(): number {
    return this.cartService.cartTotalAmount;
  }

  checkOut() {

    return this.orderService.testEMail();

    this.alertMessage = null;

    if (this.shipping === 'deliver' && !this.authService.isLoggedIn && !this.checkoutForm.valid) {
      return this.alertMessage = 'Please fill in the Delivery Details section completely for anonymous purchase';
    }

    if (this.payment === 'paystack') {
      this.paystackCheckOut();
    } else {
      this.paylinkCheckOut();
    }
  }

  private generateId(len: number) {
    const arr = new Uint8Array((len || 40) / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, this.dec2hex).join('');
  }

  private dec2hex(dec) {
    return ('0' + dec.toString(16)).substr(-2);
  }

  private paystackCheckOut() {
    const handler = PaystackPop.setup({
      key: 'pk_test_94dbaebf2467e2b41e3552f23a093e7e55cbe57e',
      email: this.email,
      amount: this.cartService.cartTotalAmount * 100,
      currency: 'NGN',
      ref: this.generateId(16),
      callback: (response) => {

        // generate Order From Cart
        const details: OrderDetails = {
          pickup: this.shipping === 'pickup',
          payment_ref: response.reference,
          transaction_id: response.transaction,
          telephone: this.checkoutForm.value.phone,
          address: this.checkoutForm.value.address,
          fullname: this.checkoutForm.value.firstname,
          email: this.checkoutForm.value.email
        };

        this.orderService.saveOrder(details);
      },
      onClose: () => {
        console.log('Close');
      }
    });
    handler.openIframe();
  }

  private paylinkCheckOut() {
    Paylink.checkout('factorialsystems', {
      amount: this.cartService.cartTotalAmount,
      quantity: 1,
      reference: this.generateId(16)
    });
  }

  onChange(event) {

    this.alertMessage = null;

    if (event === 'deliver') {
      if (this.authService.isLoggedIn) {
        this.authService.user$.subscribe(user => {
          if (!(user.address && user.address.length > 0)) {
            this.alertMessage =
              // tslint:disable-next-line: max-line-length
              'You have requested that goods purchase be delivered however you do not have an address on your profile, please goto your profile under your name on the menu to add address, telephone etc.';
            this.formValid = false;
          }
        });
      }
    }

    this.shipping = event;
  }
}
