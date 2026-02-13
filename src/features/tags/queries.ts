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

export const GET_TAG_BY_ID = gql`
  query GetTag($id: ID!) {
    tag(id: $id) {
      id
      name
      slug
      link
      count
    }
  }
`;
