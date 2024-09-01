import { act } from '@testing-library/react';
import apolloClient from "@/lib/apolloClient";
import { GET_ALL_COUNTRY } from "@/graphql/queries/country";
import useCountry from './useCountry';

jest.mock("@/lib/apolloClient", () => ({
  query: jest.fn(),
}));

describe('useCountry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useCountry.setState({ isLoading: false, listCountry: [] });
  });

  it('should initialize with default values', () => {
    const store = useCountry.getState();
    expect(store.isLoading).toBe(false);
    expect(store.listCountry).toEqual([]);
  });

  describe('getAllCountry', () => {
    it('should fetch countries successfully', async () => {
      const mockData = {
        data: {
          countries: {
            data: [
              { id: '1', attributes: { name: 'USA' } },
              { id: '2', attributes: { name: 'Canada' } },
            ],
          },
        },
      };

      apolloClient.query.mockResolvedValueOnce(mockData);

      await act(async () => {
        await useCountry.getState().getAllCountry();
      });

      const store = useCountry.getState();
      expect(store.isLoading).toBe(false);
      expect(store.listCountry).toEqual([
        { id: '1', name: 'USA' },
        { id: '2', name: 'Canada' },
      ]);
      expect(apolloClient.query).toHaveBeenCalledWith({
        query: GET_ALL_COUNTRY,
        fetchPolicy: "network-only",
      });
    });

    it('should handle empty response', async () => {
      const mockData = {
        data: {
          countries: {
            data: [],
          },
        },
      };

      apolloClient.query.mockResolvedValueOnce(mockData);

      await act(async () => {
        await useCountry.getState().getAllCountry();
      });

      const store = useCountry.getState();
      expect(store.isLoading).toBe(false);
      expect(store.listCountry).toEqual([]);
    });

    it('should handle error', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      const mockError = new Error('API error');

      apolloClient.query.mockRejectedValueOnce(mockError);

      await act(async () => {
        await useCountry.getState().getAllCountry();
      });

      const store = useCountry.getState();
      expect(store.isLoading).toBe(false);
      expect(store.listCountry).toEqual([]);
      expect(consoleLogSpy).toHaveBeenCalledWith('error', mockError);

      consoleLogSpy.mockRestore();
    });
  });
});