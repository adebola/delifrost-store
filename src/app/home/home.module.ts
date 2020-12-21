import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';

import { LandingComponent } from './landing/landing.component';

// Widget Components
import { SliderComponent } from './widgets/slider/slider.component';

@NgModule({
  declarations: [
    LandingComponent,

    // Widget Components
    SliderComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule
  ]
})
export class HomeModule { }
