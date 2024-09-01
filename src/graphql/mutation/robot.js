import { gql } from "@apollo/client";

export const CREATE_ROBOT = gql`
  mutation createRobot($data: RobotInput!) {
    createRobot(data: $data) {
      data {
        id
      }
    }
  }
`;

export const UPDATE_ROBOT = gql`
  mutation updateRobot($id: ID!, $data: RobotInput!) {
    updateRobot(id: $id, data: $data) {
      data {
        id
      }
    }
  }
`;

export const DELETE_ROBOT = gql`
  mutation deleteRobot($id: ID!) {
    deleteRobot(id: $id) {
      data {
        id
      }
    }
  }
`;
