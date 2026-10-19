import gql from "graphql-tag";
export const GET_ALL_TAGS = gql`
query GetTagsWithCount($first: Int = 100) {
  tags(first: $first) {
    nodes {
      id
      name
      count
      slug
      link
    }
  }
}`;
