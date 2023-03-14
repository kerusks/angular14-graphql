import { GET_Posts } from '../gql/posts-query';
import { CREATE_Post } from '../gql/posts-mutation';
import { Apollo } from 'apollo-angular';
import { Post } from '../post';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit{

  constructor(private apollo:Apollo, private router: Router) {}

  postForm:Post = {
    id: 0,
    title: '',
    views: 0
  }

  ngOnInit(): void {
    
  }

  create() {
    this.apollo.mutate<{createPost:Post}>({
      mutation: CREATE_Post,
      variables: {
        title: this.postForm.title,
        views: this.postForm.views
      },
      update: (store, {data}) => {
        if (data?.createPost) {
          var allData = store.readQuery<{allPosts: Post[]}>({query: GET_Posts})
          if (allData && allData?.allPosts.length > 0) {
              var newData:Post[] = [...allData?.allPosts]
              newData.unshift(data.createPost);
              store.writeQuery<{allPosts: Post[]}>({
                query: GET_Posts,
                data: {allPosts:newData}
              })
          }
        }
      }
    }).subscribe(({data}) => {
      this.router.navigate(["/"])
    })
  }
}
