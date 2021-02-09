import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BarRatingModule } from 'ngx-bar-rating';
import { LazyLoadImageModule, scrollPreset } from 'ng-lazyload-image';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

// Header and Footer Components
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

// Components
import { MenuComponent } from './components/menu/menu.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { ProductBoxOneComponent } from './components/product/product-box-one/product-box-one.component';
import { ProductBoxVerticalComponent } from './components/product/product-box-vertical/product-box-vertical.component';

// Modals Components
import { QuickViewComponent } from './components/modal/quick-view/quick-view.component';
import { QuickAddressViewComponent } from './components/modal/quick-address-view/quick-address-view.component';

// Skeleton Loader Components
import { SkeletonProductBoxComponent } from './components/skeleton/skeleton-product-box/skeleton-product-box.component';

// Tap To Top
import { TapToTopComponent } from './components/tap-to-top/tap-to-top.component';

// Pipes
import { DiscountPipe } from './pipes/discount.pipe';
import { ErrorComponent } from './error/error.component';
import {QuickTermsViewComponent} from './components/modal/quick-terms-view/quick-terms-view.component';
import {TreeViewWrapperComponent} from './components/treeview/treeview.component';
import {TreeviewModule} from 'ngx-treeview';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    SettingsComponent,
    CategoriesComponent,
    ProductBoxOneComponent,
    ProductBoxVerticalComponent,
    QuickViewComponent,
    QuickAddressViewComponent,
    QuickTermsViewComponent,
    SkeletonProductBoxComponent,
    TapToTopComponent,
    ErrorComponent,
    TreeViewWrapperComponent,
    DiscountPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CarouselModule,
    TreeviewModule.forRoot(),
    BarRatingModule,
    LazyLoadImageModule.forRoot({
      // preset: scrollPreset // <-- tell LazyLoadImage that you want to use scrollPreset
    }),
    NgxSkeletonLoaderModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CarouselModule,
    BarRatingModule,
    LazyLoadImageModule,
    NgxSkeletonLoaderModule,
    HeaderComponent,
    FooterComponent,
    CategoriesComponent,
    ProductBoxOneComponent,
    ProductBoxVerticalComponent,
    QuickViewComponent,
    QuickAddressViewComponent,
    QuickTermsViewComponent,
    SkeletonProductBoxComponent,
    TapToTopComponent,
    TreeViewWrapperComponent,
    DiscountPipe
  ]
})
export class SharedModule { }
