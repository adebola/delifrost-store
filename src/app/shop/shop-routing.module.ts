import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { ProductNoSidebarComponent } from './product/sidebar/product-no-sidebar/product-no-sidebar.component';
import { CollectionComponent } from './collection/collection.component';

import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SuccessComponent } from './checkout/success/success.component';

import { Resolver } from '../shared/services/resolver.service';
import { AuthGuard } from '../auth/auth-guard.service';
import { SearchComponent } from './search/search.component';


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
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'checkout/success/:id',
    component: SuccessComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'search',
    component: SearchComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
