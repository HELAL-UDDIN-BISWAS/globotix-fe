import { act } from '@testing-library/react';
import useActivityLog from './useActivityLog';
import apolloClient from "@/lib/apolloClient";
import { GET_ACtiviy_Logs } from "@/graphql/queries/activitylog";

jest.mock("@/lib/apolloClient", () => ({
  query: jest.fn(),
}));

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('useActivityLog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useActivityLog.setState({ loading: false, allActivityLog: null });
  });

  it('should initialize with default values', () => {
    const store = useActivityLog.getState();
    expect(store.loading).toBe(false);
    expect(store.allActivityLog).toBe(null);
  });

  it('should fetch activity logs successfully', async () => {
    const mockData = {
      data: {
        activityLogs: {
          data: [
            { id: '1', action: 'login' },
            { id: '2', action: 'logout' },
          ],
        },
      },
    };

    apolloClient.query.mockResolvedValueOnce(mockData);

    await act(async () => {
      useActivityLog.getState().getActivityLogs();
      await wait(100);
    });

    const store = useActivityLog.getState();
    expect(store.loading).toBe(false);
    expect(store.allActivityLog).toEqual(mockData.data.activityLogs.data);
    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_ACtiviy_Logs,
      fetchPolicy: "network-only",
    });
  });

  it('should handle errors when fetching activity logs', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('API error');

    apolloClient.query.mockRejectedValueOnce(error);

    await act(async () => {
      useActivityLog.getState().getActivityLogs();
      await wait(100);
    });

    const store = useActivityLog.getState();
    expect(store.loading).toBe(false);
    expect(store.allActivityLog).toBe(null);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching activityLogs:", error);

    consoleErrorSpy.mockRestore();
  });

  it('should set loading state correctly', async () => {
    const mockData = {
      data: {
        activityLogs: {
          data: [{ id: '1', action: 'login' }],
        },
      },
    };

    apolloClient.query.mockResolvedValueOnce(mockData);

    let store = useActivityLog.getState();
    expect(store.loading).toBe(false);

    await act(async () => {
      useActivityLog.getState().getActivityLogs();
      store = useActivityLog.getState();
      expect(store.loading).toBe(true);

      await wait(100);
    });

    store = useActivityLog.getState();
    expect(store.loading).toBe(false);
    expect(store.allActivityLog).toEqual(mockData.data.activityLogs.data);
  });
});