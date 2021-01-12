import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-quick-terms-view',
    templateUrl: './quick-terms-view.component.html',
    styleUrls: ['./quick-terms-view.component.scss']
})
export class QuickTermsViewComponent implements OnInit, OnDestroy {
    private modalOpen = false;
    public closeResult: string;
    @ViewChild('quickTermsView', {static: false}) QuickView: TemplateRef<any>;

    constructor(private modalService: NgbModal) {
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {

        if (this.modalOpen) {
            this.modalOpen = false;
            this.modalService.dismissAll();
        }
    }

    openModal() {
        this.modalOpen = true;

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
}
