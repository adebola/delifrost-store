import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { finalize, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {

    return of(null)
    .pipe(
      tap(() => this.loadingOn()),
      switchMap(() => obs$),
      finalize(() => this.loadingOff())
    );
  }

  loadingOn() {
    console.log('ON');
    this.loadingSubject.next(true);
  }

  loadingOff() {
    console.log('OFF');
    this.loadingSubject.next(false);
  }
}