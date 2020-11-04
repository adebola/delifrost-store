import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
import { Order, OrderItem } from '../classes/order';
import { Product } from '../classes/product';
import { CartService } from './cart.service';

const state = {
  checkoutItems: JSON.parse(localStorage['checkoutItems'] || '[]')
};

export interface OrderDetails {
  payment_ref: string;
  transaction_id: string;
  pickup: boolean;
  telephone: string;
  address: string;
  fullname: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private cartService: CartService) { }

  // Get Checkout Items
  public get checkoutItems(): Observable<any> {
    const itemsStream = new Observable(observer => {
      observer.next(state.checkoutItems);
      observer.complete();
    });
    return itemsStream as Observable<any>;
  }

  public loadOrderById(orderId: number): Observable<Order> {
    const URL = environment.base_url + '/api/v1/store/orders/' + orderId;

    return this.http.get<Order>(URL);
  }

  public testEMail() {
    const GET_URL = environment.base_url + '/api/v1/store/orders/test';

    this.http.get<{ message: string }>(GET_URL, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe();
  }

  public saveOrder(details: OrderDetails) {

    const cart: Product[] = this.cartService.cartItems;
    const POST_URL = environment.base_url + '/api/v1/store/orders/';


    const orderItems: OrderItem[] = [];

    let i = 0;

    cart.forEach((product) => {
      product.bundles.forEach((bundle) => {
        if (bundle.quantity > 0) {

          const o: OrderItem = new OrderItem();

          o.sku_id = bundle.id;
          o.quantity = bundle.quantity;
          o.unit_price = bundle.price;
          o.discount = bundle.discount;
          o.total_price = bundle.subTotalPrice;

          orderItems[i] = o;
          i++;
        }
      });
    });

    const order: Order = new Order();

    order.user_id = this.authService.userId ? this.authService.userId : null;
    order.paymentRef = details.payment_ref
    order.transaction_id = details.transaction_id
    order.orderAmount = this.cartService.cartTotalAmount;
    order.pickup = details.pickup;
    order.deliver = !details.pickup;
    order.telephone = details.telephone;
    order.address = details.address;
    order.orderItems = orderItems;
    order.full_name = details.fullname;
    order.email = details.email;

    console.log(order);

    this.http.post<number>(POST_URL, order, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .subscribe(oid => {
        console.log('Order Saved Successfully', oid);
        this.cartService.zeroCart();
        this.router.navigate(['/shop/checkout/success/', oid]);
        return oid;
      });
  }

  // Create order
  public createOrder(product: any, details: any, orderId: any, amount: any) {
    const item = {
      shippingDetails: details,
      product: product,
      orderId: orderId,
      totalAmount: amount
    };
    state.checkoutItems = item;
    localStorage.setItem('checkoutItems', JSON.stringify(item));
    localStorage.removeItem('cartItems');
    this.router.navigate(['/shop/checkout/success', orderId]);
  }
}
