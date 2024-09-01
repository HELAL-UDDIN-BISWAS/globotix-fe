import { gql } from "@apollo/client";

export const GET_BUILDINGS = gql`
  query getBuilding($filters: BuildingFiltersInput) {
    buildings(filters: $filters, pagination: { limit: 1000 }) {
      data {
        id
        attributes {
          name
          email
          address
          contactPerson
          mobileNumber
          mobileNumberCode
          category {
            data {
              id
              attributes {
                name
              }
            }
          }
          status
          organization {
            data {
              id
              attributes {
                name
                logo {
                  data {
                    id
                    attributes {
                      url
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

export const GET_BUILDING_BY_ID = gql`
  query getBuilding($id: ID) {
    building(id: $id) {
      data {
        id
        attributes {
          name
          address
          country {
            data {
              id
              attributes {
                name
              }
            }
          }
          postalCode
          status
          category {
            data {
              id
              attributes {
                name
              }
            }
          }
          contactPerson
          email
          assignedRobots {
            data {
              id
              attributes {
                displayName
              }
            }
          }
          mobileNumber
          mobileNumberCode
          organization {
            data {
              id
              attributes {
                name
                logo {
                  data {
                    id
                    attributes {
                      url
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
export const GET_ALL_CONTACT_PERSON = gql`
  query getContactPerson($filters: BuildingFiltersInput) {
    buildings(filters: $filters, pagination: { limit: 1000 }) {
      data {
        id
        attributes {
          contactPerson
        }
      }
    }
  }
`;
