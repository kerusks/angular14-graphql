import { UDPATE_Post } from './../gql/posts-mutation';
import { GET_Posts, Posts_ById } from './../gql/posts-query';
import { Apollo } from 'apollo-angular';
import { Post } from '../post';
import { Component, OnInit } from '@angular/core';
import { query } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit{

  constructor(private apollo: Apollo, private route:ActivatedRoute, private router: Router) {}

  
  postForm:Post = {
    id: 0,
    title: '',
    views: 0
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      var id = Number(params.get('id'));
      this.getPostById(id)
    })
  }

  getPostById(id: number) {
    this.apollo.watchQuery<{allPosts: Post[]}>({
      query: Posts_ById,
      variables: {postFilter:{id}}
    })
    .valueChanges
    .subscribe(({data}) => {
      var postById = data.allPosts[0];
      this.postForm = {
        id: postById.id,
        title: postById.title,
        views: postById.id
      }
    })
  }

  update() {
    this.apollo.mutate<{updatePost:Post}>({
      mutation: UDPATE_Post,
      variables: {
        id: this.postForm.id,
        title: this.postForm.title,
        views: Number(this.postForm.views)
      },
      update: (store, {data}) => {
        if (data?.updatePost) {
          var allData = store.readQuery<{allPosts: Post[]}>({query: GET_Posts})
          if (allData && allData?.allPosts.length > 0) {
              var newData:Post[] = [...allData?.allPosts]
              newData = newData.filter ( _ => _.id !== data.updatePost.id)
              newData.unshift(data.updatePost);
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
