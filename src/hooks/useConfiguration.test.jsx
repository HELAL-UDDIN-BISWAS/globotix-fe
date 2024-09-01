import { act } from '@testing-library/react';
import useConfiguration from './useConfiguration';
import apolloClient from "@/lib/apolloClient";
import { GET_CONFIGURATION } from "@/graphql/queries/configuration";
import { UPDATE_CONFIGURATION } from "@/graphql/mutation/configuration";

jest.mock("@/lib/apolloClient", () => ({
  query: jest.fn(),
  mutate: jest.fn(),
}));

describe('useConfiguration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useConfiguration.setState({ isLoading: false, listConfiguration: null });
  });

  it('should initialize with default values', () => {
    const state = useConfiguration.getState();
    expect(state.isLoading).toBe(false);
    expect(state.listConfiguration).toBeNull();
  });

  describe('getConfiguration', () => {
    it('should fetch configuration successfully', async () => {
      const mockData = {
        data: {
          configuration: {
            data: { id: '1', attributes: { name: 'Test Config' } }
          }
        }
      };
      apolloClient.query.mockResolvedValueOnce(mockData);

      await act(async () => {
        await useConfiguration.getState().getConfiguration();
      });

      expect(apolloClient.query).toHaveBeenCalledWith({
        query: GET_CONFIGURATION,
        fetchPolicy: "network-only",
      });

      const state = useConfiguration.getState();
      expect(state.listConfiguration).toEqual(mockData.data.configuration.data);
      expect(state.isLoading).toBe(false);
    });

    it('should handle errors when fetching configuration', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      apolloClient.query.mockRejectedValueOnce(new Error('Fetch error'));

      await act(async () => {
        await useConfiguration.getState().getConfiguration();
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching configuration:', new Error('Fetch error'));
      
      const state = useConfiguration.getState();
      expect(state.listConfiguration).toBeNull();
      expect(state.isLoading).toBe(false);

      consoleErrorSpy.mockRestore();
    });
  });

  describe('updateConfiguration', () => {
    it('should update configuration successfully', async () => {
      const mockData = {
        data: {
          updateConfiguration: {
            data: { id: '1', attributes: { name: 'Updated Config' } }
          }
        }
      };
      apolloClient.mutate.mockResolvedValueOnce(mockData);

      const updateData = { name: 'Updated Config' };

      await act(async () => {
        await useConfiguration.getState().updateConfiguration(updateData);
      });

      expect(apolloClient.mutate).toHaveBeenCalledWith({
        mutation: UPDATE_CONFIGURATION,
        variables: { data: updateData },
      });

      const state = useConfiguration.getState();
      expect(state.listConfiguration).toEqual(mockData.data.updateConfiguration.data);
      expect(state.isLoading).toBe(false);
    });

    it('should handle errors when updating configuration', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      apolloClient.mutate.mockRejectedValueOnce(new Error('Update error'));

      const updateData = { name: 'Updated Config' };

      await act(async () => {
        await useConfiguration.getState().updateConfiguration(updateData);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error updating configuration:', new Error('Update error'));
      
      const state = useConfiguration.getState();
      expect(state.isLoading).toBe(false);

      consoleErrorSpy.mockRestore();
    });
  });
});