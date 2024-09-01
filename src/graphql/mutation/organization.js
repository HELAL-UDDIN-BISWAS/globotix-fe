import { gql } from "@apollo/client";

export const CREATE_ORGANIZATION = gql`
  mutation createOrg($data: OrganizationInput!) {
    createOrganization(data: $data) {
      data {
        id
      }
    }
  }
`;

export const DELETE_ORG = gql`
  mutation deleteOrg($id: ID!) {
    deleteOrganization(id: $id) {
      data {
        id
      }
    }
  }
`;

export const UPDATE_ORG = gql`
  mutation updateOrg($id: ID!, $data: OrganizationInput!) {
    updateOrganization(id: $id, data: $data) {
      data {
        id
      }
    }
  }
`;
