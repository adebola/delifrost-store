import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Product} from '../../../../shared/classes/product';
import {ProductService} from '../../../../shared/services/product.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnDestroy {

    @Input() products: Product[] = [];
    @Input() pageSize: number;
    @Input() pageNo: number;
    @Input() totalLength: number;

    @Output() setPage: EventEmitter<any> = new EventEmitter<any>();

    public startPage: number;
    public endPage: number;
    public totalPages: number;
    public pages;
    private subscription: Subscription;

    constructor(private productService: ProductService) {
    }

    ngOnInit(): void {

        if (this.totalLength === 0) {

            if (this.subscription) {
                this.subscription.unsubscribe();
            }

            this.subscription = this.productService.products$.subscribe(product => {
              this.totalLength = product.length;
              this.setParams();
            });
        } else {
            this.setParams();
        }
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    pageSet(page: number) {
        this.setPage.emit(page);  // Set Page Number
    }

    private setParams() {
        this.totalPages = Math.ceil(this.totalLength / this.pageSize);
        this.startPage = 1;
        this.endPage = this.totalPages;
        this.pages = Array.from(Array((this.endPage + 1) - this.startPage).keys()).map(i => this.startPage + i);
    }
}
