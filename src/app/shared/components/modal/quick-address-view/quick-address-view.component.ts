import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AddressService } from 'src/app/shared/services/address.service';

@Component({
  selector: 'app-quick-address-view',
  templateUrl: './quick-address-view.component.html',
  styleUrls: ['./quick-address-view.component.scss']
})
export class QuickAddressViewComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  public address: string;
  private addressId: number;
  public closeResult: string;
  private modalOpen = false;
  private editMode = true;
  @ViewChild('quickAddressView', { static: false }) QuickView: TemplateRef<any>;

  constructor(private modalService: NgbModal, public addressService: AddressService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

    if (this.modalOpen) {
      this.modalOpen = false;
      this.modalService.dismissAll();
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openModal() {
    this.modalOpen = true;

    this.subscription = this.addressService.addresses$.subscribe(o => {
      this.address = o[0].address;
      this.addressId = o[0].id;

      this.modalService.open(this.QuickView, {
        size: 'lg',
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
        windowClass: 'Quickview'
      }).result.then((result) => {
        console.log(result);
        // `Result ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    });
  }

  private getDismissReason(reason: any): string {

    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  onSelectChange(event) {

    if (this.editMode) {
      this.subscription.unsubscribe();

      this.subscription = this.addressService.getAddress(+event)
        .subscribe(o => {
          this.address = o.address;
          this.addressId = o.id;
        });
    }
  }

  onNew() {
    this.editMode = false;
    this.address = null;
    this.addressId = 0;
  }

  onSave() {
    this.modalOpen = false;
    this.subscription.unsubscribe();
    this.modalService.dismissAll();

    if (this.editMode) {
      this.addressService.updateAddress(this.addressId, this.address);
    } else {
      this.addressService.saveAddress(this.address);
    }
  }
}
