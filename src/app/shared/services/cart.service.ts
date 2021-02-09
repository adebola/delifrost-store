import { Injectable } from '@angular/core';
import { Product } from '../classes/product';
import { Cart } from '../classes/cart';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly cart: Cart;
  public cartChanged = new Subject<Product[]>();

  constructor(private toastrService: ToastrService) {

    this.cart = JSON.parse(localStorage.cartItems || '{}');

    if (!this.cart.items) {
      this.zeroCart();
      this.cartChanged.next(this.cartArray());
    }
  }

  public zeroCart() {
    this.cart.items = null;
    this.cart.totalQty = 0;
    this.cart.totalVAT = 0;
    this.cart.subTotal = 0;
    this.cart.totalPrice = 0;
    this.cart.delivery = 0;

    localStorage.removeItem('cartItems');
    this.cartChanged.next(this.cartArray());
  }

  addDelivery() {
    if (this.cart.delivery === 0) {
      this.cart.delivery = 1000;
      this.cart.totalPrice += 1000;

      this.toastrService.success('Your Items will be delivered.');
      this.cartChanged.next(this.cartArray());
      localStorage.setItem('cartItems', JSON.stringify(this.cart));
    }
  }

  removeDelivery() {
    if (this.cart.delivery > 0) {
      this.cart.totalPrice -= this.cart.delivery;
      this.cart.delivery = 0;

      this.toastrService.success('Your Items will be not be delivered.');
      this.cartChanged.next(this.cartArray());
      localStorage.setItem('cartItems', JSON.stringify(this.cart));
    }
  }

  public get cartItems(): Product[] {
    return this.cartArray();
  }

  private cartArray(): Product[] {
    const arr = [];

    // tslint:disable-next-line: forin
    for (const id in this.cart.items) {
      arr.push(this.cart.items[id]);
    }

    return arr;
  }

  public get cartTotalAmount(): number {
    return this.cart.totalPrice;
  }

  public get cartSubTotal(): number {
    return this.cart.subTotal;
  }

  public get cartVAT(): number {
    return this.cart.totalVAT;
  }

  // Add Product Bundle to Shopping Cart

  public addToCart(item: Product, bundleId: number, quantity: number): boolean {

    let storedItem: Product;
    let incrementalPrice = 0;
    let incrementalQuantity = 0;
    let incrementalVAT = 0;

    if (this.cart.items) {
      storedItem = this.cart.items[item.productId];
    } else {
      this.cart.items = {};
    }

    if (!storedItem) {
      storedItem = this.cart.items[item.productId] = item;
    }

    storedItem.bundles.forEach((bundle) => {
      if (bundle.id === bundleId) {

        const discount = 1 - (bundle.discount / 100);
        incrementalPrice = quantity * (bundle.price * discount);
        incrementalQuantity = (quantity > 0) ? 1 : 0;
        incrementalVAT = bundle.vatExclusive ? 0 : incrementalPrice * 0.075;

        bundle.quantity = bundle.quantity ? bundle.quantity + quantity : quantity;
        bundle.subTotalPrice = bundle.subTotalPrice ? bundle.subTotalPrice + incrementalPrice : incrementalPrice;

        bundle.VATPrice = bundle.vatExclusive ? 0 :  (bundle.VATPrice > 0.0 ? bundle.VATPrice += incrementalVAT : incrementalVAT);
        bundle.subTotalVatPrice =  bundle.subTotalPrice +  bundle.VATPrice;

        this.toastrService.success(item.name + ' has been added to the Cart.');
      } else {
        bundle.quantity = 0;
        bundle.subTotalPrice = 0;
        bundle.subTotalVatPrice = 0;
        bundle.VATPrice = 0;
      }
    });

    this.recalculate();
    this.cartChanged.next(this.cartArray());
    localStorage.setItem('cartItems', JSON.stringify(this.cart));

    return true;
  }

  recalculate() {
    let total_price = 0;
    let subtotal_price = 0;
    let vat = 0;

    let quantity = 0;

    for (const id in this.cart.items) {
      if (this.cart.items[id]) {
        this.cart.items[id].bundles.forEach((bundle) => {
          if (bundle.quantity > 0) {
            subtotal_price += bundle.subTotalPrice;
            vat += bundle.VATPrice;
            total_price += bundle.subTotalVatPrice;
            quantity++;
          }
        });
      }
    }

    this.cart.totalPrice = total_price;
    this.cart.subTotal = subtotal_price;
    this.cart.totalVAT = vat;
    this.cart.totalQty = quantity;
  }

  // Remove Product Bundle from Shopping Cart
  public removeItem(productId: number, bundleId: number) {

    let deleteProduct = true;
    const storedItem: Product = this.cart.items[productId];

    if (storedItem) {
      storedItem.bundles.forEach((bundle) => {
        if (bundle.id === bundleId) {
          this.cart.totalPrice -= bundle.subTotalVatPrice;
          this.cart.totalQty -= 1;

          bundle.quantity = 0;
          bundle.subTotalPrice = 0;
          bundle.VATPrice = 0;
          bundle.subTotalVatPrice = 0;
          this.toastrService.success(storedItem.name + ' has been removed from the Cart.');
        } else {
          if (bundle.quantity > 0) {
            deleteProduct = false;
          }
        }
      });
    }

    if (storedItem && deleteProduct) {
      delete this.cart.items[productId];
    }

    this.recalculate();
    this.cartChanged.next(this.cartArray());
    localStorage.setItem('cartItems', JSON.stringify(this.cart));
  }

  // Add 1 more to Quantity in Bundle, it assumes the Bundle is already in the Cart
  public addItemByOne(productId: number, bundleId: number) {

    let incrementalPrice = 0;
    let incrementalVAT = 0;
    const storedItem: Product = this.cart.items[productId];

    if (storedItem) {
      storedItem.bundles.forEach((bundle) => {
        if (bundle.id === bundleId) {
          const discount = 1 - (bundle.discount / 100);
          incrementalPrice = bundle.price * discount;
          incrementalVAT = bundle.vatExclusive ? 0 : incrementalPrice * 0.075;

          bundle.quantity += 1;
          bundle.subTotalPrice += incrementalPrice;
          bundle.VATPrice += incrementalVAT;
          bundle.subTotalVatPrice = bundle.subTotalPrice +  bundle.VATPrice;
        }
      });

      this.recalculate();
      this.cartChanged.next(this.cartArray());
      localStorage.setItem('cartItems', JSON.stringify(this.cart));
    }
  }

  public reduceItemByOne(productId: number, bundleId: number) {
    let incrementalPrice = 0;
    let incrementalVAT = 0;

    const storedItem: Product = this.cart.items[productId];

    if (storedItem) {
      storedItem.bundles.forEach((bundle) => {
        if (bundle.id === bundleId) {
          const discount = 1 - (bundle.discount / 100);
          incrementalPrice = bundle.price * discount;
          incrementalVAT = bundle.vatExclusive ? 0 : incrementalPrice * 0.075;

          bundle.quantity -= 1;
          bundle.subTotalPrice -= incrementalPrice;
          bundle.VATPrice -= incrementalVAT;
          bundle.subTotalVatPrice = bundle.subTotalPrice +  bundle.VATPrice;
        }
      });
      this.recalculate();
      this.cartChanged.next(this.cartArray());
    }
  }
}
