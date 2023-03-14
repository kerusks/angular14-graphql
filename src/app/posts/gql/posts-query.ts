import { gql } from "apollo-angular";

export const GET_Posts = gql`
query {
    allPosts {
      id,
      title,
      views,
    }
  }`;


export const Posts_ById = gql`
query ($postFilter: PostFilter) {
 	allPosts(filter: $postFilter) {
    id,
    title,
    views
  }
}
`;