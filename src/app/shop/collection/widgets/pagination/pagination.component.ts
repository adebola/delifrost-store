import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../../shared/classes/product';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  @Input() products: Product[] = [];
  @Input() pageSize: number;
  @Input() pageNo: number;
  @Input() totalItems: number;

  @Output() setPage: EventEmitter<any> = new EventEmitter<any>();

  public startPage: number;
  public endPage: number;
  public totalPages: number;
  public  pages;

  constructor() {}

  ngOnInit(): void {

    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.startPage = 1;
    this.endPage = this.totalPages;

    this.pages = Array.from(Array((this.endPage + 1) - this.startPage).keys()).map(i => this.startPage + i);
  }

  pageSet(page: number) {
    this.setPage.emit(page);  // Set Page Number  
  }
}
