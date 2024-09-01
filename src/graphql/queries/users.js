import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query getUsers($filters: UsersPermissionsUserFiltersInput) {
    usersPermissionsUsers(filters: $filters, pagination: { limit: 1000 }) {
      data {
        id
        attributes {
          username
          organization {
            data {
              id
              attributes {
                name
              }
            }
          }
          role {
            data {
              id
              attributes {
                name
              }
            }
          }
          status
          buildings {
            data {
              id
              attributes {
                name
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query getUser($id: ID!) {
    usersPermissionsUser(id: $id) {
      data {
        id
        attributes {
          username
          mobileNumber
          mobileNumberCode
          email
          organization {
            data {
              id
              attributes {
                name
              }
            }
          }
          role {
            data {
              id
              attributes {
                name
              }
            }
          }
          status
          buildings {
            data {
              id
              attributes {
                name
              }
            }
          }
        }
      }
    }
  }
`;
