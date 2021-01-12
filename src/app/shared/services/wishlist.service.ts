import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { environment } from 'src/environments/environment';
import { WishList } from '../classes/wishlist';

const USER_WISHLIST_URL = environment.base_url + '/api/v1/store/wishlist';

@Injectable({ providedIn: 'root' })
export class WishListService {
  private wishlistSubject = new BehaviorSubject<WishList[]>(null);
  public wishlist$ = this.wishlistSubject.asObservable();
  private subscription: Subscription;
  private subFind: Subscription;
  private subSave: Subscription;
  private subUpdate: Subscription;
  private user: User;
  private wishlist: WishList[];

  constructor(
      private http: HttpClient,
      private authService: AuthService,
      private toastrService: ToastrService) {
    this.loadWishList();
  }

  public loadWishList() {

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.authService.user$.subscribe(user => {

      if (user) {
        this.user = user;
        this.findByUserId(user.userId);
      } else {
        this.wishlistSubject.next(null);
      }
    });
  }

  public findByUserId(userId: number) {

    if (this.subFind) {
      this.subFind.unsubscribe();
    }

    this.subFind = this.http.get<WishList[]>(USER_WISHLIST_URL + '/' + userId)
      .pipe(
        catchError(err => {
          const message = ' Unable to Load Favourites';
          this.toastrService.error(message);
          console.log(message, err);
          return throwError(err);
        }),
        tap(o => {
          this.wishlistSubject.next(o);
          this.wishlist = o;
        })
      ).subscribe();
  }

  public save(bundleId: number) {

    if (this.user) {

      if (this.InWishList(bundleId)) {
        return this.toastrService.info('The Item is already in your Favourites');
      }

      const wishlist: WishList = new WishList();
      wishlist.sku_id = bundleId;
      wishlist.user_id = this.user.userId;

      if (this.subSave) {
        this.subSave.unsubscribe();
      }

      this.subSave = this.http.post<WishList[]>(USER_WISHLIST_URL, wishlist)
        .pipe(
          catchError(err => {
            const message = ' Unable to Save to your Favourites';
            this.toastrService.error(message);
            console.log(message, err);
            return throwError(err);
          }),
          tap(o => {
            this.wishlistSubject.next(o);
            this.wishlist = o;
            this.toastrService.success('Item has been added to your Favourites');
          })
        ).subscribe();
    } else {
      this.toastrService.warning('You are not logged in, this might be due to session expiry, please re-login');
    }
  }

  public updateStatus(wishlistId: number, status: number, productId: number) {

    if (this.user) {
      if (this.subUpdate) {
        this.subUpdate.unsubscribe();
      }

      const wishlist: WishList = new WishList();
      wishlist.sku_id = productId;
      wishlist.user_id = this.user.userId;
      wishlist.status_id = status;

      this.subUpdate = this.http.put<WishList[]>(USER_WISHLIST_URL + '/' + wishlistId, wishlist)
        .pipe(
          catchError(err => {
            const message = ' Unable to Update your Favourites';
            this.toastrService.error(message);
            console.log(message, err);
            return throwError(err);
          }),
          tap(o => {
            this.wishlistSubject.next(o);
            this.wishlist = o;
            if (status === 3) {
              this.toastrService.success('Item has been removed from your Favourites');
            }
          })
        ).subscribe();
    } else {
      this.toastrService.warning('You are not logged in, this might be due to session expiry, please re-login');
    }
  }

  private InWishList(id: number): boolean {
    return !(this.wishlist.find(el => el.sku_id === id) === undefined);
  }
}

