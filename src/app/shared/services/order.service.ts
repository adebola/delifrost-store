import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { environment } from 'src/environments/environment';
import { Order, OrderItem } from '../classes/order';
import { Product } from '../classes/product';
import { CartService } from './cart.service';

// const state = {
//   checkoutItems: JSON.parse(localStorage['checkoutItems'] || '[]')
// };

const ORDER_URL = environment.base_url + '/api/v1/store/orders/';

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

  private user: User;

  constructor(
      private router: Router,
      private http: HttpClient,
      private authService: AuthService,
      private cartService: CartService) {

    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  public loadOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>( ORDER_URL + orderId);
  }

  public loadOrdersByUserId(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>( ORDER_URL + 'user/' + userId);
  }

  public loadOrderItemsById(orderItem: number): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>( ORDER_URL + 'orderitem/' + orderItem);
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

    const orderItems: OrderItem[] = [];
    const cart: Product[] = this.cartService.cartItems;

    let i = 0;

    cart.forEach((product) => {
      product.bundles.forEach((bundle) => {
        if (bundle.quantity > 0) {

          const o: OrderItem = new OrderItem();

          o.sku_id = bundle.id;
          o.quantity = bundle.quantity;
          o.unit_price = bundle.price;
          o.vat_price = bundle.VATPrice;
          o.discount = bundle.discount;
          o.total_price = bundle.subTotalPrice;

          orderItems[i] = o;
          i++;
        }
      });
    });

    const order: Order = new Order();

    order.user_id = this.authService.userId ? this.authService.userId : null;
    order.paymentRef = details.payment_ref;
    order.transaction_id = details.transaction_id;
    order.orderAmount = this.cartService.cartTotalAmount;
    order.orderItems = orderItems;
    order.pickup = details.pickup;
    order.deliver = !details.pickup;

    if (details.telephone) {
      order.telephone = details.telephone;
    } else {
      order.telephone = this.user ? this.user.telephone : null;
    }

    if (details.address) {
      order.address = details.address;
    } else {
      order.address = this.user ? this.user.address : null;
    }

    if (details.fullname) {
      order.full_name = details.fullname;
    } else {
      order.full_name = this.user ? this.user.fullName : null;
    }

    if (details.email) {
      order.email = details.email;
    } else {
      order.email = this.user ? this.user.email : null;
    }

    this.http.post<number>(ORDER_URL, order, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(oid => {
        console.log('Order Saved Successfully', oid);
        this.cartService.zeroCart();
        this.router.navigate(['/shop/checkout/success/', oid]);
        return oid;
      });
  }

  // Create order
  // public createOrder(product: any, details: any, orderId: any, amount: any) {
  //
  //   const item = {
  //     shippingDetails: details,
  //     product,
  //     orderId,
  //     totalAmount: amount
  //   };
  //
  //   // state.checkoutItems = item;
  //   // localStorage.setItem('checkoutItems', JSON.stringify(item));
  //   localStorage.removeItem('cartItems');
  //   this.router.navigate(['/shop/checkout/success', orderId]);
  // }
}
