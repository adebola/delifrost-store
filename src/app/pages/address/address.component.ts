import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AddressService} from '../../shared/services/address.service';
import {Subscription} from 'rxjs';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-address',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit, OnDestroy {
    public editMode = true;
    public address: string;
    private oldAddress: string;
    private addressId: number;
    private oldAddressId: number;
    private subscription: Subscription;
    private subscriptionAddr: Subscription;
    private subscriptionRefresh: Subscription;

    @ViewChild('addressselect') addressSelect: ElementRef<HTMLSelectElement>;

    constructor(public addressService: AddressService, private toastrService: ToastrService) {
    }

    ngOnInit() {
        this.subscription = this.addressService.addresses$.subscribe(o => {
            if (o) {
                this.address = o[0].address;
                this.addressId = o[0].id;
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();

        if (this.subscriptionRefresh) {
            this.subscriptionRefresh.unsubscribe();
        }

        if (this.subscriptionAddr) {
            this.subscriptionAddr.unsubscribe();
        }
    }

    onSelectChange(event) {
        if (this.editMode) {

            if (this.subscriptionAddr) {
                this.subscriptionAddr.unsubscribe();
            }

            this.subscriptionAddr = this.addressService.getAddress(+event)
                .subscribe(o => {
                    this.address = o.address;
                    this.addressId = o.id;
                });
        }
    }

    onNew() {
        if (this.editMode) {
            this.editMode = false;
            this.oldAddressId = this.addressId;
            this.oldAddress = this.address;
            this.address = null;
            this.addressId = 0;

            this.addressSelect.nativeElement.hidden = true;

        } else {
            this.editMode = true;
            this.address = this.oldAddress;
            this.addressId = this.oldAddressId;

            this.addressSelect.nativeElement.hidden = false;
        }
    }

    onSave() {
        if (this.address && this.address.length > 0) {
            if (this.editMode) {
                this.addressService.updateAddress(this.addressId, this.address);
            } else {
                this.addressService.saveAddress(this.address);

                if (this.subscriptionRefresh) {
                    this.subscriptionRefresh.unsubscribe();
                }

                this.subscriptionRefresh = this.addressService.getAddress(this.oldAddressId)
                    .subscribe(o => {
                        this.editMode = true;
                        this.addressSelect.nativeElement.hidden = false;
                        this.address = o.address;
                        this.addressId = o.id;
                    });
            }
        } else {
            this.toastrService.error('Please ensure the address control is not Empty or Blank');
        }
    }
}
