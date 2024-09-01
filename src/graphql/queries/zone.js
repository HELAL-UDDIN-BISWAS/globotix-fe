import { gql } from "@apollo/client";

export const GET_ZONES = gql`
  query getZones($filters: ZoneFiltersInput) {
    zones(filters: $filters) {
      data {
        id
        attributes {
          name
          type
          cleaningPresets
          order
          repetition
          trueCleanedArea
          trueCleanableArea
          trueCleaningPercentage
          coordinates
          zoneDurationInfo
          cleaningReport {
            data {
              id
            }
          }
          skippedReport {
            data {
              id
            }
          }
          prohibitedReport {
            data {
              id
            }
          }
          noCleanReport {
            data {
              id
            }
          }
          metadata
          schedules {
            data {
              id
              attributes {
                name
              }
            }
          }
          location {
            data {
              id
              attributes {
                name
              }
            }
          }
          cleaningPlanEditor {
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

export const GET_ZONE_BY_LOCATION = gql`
  query getZone($locationID: ID) {
    zones(
      filters: { location: { id: { eq: $locationID } } }
      pagination: { pageSize: 1000 }
    ) {
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
`;
