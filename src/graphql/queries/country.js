import { gql } from "@apollo/client";

export const GET_ALL_COUNTRY = gql`
  query getAllCountry {
    countries {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
`;
