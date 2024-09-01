import { gql } from "@apollo/client";

export const GET_ACtiviy_Logs = gql`
query getActivityLogs {
  activityLogs (pagination: { limit:1000}){
      data {
        id
        attributes {
          organization{
            data{
              id
              attributes{
                name
                buildings{
                  data{
                    id
                    attributes{
                      name
                    }
                  }
                }
              }
            }
          }
          activity
          createdOn
        robot{
          data{
            id
            attributes{
              baseName
            }
          }
        }
        }
      }
    meta{
      pagination{
        total
      }
    }
    }
  }
`;
