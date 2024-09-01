import { gql } from "@apollo/client";

export const UPDATE_CONFIGURATION = gql`
  mutation Configuration($data: ConfigurationInput!) {
    updateConfiguration(data: $data) {
      data {
        id
        attributes {
          max_login_attempts
          locked_out_time_in_minutes
        }
      }
    }
  }
`;
