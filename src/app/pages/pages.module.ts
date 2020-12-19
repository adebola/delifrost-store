import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { SharedModule } from '../shared/shared.module';
import { PagesRoutingModule } from './pages-routing.module';

// Pages Components
import { DashboardComponent } from './account/dashboard/dashboard.component';

import { ProfileComponent } from './account/profile/profile.component';


import { OrderComponent } from './account/order/order.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import {AddressComponent} from './address/address.component';
import {StatisticsComponent} from './statistics/statistics.component';
import {ChangePasswordComponent} from './password/change-password.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ProfileComponent,
    OrderComponent,
    WishlistComponent,
    AddressComponent,
    StatisticsComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    GalleryModule.forRoot(),
    SharedModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }
