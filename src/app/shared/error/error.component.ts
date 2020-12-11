import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  public themeLogo = 'assets/images/icon/logo-7.png';

  constructor() { }

  ngOnInit(): void {
    document.documentElement.style.setProperty('--theme-deafult', '#a3d7e7');
  }
}
