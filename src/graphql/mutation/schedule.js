import { gql } from "@apollo/client";

export const CREATE_SCHEDULE = gql`
  mutation createSchedule($data: ScheduleInput!) {
    createSchedule(data: $data) {
      data {
        id
      }
    }
  }
`;

export const UPDATE_SCHEDULE = gql`
  mutation updateSchedule($id: ID!, $data: ScheduleInput!) {
    updateSchedule(id: $id, data: $data) {
      data {
        id
      }
    }
  }
`;

export const DELETE_SCHEDULE = gql`
  mutation deleteSchedule($id: ID!) {
    deleteSchedule(id: $id) {
      data {
        id
      }
    }
  }
`;
