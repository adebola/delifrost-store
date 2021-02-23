import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Product } from '../../shared/classes/product';
import { ProductService } from '../../shared/services/product.service';
import { OrderService, OrderDetails } from '../../shared/services/order.service';
import { CartService } from 'src/app/shared/services/cart.service';

// import '../../../assets/js/inline.js';
// import 'https://js.paystack.co/v1/inline.js';

import { QuickAddressViewComponent } from 'src/app/shared/components/modal/quick-address-view/quick-address-view.component';
import { AddressService } from 'src/app/shared/services/address.service';
import { AuthService } from 'src/app/auth/auth.service';

declare var PaystackPop: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {

  public checkoutForm: FormGroup;
  public products: Product[] = [];
  public shipping = 'pickup';
  public amount: any;
  private subUser: Subscription;
  private subCart: Subscription;
  private subAddress: Subscription;
  private email: string;
  public alertMessage;
  public formValid = true;
  public delivery = false;
  private firstTime = true;

  @ViewChild('quickAddressView') QuickAddressView: QuickAddressViewComponent;

  constructor(private fb: FormBuilder,
              public cartService: CartService,
              public productService: ProductService,
              public orderService: OrderService,
              public authService: AuthService,
              public addressService: AddressService) {
  }
  ngOnDestroy(): void {
    if (this.subUser) {
      this.subUser.unsubscribe();
    }

    if (this.subCart) {
      this.subCart.unsubscribe();
    }

    if (this.subAddress) {
      this.subAddress.unsubscribe();
    }
  }

  ngOnInit(): void {
    let address;

    this.subAddress =  this.addressService.addresses$.subscribe(a => {
      if (a && this.firstTime) {
        this.firstTime = false;
        address = a[0].address;
      }
    });

    this.subCart = this.cartService.cartChanged
      .subscribe((cart: Product[]) => this.products = cart);

    if (this.authService.isLoggedIn) {
      this.subUser = this.authService.user$
        .subscribe(user => {
          this.email = user.email;

          this.checkoutForm = this.fb.group({
            firstname: [user.fullName, [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
            phone: [user.telephone, [Validators.required, Validators.pattern('[0-9]+')]],
            email: [user.email, [Validators.required, Validators.email]],
            address: [address ? address : user.address, [Validators.required, Validators.maxLength(50)]]
          });
        });
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

    this.alertMessage = null;

    if (this.shipping === 'deliver' && !this.authService.isLoggedIn && !this.checkoutForm.valid) {
      return this.alertMessage = 'Please fill in the Delivery Details section completely for anonymous purchase';
    }

    this.paystackCheckOut();
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
      // key: 'pk_live_bfb16d02aa71e338d149d20a790d3ae874ba8896',
      key: 'pk_test_a0fa9ec7220232efc363d83de99ac17b7bcdb609',
      email: this.email,
      amount: Math.round(this.cartService.cartTotalAmount * 100),
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

  onChange(event) {

    this.alertMessage = null;
    this.delivery = (event === 'deliver');
    this.shipping = event;
  }

  onSelectChange(event) {
    const subject = this.addressService.getAddress(+event)
      .subscribe(o => this.checkoutForm.patchValue({ address: o.address }));

    subject.unsubscribe();
  }
}
