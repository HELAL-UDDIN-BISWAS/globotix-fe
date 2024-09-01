import { gql } from "@apollo/client";

export const GET_ROLES = gql`
  query getRoles {
    usersPermissionsRoles(
      filters: { name: { notIn: ["Public", "Authenticated"] } }
    ) {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
`;
