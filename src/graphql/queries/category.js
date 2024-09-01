import { gql } from "@apollo/client";

export const GET_ALL_CATEGORY = gql`
  query getCategory {
    categories {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
`;
