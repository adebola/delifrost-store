import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { SharedModule } from '../shared/shared.module';
import { PagesRoutingModule } from './pages-routing.module';

// Pages Components
import { DashboardComponent } from './account/dashboard/dashboard.component';

import { ProfileComponent } from './account/profile/profile.component';


import { OrderComponent } from './account/order/order.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ProfileComponent,
    OrderComponent
  ],
  imports: [
    CommonModule,
    GalleryModule.forRoot(),
    SharedModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }
