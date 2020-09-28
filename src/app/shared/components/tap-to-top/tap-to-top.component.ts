import { Component, OnInit, HostListener } from '@angular/core';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-tap-to-top',
  templateUrl: './tap-to-top.component.html',
  styleUrls: ['./tap-to-top.component.scss']
})
export class TapToTopComponent implements OnInit {

  public show = false;

  constructor(private viewScroller: ViewportScroller) { }

  ngOnInit(): void {
  }

  // @HostListener Decorator
  @HostListener('window:scroll', []) onWindowScroll() {
    const n = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (n > 600) {
      this.show = true;
    } else {
      this.show = false;
    }
  }

  tapToTop() {
    this.viewScroller.scrollToPosition([0, 0]);
  }
}
