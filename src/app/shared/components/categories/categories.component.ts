import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../classes/product';
import { ProductService } from '../../services/product.service';
import {Category} from '../../classes/category';
import {CategoryService} from '../../services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  public collapse = true;

  constructor(public categoryService: CategoryService) {}

  ngOnInit(): void {}

}
