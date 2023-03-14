import { Router } from '@angular/router';
import { DELETE_Post } from './../gql/posts-mutation';
import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable, of } from 'rxjs';
import { GET_Posts } from '../gql/posts-query';
import { Post } from '../post';

declare var window:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private apollo:Apollo, private router: Router) {}

  allPosts$:Observable<Post[]> = of([])

  deleteModal: any;
  idToDelete: number = 0;



  ngOnInit(): void {
  this.deleteModal = new window.bootstrap.Modal( 
    document.getElementById('deleteModal')
  )


    this.allPosts$ = this.apollo
    .watchQuery<{allPosts:Post[]}>({query:GET_Posts})
    .valueChanges.pipe(map((result)=>result.data.allPosts))
  }

  launchModal(id:number) {
    this.idToDelete = id;
    this.deleteModal.show();
  }

  delete () {
    this.apollo.mutate<{removePost:Post}>({
      mutation: DELETE_Post,
      variables: {
        id: this.idToDelete,
      },
      update: (store, {data}) => {
        if (data?.removePost) {
          var allData = store.readQuery<{allPosts: Post[]}>({query: GET_Posts})
          if (allData && allData?.allPosts.length > 0) {
              var newData:Post[] = [...allData.allPosts]
              newData = newData.filter(_ => _.id !== data.removePost.id)
              store.writeQuery<{allPosts: Post[]}>({
                query: GET_Posts,
                data: {allPosts:newData}
              })
          }
        }
      }
    }).subscribe(({data}) => {
      this.deleteModal.hide();
    })
  }
}
