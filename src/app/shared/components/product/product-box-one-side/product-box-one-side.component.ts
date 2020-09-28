import { Component, OnInit, Input } from '@angular/core';
import { Product, Bundle } from 'src/app/shared/classes/product';
import { ProductService } from 'src/app/shared/services/product.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-box-one-side',
  templateUrl: './product-box-one-side.component.html',
  styleUrls: ['./product-box-one-side.component.scss']
})

export class ProductBoxOneSideComponent implements OnInit {

  @Input() product: Product;
  public bundle: Bundle;

  constructor(public productService: ProductService) { }

  ngOnInit(): void {
    this.bundle = this.product.bundles[0];
  }

  onChange(bundleId) {

    this.bundle = this.productService.findProductByBundleId(bundleId);

    //   const bundleObs$: Observable<Bundle> = this.productService.findProductByBundleId(bundleId);
    //   bundleObs$.subscribe(bundle => this.bundle = bundle);
    // }
  }
}