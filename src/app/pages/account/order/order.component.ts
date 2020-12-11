import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Order, OrderItem } from 'src/app/shared/classes/order';
import { OrderDetails, OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {

  public orders$: Observable<Order[]>;
  private subscription: Subscription;

  // private subject = new BehaviorSubject<OrderItem[]>([]);
  // public orderItems$: Observable<OrderItem[]> = this.subject.asObservable();

  public orderItems$: Observable<OrderItem[]>;

  constructor(private orderService: OrderService, private authService: AuthService) { }

  ngOnInit(): void {
    this.subscription = this.authService.user$.subscribe(user => {
      this.orders$ = this.orderService.loadOrdersByUserId(user.userId);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadOrderDetail(orderId: number) {

    this.orderItems$ = this.orderService.loadOrderItemsById(orderId);
    this.orderItems$.subscribe(items => console.log(items));

    // this.orderService.loadOrderItemsById(orderId).pipe(
    //   tap(o => this.subject.next(o))
    // ).subscribe();
  }
}
