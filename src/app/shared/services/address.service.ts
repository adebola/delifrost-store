import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {AuthService} from 'src/app/auth/auth.service';
import {User} from 'src/app/auth/user.model';
import {environment} from 'src/environments/environment';
import {Address} from '../classes/address';

const USER_ADDRESS_URL = environment.base_url + '/api/v1/store/address';


@Injectable({providedIn: 'root'})
export class AddressService {
    private addressSubject = new BehaviorSubject<Address[]>(null);
    public addresses$ = this.addressSubject.asObservable();
    private user: User;

    constructor(private http: HttpClient, private authService: AuthService, private toastrService: ToastrService) {

        this.authService.user$.subscribe(user => {
            this.user = user;
            this.loadUserAddresses();
        });
    }

    getAddress(addressId: number): Observable<Address> {

        return this.addresses$.pipe(
            map(addr => {
                return addr.find(el => el.id === addressId);
            })
        );
    }

    updateAddress(addressId: number, address: string) {

        this.http.put<Address[]>(USER_ADDRESS_URL + '/' + addressId,
            {
                id: null,
                user_id: this.user.userId,
                address,
                is_default: false
            },
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(
                catchError(err => {
                    const message = 'Error Updating Address';

                    console.error(message, err);
                    this.toastrService.error(message);
                    return throwError(err);
                }),
                tap(o => {
                    this.addressSubject.next(o);
                    this.toastrService.success('The Address has been updated Successfully');
                })
            ).subscribe();
    }

    saveAddress(address: string) {

        this.http.post<Address[]>(USER_ADDRESS_URL,
            {
                id: null,
                user_id: this.user.userId,
                address,
                is_default: false
            },
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(
                catchError(err => {
                    const message = 'Error Saving Address';

                    console.error(message, err);
                    this.toastrService.error(message);
                    return throwError(err);
                }),
                tap(o => {
                    this.addressSubject.next(o);
                    this.toastrService.success('The Address has been created Successfully');
                })
            ).subscribe();
    }

    private loadUserAddresses() {

        if (!this.user) {
            this.toastrService.error('User Not Present');

            return of(null);
        }

        this.http.get<Address[]>(USER_ADDRESS_URL + '/' + this.user.userId)
            .pipe(
                catchError(err => {
                    const message = ' Unable to Load Addresses';
                    this.toastrService.error(message);
                    console.log(message, err);
                    return throwError(err);
                }),
                tap(o => this.addressSubject.next(o))
            ).subscribe();
    }
}
