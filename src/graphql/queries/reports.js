import { gql } from "@apollo/client";

export const GET_ALL_REPORTS = gql`
  query reports(
    $filters: ReportFiltersInput
    $limit: Int
    $page: Int
    $pageSize: Int
    $sort: [String]
  ) {
    reports(
      filters: $filters
      pagination: { limit: $limit, page: $page, pageSize: $pageSize }
      sort: $sort
    ) {
      data {
        id
        attributes {
          cleanedArea
          cleaningStatus
          cleaningZonesArea
          createdAt
          updatedAt
          cleaningZonePercentage
          coveragePercentage
          batteryUsage
          moduleType
          cleaningDuration
          startEpochTime
          endEpochTime
          startIso8601Time
          endIso8601Time
          totalIdleTime
          totalArea
          cleanableArea
          missedCleaningArea
          version
          noCleanZones {
            data {
              id
            }
          }
          completeImage {
            data {
              id
              attributes {
                url
              }
            }
          }
          cleaningZones
          location {
            data {
              id
              attributes {
                name
                building {
                  data {
                    attributes {
                      name
                    }
                  }
                }
              }
            }
          }
          robot {
            data {
              id
              attributes {
                displayName
                baseName
              }
            }
          }
          operatorName
          gutterTimeUsage
          rollerTimeUsage
          prefilterTimeUsage
          hepafilterTimeUsage
          gutterLifespanRemaining
          rollerLifespanRemaining
          prefilterLifespanRemaining
          hepafilterLifespanRemaining
          building{
            data{
              id
            }
          }
        }
      }
      meta {
        pagination {
          page
          pageCount
          pageSize
        }
      }
    }
  }
`;
