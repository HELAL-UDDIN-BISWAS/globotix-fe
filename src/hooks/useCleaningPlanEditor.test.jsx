import { renderHook, act } from '@testing-library/react';
import useCleaningPlan from './useCleaningPlan';
import apolloClient from "@/lib/apolloClient";
import { GET_CLEANING_PLANS } from "@/graphql/queries/cleaningPlan";

jest.mock("@/lib/apolloClient", () => ({
  query: jest.fn(),
}));

describe('useCleaningPlan', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with undefined data', () => {
    const { result } = renderHook(() => useCleaningPlan());
    expect(result.current.data).toBeUndefined();
  });

  it('should fetch data with a single locationId', async () => {
    const mockData = {
      data: {
        cleaningPlanEditors: {
          data: [{ id: '1', attributes: { name: 'Plan 1' } }]
        }
      }
    };
    apolloClient.query.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useCleaningPlan());

    await act(async () => {
      result.current.fetchData('location1');
      jest.runAllTimers();
      await Promise.resolve();
    });

    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_CLEANING_PLANS,
      fetchPolicy: "network-only",
      variables: {
        filters: {
          location: {
            id: { eqi: 'location1' }
          }
        }
      }
    });

    expect(result.current.data).toEqual(mockData.data.cleaningPlanEditors.data);
  });

  it('should fetch data with multiple locationIds', async () => {
    const mockData = {
      data: {
        cleaningPlanEditors: {
          data: [
            { id: '1', attributes: { name: 'Plan 1' } },
            { id: '2', attributes: { name: 'Plan 2' } }
          ]
        }
      }
    };
    apolloClient.query.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useCleaningPlan());

    await act(async () => {
      result.current.fetchData(['location1', 'location2']);
      jest.runAllTimers();
      await Promise.resolve();
    });

    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_CLEANING_PLANS,
      fetchPolicy: "network-only",
      variables: {
        filters: {
          location: {
            id: { and: ['location1', 'location2'] }
          }
        }
      }
    });

    expect(result.current.data).toEqual(mockData.data.cleaningPlanEditors.data);
  });

  it('should handle errors when fetching data', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    apolloClient.query.mockRejectedValueOnce(new Error('Fetch error'));

    const { result } = renderHook(() => useCleaningPlan());

    await act(async () => {
      jest.runAllTimers();
      await Promise.resolve();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(new Error('Fetch error'));
    expect(result.current.data).toBeUndefined();

    consoleErrorSpy.mockRestore();
  });
});