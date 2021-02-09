import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng5SliderModule } from 'ng5-slider';
import { SharedModule } from '../shared/shared.module';
import { ShopRoutingModule } from './shop-routing.module';

// Product Details Components

import { ProductNoSidebarComponent } from './product/sidebar/product-no-sidebar/product-no-sidebar.component';

// Product Details Widgest Components
import { SocialComponent } from './product/widgets/social/social.component';
import { StockInventoryComponent } from './product/widgets/stock-inventory/stock-inventory.component';
import { RelatedProductComponent } from './product/widgets/related-product/related-product.component';

// Collection Components
import { CollectionComponent } from './collection/collection.component';

// Collection Widgets
import { GridComponent } from './collection/widgets/grid/grid.component';
import { PaginationComponent } from './collection/widgets/pagination/pagination.component';
import { BrandsComponent } from './collection/widgets/brands/brands.component';
import { PostComponent } from './collection/widgets/post/post.component';

import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SuccessComponent } from './checkout/success/success.component';
import { CartItemComponent } from './cart/cart-item/cart-item.component';
import { SearchComponent } from './search/search.component';

@NgModule({
    declarations: [
        ProductNoSidebarComponent,
        SocialComponent,
        StockInventoryComponent,
        RelatedProductComponent,
        CollectionComponent,
        GridComponent,
        PaginationComponent,
        BrandsComponent,
        PostComponent,
        CartComponent,
        SearchComponent,
        CartItemComponent,
        CheckoutComponent,
        SuccessComponent
    ],
    exports: [
        StockInventoryComponent
    ],
    imports: [
        CommonModule,
        Ng5SliderModule,
        SharedModule,
        ShopRoutingModule
    ]
})
export class ShopModule { }
