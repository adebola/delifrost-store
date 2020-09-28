import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../../shared/classes/product';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {

  @Input() products: Product[] = [];
  @Input() brands: any[] = [];

  @Output() brandsFilter: EventEmitter<any> = new EventEmitter<any>();

  public collapse = true;
  public uniqueBrands: string[];

  constructor(public productService: ProductService) {
  }

  ngOnInit(): void {
  }

  get filterbyBrand() {

    if (!this.uniqueBrands) {
      this.uniqueBrands = this.productService.uniqueBrands();

      // this.productService.uniqueBrands().subscribe(o => this.uniqueBrands = o);
    }

    return this.uniqueBrands;
  }

  appliedFilter(event) {
    const index = this.brands.indexOf(event.target.value);  // checked and unchecked value

    if (event.target.checked) {
      this.brands.push(event.target.value);
    } else { // push in array checked value
      this.brands.splice(index, 1);
    }  // removed in array unchecked value

    const brands = this.brands.length ? { brand: this.brands.join(',') } : { brand: null };
    this.brandsFilter.emit(brands);
  }

  // check if the item are selected
  checked(item) {
    if (this.brands.indexOf(item) !== -1) {
      return true;
    }
  }
}
