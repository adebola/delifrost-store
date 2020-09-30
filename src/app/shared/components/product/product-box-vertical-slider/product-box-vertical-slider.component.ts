import { Component, OnInit, Input } from '@angular/core';
import { NewProductSlider } from '../../../data/slider';
import { Product } from '../../../classes/product';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-box-vertical-slider',
  templateUrl: './product-box-vertical-slider.component.html',
  styleUrls: ['./product-box-vertical-slider.component.scss']
})
export class ProductBoxVerticalSliderComponent implements OnInit {

  @Input() title = 'New Product'; // Default

  //@Input() type = 'fashion'; // Default Fashion

  public products: Product[] = [];

  public NewProductSliderConfig: any = NewProductSlider;

  // Remove type will not be needed going forward
  constructor(public productService: ProductService) {}

  ngOnInit(): void {
    // this.products = this.productService.products;

    this.productService.products$.subscribe(response =>
      this.products = response

      // this.products = response.filter(item => item.type == this.type)
    );
  }
}
