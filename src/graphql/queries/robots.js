import { gql } from "@apollo/client";

export const GET_ROBOTS = gql`
  query getRobots($filters: RobotFiltersInput) {
    robots(filters: $filters, pagination: { limit: 1000 }) {
      data {
        id
        attributes {
          baseName
          displayName
          chargingTime
          serialNumber
          batteryPercentage
          workingStatus
          status
          chargingTime
          deployedTime
          firmwareVersion
          gutterBrushUsage
          license
          statusLevel
          wireguardIp
          zonePosition
          addedByUser {
            data {
              id
              attributes {
                username
              }
            }
          }
          building {
            data {
              id
              attributes {
                name
                locations {
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
          locations {
            data {
              id
              attributes {
                name
              }
            }
          }
          cleaningPlanEditors {
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

export const GET_ROBOT_BY_ID = gql`
  query ($id: ID!) {
    robot(id: $id) {
      data {
        id
        attributes {
          displayName
          baseName
          serialNumber
          wireguardIp
          license
          firmwareVersion
          workingStatus
          status
          statusLevel
          batteryPercentage
          gutterBrushUsage
          chargingTime
          deployedTime
          building {
            data {
              id
              attributes {
                name
              }
            }
          }
          locations {
            data {
              id
              attributes {
                name
                mapName
                mapMetadata
                zones {
                  data {
                    id
                    attributes {
                      title
                      type
                      repetition
                      order
                      trueCleanableArea
                      trueCleanedArea
                      points
                      zoneDurationInfo
                      metadata
                      position
                      name
                      coordinates
                      boustrophedonPath
                      voronoiPath
                    }
                  }
                }
                homes {
                  data {
                    id
                    attributes {
                      name
                      pose
                    }
                  }
                }
                map {
                  data {
                    id
                    attributes {
                      name
                      url
                      width
                      height
                      caption
                    }
                  }
                }
                mapProhibited {
                  data {
                    id
                    attributes {
                      name
                      url
                    }
                  }
                }
              }
            }
          }
          cleaningPlanEditors {
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
                schedules {
                  data {
                    id
                    attributes {
                      name
                      cleaningDate
                      cleaningTime
                      frequency
                      cleaningPlanEditor {
                        data {
                          id
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          addedByUser {
            data {
              id
            }
          }
        }
      }
    }
  }
`;

export const GET_ALL_ROBOTS = gql`
  query getAllRobots {
    robots {
      data {
        id
        attributes {
          displayName
        }
      }
    }
  }
`;

export const GET_ROBOT_DATA = gql`
  query getRobotData($filters: RobotFiltersInput) {
    robots(filters: $filters, pagination: { limit: 1000 }) {
      data {
        id
        attributes {
          displayName
          chargingTime
          batteryPercentage
          workingStatus
          status
          building {
            data {
              id
              attributes {
                name
                locations {
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
      }
    }
  }
`;
