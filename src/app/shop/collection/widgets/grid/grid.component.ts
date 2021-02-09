import {Component, OnInit, Input, Output, EventEmitter, AfterViewInit} from '@angular/core';
import { Product } from '../../../../shared/classes/product';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  @Input() products: Product[] = [];
  @Input() totalLength: number;
  @Input() layoutView = 'grid-view';
  @Input() pageSize: number;
  @Input() pageNo: number;
  @Input() sortBy: string;

  @Output() setGrid: EventEmitter<any> = new EventEmitter<any>();
  @Output() setLayout: EventEmitter<any> = new EventEmitter<any>();
  @Output() setPaging: EventEmitter<any> = new EventEmitter<any>();
  @Output() sortedBy: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  setGridLayout(value: string) {
    this.setGrid.emit(value);  // Set Grid Size
  }

  setLayoutView(value: string) {
    this.layoutView = value;
    this.setLayout.emit(value); // Set layout view
  }

  paging(value) {
    this.pageSize = value;
    this.setPaging.emit(value);
  }

  sorting(event) {
    this.sortedBy.emit(event.target.value)
  }
}
