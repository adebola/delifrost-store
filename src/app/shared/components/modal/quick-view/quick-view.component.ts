import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Bundle, Product } from '../../../classes/product';
import { ProductService } from '../../../../shared/services/product.service';
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
  selector: 'app-quick-view',
  templateUrl: './quick-view.component.html',
  styleUrls: ['./quick-view.component.scss']
})
export class QuickViewComponent implements OnInit, OnDestroy  {

  public bundle: Bundle;
  public price: number;
  public discountedPrice: number;
  @Input() product: Product;
  @Input() currency: any;
  @ViewChild('quickView', { static: false }) QuickView: TemplateRef<any>;
  // @ViewChild('discountedPrice') h3Price: ElementRef<any>;
  // @ViewChild('fullPrice') spanPrice: ElementRef<any>;

  public closeResult: string;
  public ImageSrc: string;
  public counter: number = 1;
  public modalOpen: boolean = false;

  constructor(private router: Router, private modalService: NgbModal,
              public cartService: CartService,
              public productService: ProductService) { }

  ngOnInit(): void {
  }

  openModal(bundleId: number) {
    this.modalOpen = true;
    this.bundle = this.product.bundles.find(bundle => bundle.id === bundleId);
    this.price = this.bundle.price * this.counter;
    this.discountedPrice  = this.bundle.price * (1 - (this.bundle.discount / 100)) * this.counter;

    this.modalService.open(this.QuickView, {
        size: 'lg',
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
        windowClass: 'Quickview'
      }).result.then((result) => {
        console.log(result);
        `Result ${result}`;
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

  // Change Variants
  // ChangeVariants(color, product) {
  //   product.variants.map((item) => {
  //     if (item.color === color) {
  //       product.images.map((img) => {
  //         if (img.image_id === item.image_id) {
  //           this.ImageSrc = img.src;
  //         }
  //       });
  //     }
  //   });
  // }

  // Increment
  increment() {
    this.counter++;
    this.price = this.bundle.price * this.counter;
    this.discountedPrice  = this.bundle.price * (1 - (this.bundle.discount / 100)) * this.counter;
  }

  // Decrement
  decrement() {
    if (this.counter > 1) {
      this.counter-- ;
      this.price = this.bundle.price * this.counter;
      this.discountedPrice  = this.bundle.price * (1 - (this.bundle.discount / 100)) * this.counter;
    }
  }

  // Add to cart
  async addToCart(product: Product, bundleId: number) {
    const quantity = this.counter || 1;
    const status = await this.cartService.addToCart(product, bundleId, quantity);

    // if (status) {
    //   this.router.navigate(['/shop/cart']);
    // }
  }

  onChange(bundleId) {

    this.bundle = this.productService.findProductByBundleId(bundleId);
    this.price = this.bundle.price;
    this.discountedPrice  = this.bundle.price * (1 - (this.bundle.discount / 100)) * this.counter;

    // this.renderer.setProperty(this.h3Price.nativeElement, 'value', '111');
    // this.renderer.setProperty(this.spanPrice.nativeElement, 'value', '222');

    // const span = document.getElementById('price-full');
    // const h3 = document.getElementById('price-discount');

    // // span.innerHTML = '₦' + this.bundle.price.toFixed(0);
    // span.innerText = '11111';


    // const price = this.bundle.price * (1 - (this.bundle.discount / 100)) * this.counter;
    // h3.innerText = '₦' + price.toFixed(0);

    // console.log('SPAN');
    // console.log(span);
    // console.log(h3);
    // console.log(price);

    //const bundleObs$: Observable<Bundle> = this.productService.findProductByBundleId(bundleId);
    //const subscription: Subscription = bundleObs$.subscribe(bundle => this.bundle = bundle);
  }

  ngOnDestroy() {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }

}
