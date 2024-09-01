import { gql } from "@apollo/client";

export const GET_ALL_LOCATIONS = gql`
  query getLocation($filters: LocationFiltersInput) {
    locations(filters: $filters, pagination: { limit: -1 }) {
      data {
        id
        attributes {
          createdByUser {
            data {
              id
              attributes {
                username
              }
            }
          }
          modifiedByUser {
            data {
              id
              attributes {
                username
              }
            }
          }
          updatedAt
          name
          mapName
          mapMetadata
          reports {
            data {
              id
              attributes {
                location {
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
          schedule {
            data {
              id
              attributes {
                frequency
              }
            }
          }
          map {
            data {
              id
              attributes {
                url
                name
                caption
                width
                height
              }
            }
          }
          building {
            data {
              id
              attributes {
                name
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
          zones {
            data {
              id
              attributes {
                title
                position
                points
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_MAP_NAMES = gql`
  query getMapNames($filters: LocationFiltersInput) {
    locations(filters: $filters, pagination: { limit: -1 }) {
      data {
        id
        attributes {
          mapName
        }
      }
    }
  }
`;
