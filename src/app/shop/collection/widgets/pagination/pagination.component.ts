import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Product} from '../../../../shared/classes/product';
import {ProductService} from '../../../../shared/services/product.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnDestroy, OnChanges {

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

    ngOnInit(): void {
        this.setParams();
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
        this.startPage = 1 + (this.pageSize * (this.pageNo - 1));
        this.endPage = Math.min(+this.startPage + +this.pageSize - 1, this.totalLength);
        this.pages = Array.from(Array((this.totalPages + 1) - 1).keys()).map(i => 1 + i);
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.setParams();
    }
}
