import { gql } from "@apollo/client";

export const UPDATE_LOCATION = gql`
  mutation updateOrg($id: ID!, $data: LocationInput!) {
    updateLocation(id: $id, data: $data) {
      data {
        id
      }
    }
  }
`;
