import { gql } from "@apollo/client";

export const UPDATE_BUILDING = gql`
  mutation updateBuilding($id: ID!, $data: BuildingInput!) {
    updateBuilding(data: $data, id: $id) {
      data {
        id
      }
    }
  }
`;

export const CREATE_BUILDING = gql`
  mutation createBuilding($data: BuildingInput!) {
    createBuilding(data: $data) {
      data {
        id
      }
    }
  }
`;
