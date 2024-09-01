import { gql } from "@apollo/client";

export const UPDATE_USER = gql`
  mutation updateUser($id: ID!, $data: UsersPermissionsUserInput!) {
    updateUsersPermissionsUser(id: $id, data: $data) {
      data {
        id
        attributes {
          username
        }
      }
    }
  }
`;
