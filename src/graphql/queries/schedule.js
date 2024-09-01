import { gql } from "@apollo/client";

export const GET_SCHEDULES = gql`
  query getScheduleById($filters: ScheduleFiltersInput) {
    schedules(filters: $filters) {
      data {
        id
        attributes {
          name
          cleaningDate
          cleaningTime
          repeatUntil
          frequency
          scheduleType
          daysOfWeek
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
                location {
                  data {
                    id
                    attributes {
                      name
                    }
                  }
                }
                CleanZones {
                  zone {
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
          zones {
            data {
              id
              attributes {
                position
                title
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_SCHEDULE_BY_ID = gql`
  query getScheduleById($id: ID!) {
    schedule(id: $id) {
      data {
        id
        attributes {
          name
          cleaningDate
          cleaningTime
          repeatUntil
          frequency
          scheduleType
          daysOfWeek
          location {
            data {
              id
              attributes {
                name
              }
            }
          }
          zones {
            data {
              id
              attributes {
                title
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
