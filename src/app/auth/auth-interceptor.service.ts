import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { exhaustMap, take } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor  {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const url = req.url.substring(0, environment.base_url.length);
    console.log('Header Substring ' + url);

    if (url !== environment.base_url) {
      console.log('Header not modified for ' + req.url);
      return next.handle(req);
    }

    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {

        const headerSettings: {[name: string]: string | string[]; } = {};
        headerSettings['X-TenantID'] = environment.multistore_token;

        if (!user) {
          const tenantHeader = new HttpHeaders(headerSettings);
          const tenantReq = req.clone({headers: tenantHeader});
          console.log('Tenant Header Included for ' + req.url);
          return next.handle(tenantReq);
        }

        headerSettings['Authorization'] = 'Bearer ' + user.token;

        const newHeader = new HttpHeaders(headerSettings);
        const authReq = req.clone({headers: newHeader});

        console.log('Tenant and Auth Header Included for ' + req.url);

        return next.handle(authReq);
      })
    );
  }
}
