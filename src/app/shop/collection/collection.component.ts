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
  public pageNo: number = 1;
  public pageSize: number = 20;
  public sortBy: string; // Sorting Order
  public mobileSidebar = false;
  public loader = true;
  public totalLength: number;

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
        this.sortBy = params.sortBy ? params.sortBy : null;
        this.pageNo = (params.page && +params.page > 0) ? params.page : 1;

        if (this.subProducts) {
          this.subProducts.unsubscribe();
        }

        this.subProducts = this.productService.products$.subscribe(products => {
            this.products = products;
            this.totalLength = this.products.length;

            let shouldPage = true;

            if (params.category) {
              this.products = this.products.filter(item => item.category === this.category);
              shouldPage = false;
            }

            if (this.brands && this.brands.length > 0) {
              this.products = this.products.filter(item => this.brands.indexOf(item.brand) !== -1);
              shouldPage = false;
            }

            if (shouldPage) {
              if (params.pagesize || params.page) {

                const start: number = (this.pageNo - 1) * this.pageSize;
                const end: number = +start + +this.pageSize;

                this.products = this.products.slice(start, end);
              } else {
                this.products = this.products.slice(this.pageNo - 1, this.pageSize);
              }
            }

            if (this.sortBy) {
              this.products = this.productService.sortProducts(this.products, this.sortBy);
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

  // SortBy Filter
  sortByFilter(value) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sortBy: value ? value : null },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // product Pagination
  private setPage() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.pageNo, pagesize: this.pageSize },
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

  updatePage(value: number) {
    this.pageNo = value;
    this.setPage();
  }

  updatePageSize(value) {
    this.pageSize = value.target.value;
    this.setPage();
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
