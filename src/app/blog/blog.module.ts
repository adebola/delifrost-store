import { NgModule } from '@angular/core';
import { BlogPageComponent } from './blog-page/blog-page.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { SharedModule } from '../shared/shared.module';
import { BlogRoutingModule } from './blog-routing.module';
import { GalleryModule } from '@ks89/angular-modal-gallery';


@NgModule({
  declarations: [
    BlogPageComponent,
    BlogDetailsComponent
  ],
  imports: [
    SharedModule,
    GalleryModule.forRoot(),
    BlogRoutingModule
  ]
})
export class BlogModule {}