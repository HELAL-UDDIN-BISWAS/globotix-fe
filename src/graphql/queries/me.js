import { gql } from "@apollo/client";

export const GET_ME = gql`
  query getMe {
    me {
      id
      email
      username
      confirmed
      blocked
    }
  }
`;
