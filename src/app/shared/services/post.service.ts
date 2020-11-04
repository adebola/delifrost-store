import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Post } from '../classes/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private http: HttpClient,
    private toastrService: ToastrService) {

  }

  getProductPosts(productId: number): Observable<Post[]> {

    const POST_URL = environment.base_url + '/api/v1/store/posts/byproduct/' +  productId;

    return this.http.get<Post[]>(POST_URL)
        .pipe(
            catchError(err => {
              const message = ' Unable to Load Post for Product ' + productId;
              this.toastrService.error(message);
              console.log(message, err);
              return throwError(err);
            }),
            shareReplay()
        );
  }

  savePost(post: Partial<Post>) {
    const POST_URL =  environment.base_url + '/api/v1/store/posts/';

    this.http.post<Partial<Post>>(POST_URL, post, {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    }).pipe(
      catchError(err => this.handleError(err, 'Unable to Save Post : '))
    ).subscribe();
  }

  updatePost(post: Post) {
    const PUT_URL = environment.base_url + '/api/v1/store/posts/' +  post.id;

    const newPost = {
      ...post,
      id: null,
      creator_name: null,
      creator_email: null,
      createdDate: null,
      comment_count:  null
    };

    this.http.put<Post>(PUT_URL, newPost,
    {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    })
    .pipe(
      catchError(err => this.handleError(err, 'Unable to Update Post : '))
    ).subscribe();
  }

  getPostComments(postId: number): Observable<Comment[]> {

    return null;
  }

  private handleError(err, message) {

    this.toastrService.error(message);
    console.log(message, err);
    return throwError(err);
  }
}
