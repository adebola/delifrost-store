import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {CategoryService} from '../../services/category.service';
import {TreeviewItem} from 'ngx-treeview';
import {Router} from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {
  items: any;
  public collapse = true;
  private subscription: Subscription;

  constructor(
      private router: Router,
      public categoryService: CategoryService) {}

  ngOnInit(): void {

    this.categoryService.categories$.subscribe(categories => {

      const items = {
        text: 'Categories',
        value: 'categories',
        collapsed: false,
        children: [
          {
            text: 'All',
            value: 'All'
          }
        ]
      };

      categories.forEach(category => {
        if (category.subCategories.length > 0) {

          const parent = {
            text: category.name,
            value: category.name,
            collapsed: true,
            children: []
          };

          category.subCategories.forEach(subcat => {
            parent.children.push({text: subcat.name, value: subcat.name});
          });

          items.children.push(parent);
        } else {
          items.children.push({text: category.name, value: category.name});
        }
      });

      this.items = this.getItems([items]);
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private getItems(parentChildObj) {
    const itemsArray = [];
    parentChildObj.forEach(set => {
      itemsArray.push(new TreeviewItem(set));
    });
    return itemsArray;
  }

  itemSelected(value: string) {

    if (value === 'All') {
      return  this.router.navigate(['/shop/collection']);
    }

    this.router.navigate(['/shop/collection'], {queryParams: {category: value}});
  }
}
