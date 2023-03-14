import { gql } from 'apollo-angular';
export const CREATE_Post = gql`
mutation($title: String!, $views: Int!) {
  createPost (title: $title, views: $views) {
    title,
    views
  }
}
`;


export const UDPATE_Post = gql`
mutation($id: ID!, $title: String, $views: Int!) {
  updatePost(id: $id, title: $title, views: $views) {
    id,
    title,
    views
  }
}
`;

export const DELETE_Post = gql`
mutation ($id: ID!){
  removePost(id: $id){
    id
  }
}
`;