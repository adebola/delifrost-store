import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { map, filter, shareReplay } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Product, Bundle } from '../classes/product';
import { environment } from 'src/environments/environment';

const state = {
  products: JSON.parse(localStorage.products || '[]'),
  wishlist: JSON.parse(localStorage.wishlistItems || '[]'),
  cart: JSON.parse(localStorage.cartItems || '[]')
};

const PRODUCT_URL = environment.base_url + '/api/v1/store/products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public Currency = { name: 'Naira', currency: '₦', price: 1 }; // Default Currency
  private Products: Observable<Product[]>;


  constructor(private http: HttpClient, private toastrService: ToastrService) { }

  /*
    ---------------------------------------------
    ---------------  Product  -------------------
    ---------------------------------------------
  */


  public getProducts(): Observable<Product[]> {
    return this.Products = this.http.get<Product[]>(PRODUCT_URL)
      .pipe(
        shareReplay()
      );
  }

  public get products(): Observable<Product[]> {


    return this.Products;

    // this.Products = this.http.get<Product[]>('assets/data/products.json').pipe(map(data => data));
    // this.Products.subscribe(next => { localStorage['products'] = JSON.stringify(next); });
    // return this.Products = this.Products.pipe(startWith(JSON.parse(localStorage['products'] || '[]')));
  }

  public getProductBySlug(slug: string): Observable<Product> {
    return this.Products.pipe(map(items => {
      return items.find((item: any) => {
        return item.title.replace(' ', '-') === slug;
      });
    }));
  }


  /*
    ---------------------------------------------
    ---------------  Wish List  -----------------
    ---------------------------------------------
  */

  // Get Wishlist Items
  public get wishlistItems(): Observable<Product[]> {
    const itemsStream = new Observable(observer => {
      observer.next(state.wishlist);
      observer.complete();
    });
    return itemsStream as Observable<Product[]>;
  }

  // Add to Wishlist
  public addToWishlist(product: Product): any {
    const wishlistItem = state.wishlist.find(item => item.id === product.productId);

    if (!wishlistItem) {
      state.wishlist.push({
        ...product
      });
    }
    this.toastrService.success('Product has been added in wishlist.');
    localStorage.setItem('wishlistItems', JSON.stringify(state.wishlist));
    return true;
  }

  // Remove Wishlist items
  public removeWishlistItem(product: Product): boolean {
    const index = state.wishlist.indexOf(product);
    state.wishlist.splice(index, 1);
    localStorage.setItem('wishlistItems', JSON.stringify(state.wishlist));
    return true;
  }


  /*
    ---------------------------------------------
    ------------  Filter Product  ---------------
    ---------------------------------------------
  */

  // Get Product Filter
  // public filterProducts(filter: any): Product[] {

  //   this.products.filter(item => {
  //     if (!filter.length) { return true; }

  //     const Tags = filter.some((prev) => { // Match Tags
  //       if (item.tags) {
  //         if (item.tags.includes(prev)) {
  //           return prev;
  //         }
  //       }
  //     });
  //     return Tags;
  //   });

  // return this.products.pipe(map(product =>
  //   product.filter((item: Product) => {
  //     if (!filter.length) { return true; }
  //     const Tags = filter.some((prev) => { // Match Tags
  //       if (item.tags) {
  //         if (item.tags.includes(prev)) {
  //           return prev;
  //         }
  //       }
  //     });
  //     return Tags;
  //   })
  // ));
  //}

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

  public findProductByBundleId(bundleId: number): Bundle {

    let returnBundle: Bundle;

    this.Products.subscribe(products => {
      for (const product of products) {
        for (const bundle of product.bundles) {
          if (bundle.id == bundleId) {
            returnBundle = bundle;
            return bundle;
          }
        }
      }
    });

    return returnBundle;

    // return new Observable((observer) => {
    //   this.Products.subscribe(products => {
    //     for (const product of products) {
    //       for (const bundle of product.bundles) {
    //         if (bundle.id == bundleId) {
    //           observer.next(bundle);
    //           return observer.complete();
    //         }
    //       }
    //     }
    //   });
    // });
  }

  public uniqueBrands(): string[] {

    const brands = [];

    this.Products.subscribe(products => {
      for (const product of products) {
        if (product.brand) {
          const index = brands.indexOf(product.brand);
          if (index === -1) {
            brands.push(product.brand);
          }
        }
      }
    });

    return brands;

    // return new Observable((observer) => {
    //   this.Products.subscribe(products => {
    //     for (const product of products) {
    //       if (product.brand) {
    //         const index = brands.indexOf(product.brand);
    //         if (index === -1) {
    //           brands.push(product.brand);
    //         }
    //       }
    //     }
    //   });
    //   observer.next(brands);
    //   return observer.complete();
    // });
  }
}
