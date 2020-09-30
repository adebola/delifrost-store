import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../../../../shared/classes/product';
import { ProductService } from '../../../../shared/services/product.service';

@Component({
  selector: 'app-related-product',
  templateUrl: './related-product.component.html',
  styleUrls: ['./related-product.component.scss']
})
export class RelatedProductComponent implements OnInit {

  @Input() type: string;

  public products: Product[] = [];

  constructor(public productService: ProductService) {}

  ngOnInit(): void {
     // this.products = this.productService.products.filter(item => item.category === this.type);

    this.productService.products$.subscribe(response =>
      this.products = response.filter(item => item.category === this.type)
    );
  }

}
