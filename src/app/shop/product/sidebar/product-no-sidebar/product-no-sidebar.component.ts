import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Bundle, Product } from '../../../../shared/classes/product';
import { ProductService } from '../../../../shared/services/product.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from 'src/app/shared/classes/post';
import { PostService } from 'src/app/shared/services/post.service';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { WishListService } from 'src/app/shared/services/wishlist.service';

@Component({
  selector: 'app-product-no-sidebar',
  templateUrl: './product-no-sidebar.component.html',
  styleUrls: ['./product-no-sidebar.component.scss']
})
export class ProductNoSidebarComponent implements OnInit {

  public bundle: Bundle;
  public price: number;
  public discountedPrice: number;
  public product: Product;
  public counter = 1;

  // public activeSlide: any = 0;
  // public selectedSize: any;
  // public ProductDetailsMainSliderConfig: any = ProductDetailsMainSlider;
  // public ProductDetailsThumbConfig: any = ProductDetailsThumbSlider;

  public posts$: Observable<Post[]>;
  public showAddPost = false;

  constructor(private route: ActivatedRoute, private router: Router,
              public productService: ProductService, public cartService: CartService,
              public authService: AuthService, public postService: PostService,
              private toastrService: ToastrService, private wishlistService: WishListService) {}

  ngOnInit(): void {

    this.route.data.subscribe(response => {
      this.product = response.data;
      this.bundle = this.product.bundles[0];
      this.initValues();
    });

    this.loadPosts();
  }

  // Increment
  increment() {
    this.counter++;
    this.initValues();
  }

  // Decrement
  decrement() {

    if (this.counter > 1) {
      this.counter--;
      this.initValues();
    }
  }

  addPost() {
    if (this.authService.isLoggedIn) {
      this.showAddPost = true;
    } else {
      this.toastrService.warning('You must be logged onto the systems to Post, thanks');
    }
  }

  private loadPosts() {
    this.posts$ = this.postService.getProductPosts(this.product.productId);
  }

  private initValues() {
    this.price = this.bundle.price * this.counter;
    this.discountedPrice  = this.bundle.price * (1 - (this.bundle.discount / 100)) * this.counter;
  }

  onSubmit(form: NgForm) {

    if (!form.valid) {
      return this.toastrService.error('Please fill all items in the Post Form');
    }

    if (this.authService.userId === 0) {
      return this.toastrService.error('Please login again, your session might timed out');
    }

    const post: Partial<Post> = {
      title: form.value.title,
      content: form.value.post,
      creator_id: this.authService.userId,
      product_id: this.product.productId
    };

    this.postService.savePost(post);
    this.showAddPost = false;

    this.loadPosts();
  }

  // Add to cart
  addToCart() {
    const quantity = this.counter || 1;
    this.cartService.addToCart(this.product, this.bundle.id, quantity);
  }

  // Buy Now
  async buyNow(product: Product) {
    product.bundles[0].quantity = this.counter || 1;
    const status = await this.cartService.addToCart(product, product.bundles[0].id, 1);
    if (status) {
      this.router.navigate(['/shop/checkout']);
    }
  }

  // Add to Wishlist
  addToWishlist(product: Product) {
    this.wishlistService.save(product.bundles[0].id);
  }
}
