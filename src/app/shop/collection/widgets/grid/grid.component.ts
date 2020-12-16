import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../../shared/classes/product';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  @Input() products: Product[] = [];
  @Input() paginate: any = {};
  @Input() layoutView = 'grid-view';
  @Input() pageSize: number;

  @Output() setGrid: EventEmitter<any> = new EventEmitter<any>();
  @Output() setLayout: EventEmitter<any> = new EventEmitter<any>();
  @Output() setPaging: EventEmitter<any> = new EventEmitter<any>();

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

  paging(value: number) {
    this.pageSize = value;
    this.setPaging.emit(value);
  }
}
