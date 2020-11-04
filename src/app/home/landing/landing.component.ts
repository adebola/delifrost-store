import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { VideoModalComponent } from '../../shared/components/modal/video-modal/video-modal.component';
import { ProductSlider } from '../../shared/data/slider';
import { ProductService } from '../../shared/services/product.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {

  public themeLogo = 'assets/images/icon/logo-7.png'; // Change Logo

  public ProductSliderConfig: any = ProductSlider;

  @ViewChild('videoModal') VideoModal: VideoModalComponent;

  constructor(public productService: ProductService) {}

  // Sliders
  public sliders = [{
    title: 'save upto 20%',
    subTitle: 'premium butter & cheese',
    image: 'assets/images/slider/butter.jpg'
  },
  {
    title: 'save upto 10%',
    subTitle: 'high grade corn products',
    image: 'assets/images/slider/corn.jpg'
  }];

  // Blogs
  public blogs = [{
    image: 'assets/images/blog/20.jpg',
    date: '25 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  },
  {
    image: 'assets/images/blog/21.jpg',
    date: '26 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  },
  {
    image: 'assets/images/blog/22.jpg',
    date: '27 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  },
  {
    image: 'assets/images/blog/23.jpg',
    date: '28 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  }];

  ngOnInit(): void {
    // Change color for this layout
    document.documentElement.style.setProperty('--theme-deafult', '#fc8c03');
  }

  ngOnDestroy(): void {
    // Remove Color
    document.documentElement.style.removeProperty('--theme-deafult');
  }
}
