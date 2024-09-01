import { gql } from "@apollo/client";

export const GET_CLEANING_PLANS = gql`
  query getCleaningPlans($filters: CleaningPlanEditorFiltersInput) {
    cleaningPlanEditors(filters: $filters) {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
`;

export const GET_PLANS = gql`
  query getCleaningPlan(
    $filter: CleaningPlanEditorFiltersInput
    $page: Int
    $pageSize: Int
  ) {
    cleaningPlanEditors(
      filters: $filter
      pagination: { page: $page, pageSize: $pageSize }
      sort: "updatedAt:desc"
    ) {
      data {
        id
        attributes {
          name
          location {
            data {
              id
              attributes {
                name
              }
            }
          }
          updatedAt
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
          CleanZones {
            id
            zone {
              data {
                id
                attributes {
                  title
                }
              }
            }
          }
          building {
            data {
              id
              attributes {
                name
              }
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

export const GET_PLAN_By_ID = gql`
  query getCleaningPlan($id: ID) {
    cleaningPlanEditor(id: $id) {
      data {
        id
        attributes {
          name
          updatedAt
          location {
            data {
              id
              attributes {
                name
              }
            }
          }
          robots {
            data {
              id
              attributes {
                baseName
                displayName
              }
            }
          }
          CleanZones {
            id
            zone {
              data {
                id
                attributes {
                  title
                  points
                  position
                }
              }
            }
            vacuum
            roller
            gutter
            repeat
            color
          }
          BlockZones {
            id
            zone {
              data {
                id
                attributes {
                  title
                  points
                  position
                }
              }
            }
          }
          building {
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
