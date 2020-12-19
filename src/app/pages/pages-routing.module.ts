import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './account/dashboard/dashboard.component';
import { ProfileComponent } from './account/profile/profile.component';
import { AuthGuard } from '../auth/auth-guard.service';
import { OrderComponent } from './account/order/order.component';
import {WishlistComponent} from './wishlist/wishlist.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'wishlist',
    component: WishlistComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'orders',
    component: OrderComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
