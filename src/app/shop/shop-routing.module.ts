import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { ProductNoSidebarComponent } from './product/sidebar/product-no-sidebar/product-no-sidebar.component';
import { CollectionComponent } from './collection/collection.component';

import { CartComponent } from './cart/cart.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SuccessComponent } from './checkout/success/success.component';

import { Resolver } from '../shared/services/resolver.service';
import { AuthGuard } from '../auth/auth-guard.service';


const routes: Routes = [

  {
    path: 'product/:slug',
    component: ProductNoSidebarComponent,
    canActivate: [AuthGuard],
    resolve: {
      data: Resolver
    }
  },
  {
    path: 'collection',
    component: CollectionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'wishlist',
    component: WishlistComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'checkout/success/:id',
    component: SuccessComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
