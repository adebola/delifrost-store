import { Injectable } from '@angular/core';
import {Observable, BehaviorSubject, throwError, of} from 'rxjs';
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
  organization: string;
  captchaResponse: string;
  roles: string[];
}

export interface AuthSignUpResponseData {
  status: number;
  message: string;
}

interface AuthSignInRequestData {
  username: string;
  password: string;
  captchaResponse: string;
}

export interface AuthSignInResponseData {
  status: number;
  message: string;
  id: string;
  username: string;
  email: string;
  fullName: string;
  telephone: string;
  address: string;
  organization: string;
  token: string;
}

const AUTH_URL =  environment.base_url + '/api/v1/auth';
const SIGNUP_URL = environment.base_url + '/api/v1/auth/signup';
const SIGNIN_URL = environment.base_url + '/api/v1/auth/signin';
const UPDATE_URL = environment.base_url + '/api/v1/users';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private subject = new BehaviorSubject<User>(null);
  public user$ = this.subject.asObservable();
  private user: User;

  public isLoggedIn = false;
  public userId = 0;
  private failedReq: string;

  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router, private toastrService: ToastrService) { }

  public changePassword(password: string, newPassword: string) {
    const self = this;

    this.http.put<{message: string}>(UPDATE_URL + '/password/' + this.userId, {
      currentpassword : password,
      newPassword
    }).pipe(
        catchError(err => {
          this.handleError(err, self);
          return throwError(err);
        }),
        tap(() => this.toastrService.success('Password changed successfully'))
    ).subscribe();
  }

  public getResetToken(token: string): Observable<User> {

    if (!token || token.length === 0 ) {
      return of(null);
    }

    return this.http.get<User>(AUTH_URL + '/user/' + token);
  }

  public changeTokenPassword(token: string, password: string) {
    const self = this;

    this.http.post<{message: string}>(AUTH_URL + '/' + 'changepassword',{
      token,
      password
    } ).pipe(
        catchError(err => {
          this.handleError(err, self);
          return throwError(err);
        }),
        tap(() => this.toastrService.success('Password changed successfully'))
    ).subscribe(() => this.router.navigate(['/auth/login']));
  }

  public generatePasswordResetRequest(email: string) {

    const self = this;
    this.http.post<{message: string}>(AUTH_URL + '/resetpassword', {
      email
    }).pipe(
        catchError(err => {
          this.handleError(err, self);
          return throwError(err);
        }),
        tap(() => this.toastrService.success('Password reset link has been sent to your email'))
    ).subscribe(message => {

      console.log('MESSAGE FROM THE BACKEND', message);
      // const message = 'Please click on ' + environment.base_url + '/auth'
    });
  }
  public updateUser(user: User) {

    const self = this;

    user.email = this.user.email;
    user.username = this.user.username;

    this.http.put<any>(UPDATE_URL + '/' + this.userId, user)
        .pipe (
            catchError(err => {
              this.handleError(err, self);
              return throwError(err);
            }),
            tap(u  => {
              this.toastrService.success('User has been updated successfully');

              const newUser: User = new User(
                  self.user.userId,
                  u.username,
                  u.email,
                  u.fullName,
                  u.telephone,
                  self.user.address,
                  u.organization,
                  self.user.token,
                  self.user.tokenExpirationDate
              );

              self.user = newUser;
              self.subject.next(newUser);
              this.saveUserToLocalStorage(newUser);
            })
        ).subscribe();
}


  signup(username: string, email: string, password: string,
         fullName: string, telephone: string, address: string,
         organization: string, captchaResponse: string): Observable<AuthSignUpResponseData> {

    const roles = ['user'];

    const signupRequest: AuthSignUpRequestData = {
      username,
      email,
      fullName,
      password,
      telephone,
      address,
      organization,
      captchaResponse,
      roles
    };

    const self = this;
    return this.http.post<AuthSignUpResponseData>(SIGNUP_URL, signupRequest)
      .pipe(
          catchError(err => {
            this.handleError(err, self);
            return throwError(err);
          })
      );
  }

  login(username: string, password: string, captchaResponse: string): Observable<AuthSignInResponseData> {

    const signInRequest: AuthSignInRequestData = { username, password, captchaResponse };

    const self = this;
    return this.http.post<AuthSignInResponseData>(SIGNIN_URL, signInRequest)
      .pipe(
          catchError(err => {
            this.handleError(err, self);
            return throwError(err);
          }),
        tap(response => {
          this.handleAuthentication(response, self);
        })
      );
  }

  private handleAuthentication(responseData: AuthSignInResponseData, self: any) {

      const decoded = jwt_decode(responseData.token);
      const expiryDate = new Date(parseInt(decoded.exp, 10) * 1000);
      const nowDate = new Date();

      const expirationDuration = expiryDate.getTime() - nowDate.getTime();

      console.log(responseData);

      const user =
          new User(
              +responseData.id,
              responseData.username,
              responseData.email,
              responseData.fullName,
              responseData.telephone,
              responseData.address,
              responseData.organization,
              responseData.token,
              expiryDate
          );

      this.user = user;
      self.subject.next(user);
      self.autoLogout(expirationDuration);
      self.isLoggedIn = true;
      self.userId = user.userId;
      this.saveUserToLocalStorage(user);
  }

  public saveUserToLocalStorage(user: User) {
    localStorage.setItem('userData', JSON.stringify(user ? user : this.user));
  }

  private handleError(errorResponse: HttpErrorResponse, self: any) {
    let errorMessage = 'Unknown Error Occurred';

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

    this.toastrService.error(errorMessage);
  }

  autoLogout(expirationDuration: number) {

    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
      this.toastrService.success('You session has expired and you have been Logged Out');
      this.router.navigate(['/auth/login']);
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
        userData.organization,
        userData._token,
        new Date(userData._tokenExpirationDate));

    if (user.token) {
      const expirationDuration = new Date(user.tokenExpirationDate).getTime() - new Date().getTime();

      if (expirationDuration > 1000) {
        this.autoLogout(expirationDuration);
        this.user = user;
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

