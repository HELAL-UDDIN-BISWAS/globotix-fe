import { gql } from "@apollo/client";

export const GET_CONFIGURATION = gql`
  query getConfigure {
    configuration {
      data {
        id
        attributes {
          max_login_attempts
          locked_out_time_in_minutes
          updatedAt
        }
      }
    }
  }
`;
