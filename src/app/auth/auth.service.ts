import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

interface AuthSignUpRequestData {
  username: string;
  email: string;
  fullName: string;
  telephone: string;
  address: string;
  password: string;
  roles: string[];
}

export interface AuthSignUpResponseData {
  message: string;
}

interface AuthSignInRequestData {
  username: string;
  password: string;
}

export interface AuthSignInResponseData {
  id: string;
  username: string;
  email: string;
  fullName: string;
  telephone: string;
  address: string;
  token: string;
}

const SIGNUP_URL = environment.base_url + '/api/v1/auth/signup';
const SIGNIN_URL = environment.base_url + '/api/v1/auth/signin';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private subject = new BehaviorSubject<User>(null);
  public user$ = this.subject.asObservable();
  public isLoggedIn = false;
  public userId = 0;
  private failedReq: string;

  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router, private toastrService: ToastrService) { }

  signup(username: string, email: string, password: string,
         fullName: string, telephone: string, address: string): Observable<AuthSignUpResponseData> {

    const roles = ['user'];

    const signupRequest: AuthSignUpRequestData = { username, email, fullName, password, telephone, address, roles };

    return this.http.post<AuthSignUpResponseData>(SIGNUP_URL, signupRequest)
      .pipe(catchError(this.handleError));
  }

  login(username: string, password: string): Observable<AuthSignInResponseData> {

    const signInRequest: AuthSignInRequestData = { username, password };

    return this.http.post<AuthSignInResponseData>(SIGNIN_URL, signInRequest)
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(resData);
        }));
  }

  private handleAuthentication(responseData: AuthSignInResponseData) {

    const decoded = jwt_decode(responseData.token);
    const expiryDate = new Date(parseInt(decoded.exp, 10) * 1000);
    const nowDate = new Date();

    const expirationDuration = expiryDate.getTime() - nowDate.getTime();

    const user =
      new User (
        +responseData.id,
        responseData.username,
        responseData.email,
        responseData.fullName,
        responseData.telephone,
        responseData.address,
        responseData.token,
        expiryDate
      );

    this.subject.next(user);
    this.autoLogout(expirationDuration);
    this.isLoggedIn = true;
    this.userId = user.userId;
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'Unknown Error Occurred';

    console.log(errorResponse);

    switch (errorResponse.status) {
      case 400:
        errorMessage = 'Bad Request: ' + errorResponse.error.message;
        break;

      case 401:
        errorMessage = 'Invalid User Name or Password';
        break;

      case 500:
        errorMessage = 'Internal Error Authenticating ' + errorResponse.error.message;
        break;
    }

    return throwError(errorMessage);
  }

  autoLogout(expirationDuration: number) {

    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
      this.toastrService.success('You session has expired and you have been Logged Out');
    }, expirationDuration);
  }

  autoLogin() {
    
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const user: User =
      new User(
        userData.userId,
        userData.username,
        userData.email,
        userData.fullName,
        userData.telephone,
        userData.address,
        userData._token,
        new Date(userData._tokenExpirationDate));

    if (user.token) {
      const expirationDuration = new Date(user.tokenExpirationDate).getTime() - new Date().getTime();

      if (expirationDuration > 1000) {
        this.autoLogout(expirationDuration);
        this.subject.next(user);

        this.userId = user.userId;
        this.isLoggedIn = true;

        if (this.failedReq) {
          this.router.navigate([this.failedReq]);
        }

      }
    }
  }

  logout() {

    this.isLoggedIn = false;
    this.subject.next(null);
    localStorage.removeItem('userData');
    this.userId = 0;

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.tokenExpirationTimer = null;
  }

  setFailedReq(value: string) {
    this.failedReq = value;
  }
}

