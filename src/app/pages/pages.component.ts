import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  public url: any;
  public themeLogo = 'assets/images/icon/logo-7.png'; // Change Logo

  constructor(private router: Router) { 
    this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
            this.url = event.url;
          }
    });
  }

  ngOnInit(): void {
    document.documentElement.style.setProperty('--theme-deafult', '#a3d7e7');
  }
}
