import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/classes/product';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit, OnDestroy {

  public grid = 'col-xl-3 col-md-6';
  public layoutView = 'grid-view';
  public products: Product[];
  public brands: any[] = [];
  public category: string;
  public pageNo = 1;
  public paginate: any = {}; // Pagination use only
  public mobileSidebar = false;
  public loader = true;

  private subQuery: Subscription;
  private subProducts: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viewScroller: ViewportScroller,
    public productService: ProductService) { }

  ngOnInit(): void {

    if (this.subQuery) {
      this.subQuery.unsubscribe();
    }

    this.subQuery = this.route.queryParams.subscribe(params => {

        this.brands = params.brand ? params.brand.split(',') : [];
        this.category = params.category ? params.category : null;

        if (this.subProducts) {
          this.subProducts.unsubscribe();
        }

        this.subProducts = this.productService.products$.subscribe(products => {
            this.products = products;

            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXX');

            if (params.category) {
              this.products = this.products.filter(item => item.category === this.category);
            }

            if (this.brands && this.brands.length > 0) {
              this.products = this.products.filter(item => this.brands.indexOf(item.brand) !== -1);
            }
          });
      });
  }

  ngOnDestroy() {

    if (this.subQuery) {
      this.subQuery.unsubscribe();
    }

    if (this.subProducts) {
      this.subProducts.unsubscribe();
    }
  }

  // Append filter value to Url
  updateFilter(tags: any) {
    tags.page = null; // Reset Pagination

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: tags,
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // product Pagination
  setPage(page: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // Change Grid Layout
  updateGridLayout(value: string) {
    this.grid = value;
  }

  // Change Layout View
  updateLayoutView(value: string) {
    this.layoutView = value;
    if (value === 'list-view') {
      this.grid = 'col-lg-12';
    } else {
      this.grid = 'col-xl-3 col-md-6';
    }
  }

  // Mobile sidebar
  toggleMobileSidebar() {
    this.mobileSidebar = !this.mobileSidebar;
  }
}
