import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {BehaviorSubject, Observable, of, Subscription, throwError} from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../classes/product';
import { environment } from 'src/environments/environment';

const PRODUCT_URL = environment.base_url + '/api/v1/store/products';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public Currency = { name: 'Naira', currency: '₦', price: 1 }; // Default Currency
  private subject = new BehaviorSubject<Product[]>([]);
  public products$: Observable<Product[]> = this.subject.asObservable();
  private subscription: Subscription;
  private products: Product[];

  constructor(
    private http: HttpClient,
    private toastrService: ToastrService) {
    this.loadProducts();
  }

  private loadProducts() {

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.http.get<Product[]>(PRODUCT_URL)
      .pipe(
        catchError(err => {
          const message = ' Unable to Load Products';
          this.toastrService.error(message);
          console.log(message, err);
          return throwError(err);
        }),
        tap(products => {
          this.subject.next(products);
          this.products = products;
        })
      ).subscribe();
  }

  public findProductByBundleId(bundleId: number): Product {

    let returnProduct: Product;

    for (const product of this.products) {
      for (const bundle of product.bundles) {
        if (bundle.id == bundleId) {
          returnProduct = product;
          return product;
        }
      }
    }

    return returnProduct;
  }

  public uniqueBrands(): string[] {

    const brands = [];

    for (const product of this.products) {
      if (product.brand) {
        const index = brands.indexOf(product.brand);
        if (index === -1) {
          brands.push(product.brand);
        }
      }
    }

    return brands;
  }

  public searchProducts(searchString: string): Observable<Product[]> {

    return this.http.get<Product[]>(PRODUCT_URL + '/search/' + searchString,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    );
  }

  public getProductBySlug(slug: string): Observable<Product> {

    // return this.products$.pipe(
    //   switchMap(products => products.find(item => item.productId === +slug))
    // );

    return of(this.products.find(item => item.productId === +slug));
  }

  // Sorting Filter
  public sortProducts(products: Product[], payload: string): any {

    if (payload === 'ascending') {
      return products.sort((a, b) => {
        if (a.productId < b.productId) {
          return -1;
        } else if (a.productId > b.productId) {
          return 1;
        }
        return 0;
      });
    } else if (payload === 'a-z') {
      return products.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    } else if (payload === 'z-a') {
      return products.sort((a, b) => {
        if (a.name > b.name) {
          return -1;
        } else if (a.name < b.name) {
          return 1;
        }
        return 0;
      });
    } else if (payload === 'low') {
      return products.sort((a, b) => {
        if (a.bundles[0].price < b.bundles[0].price) {
          return -1;
        } else if (a.bundles[0].price > b.bundles[0].price) {
          return 1;
        }
        return 0;
      });
    } else if (payload === 'high') {
      return products.sort((a, b) => {
        if (a.bundles[0].price > b.bundles[0].price) {
          return -1;
        } else if (a.bundles[0].price < b.bundles[0].price) {
          return 1;
        }
        return 0;
      });
    }
  }

  /*
    ---------------------------------------------
    ------------- Product Pagination  -----------
    ---------------------------------------------
  */
  public getPager(totalItems: number, currentPage: number = 1, pageSize: number = 16) {
    // calculate total pages
    const totalPages = Math.ceil(totalItems / pageSize);

    // Paginate Range
    const paginateRange = 3;

    // ensure current page isn't out of range
    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    let startPage: number;
    let endPage: number;

    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else if (currentPage < paginateRange - 1) {
      startPage = 1;
      endPage = startPage + paginateRange - 1;
    } else {
      startPage = currentPage - 1;
      endPage = currentPage + 1;
    }

    // calculate start and end item indexes
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    const pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    // return object with all pager properties required by the view
    return {
      totalItems,
      currentPage,
      pageSize,
      totalPages,
      startPage,
      endPage,
      startIndex,
      endIndex,
      pages
    };
  }
}
