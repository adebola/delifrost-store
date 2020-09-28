import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog-placeholder',
  templateUrl: './blog-placeholder.component.html',
  styleUrls: ['./blog-placeholder.component.scss']
})
export class BlogPlaceHolderComponent implements OnInit {
  public themeLogo = 'assets/images/icon/logo-7.png'; // Change Logo

  ngOnInit(): void {
    document.documentElement.style.setProperty('--theme-deafult', '#fc8c03');
  }
}
