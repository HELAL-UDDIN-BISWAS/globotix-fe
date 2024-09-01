import { gql } from "@apollo/client";

export const GET_ORG = gql`
  query getOrg($filters: OrganizationFiltersInput) {
    organizations(filters: $filters, pagination: { limit: 1000 }) {
      data {
        id
        attributes {
          name
          users {
            data {
              id
              attributes {
                username
                email
                mobileNumber
              }
            }
          }
          logo {
            data {
              id
              attributes {
                url
              }
            }
          }

          buildings {
            data {
              id
              attributes {
                name
                assignedRobots {
                  data {
                    id
                    attributes {
                      serialNumber
                    }
                  }
                }
                users {
                  data {
                    id
                    attributes {
                      username
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
