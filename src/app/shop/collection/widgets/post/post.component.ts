import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { BehaviorSubject, fromEvent, of, Subscription } from 'rxjs';
import { exhaustMap, switchMap, take, tap } from 'rxjs/operators';
import { Post } from 'src/app/shared/classes/post';
import { PostService } from 'src/app/shared/services/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() post: Post;
  private subject = new BehaviorSubject<Comment[]>([]);
  comments$ = this.subject.asObservable();
  showComments = false;
  private likesSub: Subscription;
  private dislikesSub: Subscription;

  @ViewChild('likes', {static: true}) likesButton: ElementRef;
  @ViewChild('dislikes', {static: true}) dislikesButton: ElementRef;

  constructor(private postService: PostService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.likesSub.unsubscribe();
    this.dislikesSub.unsubscribe();
  }

  ngAfterViewInit(): void {

    this.likesSub = fromEvent(this.likesButton.nativeElement, 'click')
    .pipe(
      take(1),
      tap(() => {
        this.post.likes++;
        this.postService.updatePost(this.post);
      })
    ).subscribe();

    this.dislikesSub = fromEvent(this.dislikesButton.nativeElement, 'click')
    .pipe(
      take(1),
      tap(() => {
        this.post.dislikes++;
        this.postService.updatePost(this.post);
      })
    ).subscribe();
  }
}
