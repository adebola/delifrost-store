import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductService } from '../../shared/services/product.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {

  public themeLogo = 'assets/images/icon/logo-7.png'; // Change Logo

  constructor(
      private http: HttpClient,
      public productService: ProductService,
      public categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    // Change color for this layout
    document.documentElement.style.setProperty('--theme-deafult', '#a3d7e7');
  }

  ngOnDestroy(): void {
    // Remove Color
    document.documentElement.style.removeProperty('--theme-deafult');
  }

  OnClick() {
    this.http.get(environment.base_url + '/api/v1/test').subscribe(msg => console.log(msg));
  }
}
