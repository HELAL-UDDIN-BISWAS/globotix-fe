import { gql } from "@apollo/client";

export const CREATE_ZONE = gql`
  mutation createZone($data: ZoneInput!) {
    createZone(data: $data) {
      data {
        id
      }
    }
  }
`;

export const UPDATE_ZONE = gql`
  mutation updateZone($data: ZoneInput!, $id: ID!) {
    updateZone(data: $data, id: $id) {
      data {
        id
      }
    }
  }
`;

export const DELETE_ZONE = gql`
  mutation deleteZone($id: ID!) {
    deleteZone(id: $id) {
      data {
        id
      }
    }
  }
`;
