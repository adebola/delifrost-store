import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  public layoutView = 'grid-view';
  public paginate: any = {};
  public grid = 'col-xl-3 col-md-6';
  public sortBy = 'ascending';
  private searchSubject = new Subject<string>();

  readonly products$ = this.searchSubject.pipe(
    debounceTime(250),
    distinctUntilChanged(),
    switchMap(search => this.productService.searchProducts(search)),
  );

  constructor(
    public productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private viewScroller: ViewportScroller) { }

  ngOnInit(): void {
  }

  searchProducts(searchString: string) {

    if (searchString && searchString.length > 0) {
      this.searchSubject.next(searchString);
    }
  }

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
}
