import { renderHook, act } from '@testing-library/react';
import useAccount from './useAccount';
import apolloClient from '@/lib/apolloClient';
import { GET_USERS } from "@/graphql/queries/users";

jest.mock('@/lib/apolloClient', () => ({
  query: jest.fn(),
}));

// Helper function to wait for a short time
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('useAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch data on initial render', async () => {
    const mockData = {
      data: {
        usersPermissionsUsers: {
          data: [{ id: '1', username: 'testuser' }],
        },
      },
    };

    apolloClient.query.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useAccount());

    expect(result.current.data).toBe(null);

    await act(async () => {
      await wait(100); // Wait for a short time to allow for state updates
    });

    expect(apolloClient.query).toHaveBeenCalledTimes(1);
    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_USERS,
      fetchPolicy: 'network-only',
      variables: {
        filters: { and: [] },
      },
    });
    expect(result.current.data).toEqual(mockData.data.usersPermissionsUsers.data);
  });

  it('should fetch data with filters', async () => {
    const mockData = {
      data: {
        usersPermissionsUsers: {
          data: [{ id: '1', username: 'filtereduser' }],
        },
      },
    };

    apolloClient.query.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useAccount());

    await act(async () => {
      result.current.fetchData({
        search: 'test',
        building: ['1', '2'],
        organization: ['3'],
        status: ['Active'],
        accessLevel: ['Admin'],
      });
      await wait(100);
    });

    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_USERS,
      fetchPolicy: 'network-only',
      variables: {
        filters: {
          and: [
            { username: { containsi: 'test' } },
            { buildings: { id: { in: ['1', '2'] } } },
            { organization: { id: { in: ['3'] } } },
            { status: { in: ['active'] } },
            { role: { name: { in: ['admin'] } } },
          ],
        },
      },
    });

    expect(result.current.data).toEqual(mockData.data.usersPermissionsUsers.data);
  });

  it('should handle empty filter arrays', async () => {
    const mockData = {
      data: {
        usersPermissionsUsers: {
          data: [{ id: '1', username: 'user' }],
        },
      },
    };

    apolloClient.query.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useAccount());

    await act(async () => {
      result.current.fetchData({
        building: [],
        organization: [],
        status: [],
        accessLevel: [],
      });
      await wait(100);
    });

    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_USERS,
      fetchPolicy: 'network-only',
      variables: {
        filters: { and: [] },
      },
    });

    expect(result.current.data).toEqual(mockData.data.usersPermissionsUsers.data);
  });

  it('should handle errors', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    apolloClient.query.mockRejectedValueOnce(new Error('API error'));

    const { result } = renderHook(() => useAccount());

    await act(async () => {
      await wait(100);
    });

    expect(apolloClient.query).toHaveBeenCalledTimes(1);
    expect(result.current.data).toBe(null);
    expect(consoleErrorSpy).toHaveBeenCalledWith(new Error('API error'));

    consoleErrorSpy.mockRestore();
  });
});