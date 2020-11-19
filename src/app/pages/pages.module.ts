import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { SharedModule } from '../shared/shared.module';
import { PagesRoutingModule } from './pages-routing.module';

// Pages Components
import { DashboardComponent } from './account/dashboard/dashboard.component';

import { ProfileComponent } from './account/profile/profile.component';
import { ContactComponent } from './account/contact/contact.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { SearchComponent } from './search/search.component';
import { ReviewComponent } from './review/review.component';
import { OrderSuccessComponent } from './order-success/order-success.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ProfileComponent,
    ContactComponent,
    AboutUsComponent,
    SearchComponent,
    ReviewComponent,
    OrderSuccessComponent
  ],
  imports: [
    CommonModule,
    GalleryModule.forRoot(),
    SharedModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }
