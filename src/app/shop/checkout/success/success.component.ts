import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Order } from '../../../shared/classes/order';
import { OrderService } from '../../../shared/services/order.service';
import { ProductService } from '../../../shared/services/product.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit, AfterViewInit {

  private id: string;
  public order$: Observable<Order>;

  constructor(private route: ActivatedRoute,
              public productService: ProductService,
              private orderService: OrderService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.order$ = this.orderService.loadOrderById(+this.id);
  }

  ngAfterViewInit() {
  }

}
