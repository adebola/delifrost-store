import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {Category} from '../classes/category';

const CATEGORY_URL = environment.base_url + '/api/v1/store/categories';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
  private subject = new BehaviorSubject<Category[]>([]);
  categories$: Observable<Category[]> = this.subject.asObservable();

  constructor(private http: HttpClient, private toastrService: ToastrService) {
    this.loadCategories();
  }

  private loadCategories() {
    const categories$ = this.http.get<Category[]>(CATEGORY_URL)
        .pipe(
            catchError(err => {
              const message = ' Unable to Load categories';
              this.toastrService.error(message);
              console.log(message, err);
              return throwError(err);
            }),
            tap(categories => this.subject.next(categories))
        ).subscribe();
  }
}
