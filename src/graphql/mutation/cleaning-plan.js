import { gql } from "@apollo/client";

export const CREATE_CLEANING_PLAN_EDITOR = gql`
  mutation createCleaningPlanEditor($data: CleaningPlanEditorInput!) {
    createCleaningPlanEditor(data: $data) {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
`;

export const UPDATE_CLEANING_PLAN_EDITOR = gql`
  mutation updateCleaningPlanEditor($data: CleaningPlanEditorInput!, $id: ID!) {
    updateCleaningPlanEditor(data: $data, id: $id) {
      data {
        id
      }
    }
  }
`;

export const DELETE_CLEANING_PLAN_EDITOR = gql`
  mutation deleteCleaningPlanEditor($id: ID!) {
    deleteCleaningPlanEditor(id: $id) {
      data {
        id
      }
    }
  }
`;
