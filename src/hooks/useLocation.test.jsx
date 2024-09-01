import { renderHook, act } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import useLocation from './useLocation';
import { GET_ALL_LOCATIONS, GET_MAP_NAMES } from '@/graphql/queries/locations';
import { UPDATE_LOCATION } from '@/graphql/mutation/location';

// Mock the Apollo Client
jest.mock('@/lib/apolloClient', () => ({
  query: jest.fn(),
  mutate: jest.fn(),
}));

const mockLocationsData = {
  data: {
    locations: {
      data: [
        {
          id: '1',
          attributes: {
            name: 'Location 1',
            updatedAt: '2024-08-28T12:00:00Z',
            createdByUser: { data: { attributes: { username: 'user1' } } },
            modifiedByUser: { data: { attributes: { username: 'user2' } } },
            building: { data: { id: 'b1', attributes: { name: 'Building 1', users: { data: [] } } } },
            mapName: 'Map 1',
            map: { data: { id: 'm1', attributes: { name: 'Map 1', url: 'url1', width: 100, height: 100 } } },
            mapMetadata: '{}',
            zones: { data: [] },
          },
        },
      ],
    },
  },
};

const mockMapNamesData = {
  data: {
    locations: {
      data: [
        { attributes: { mapName: 'Map 1' } },
        { attributes: { mapName: 'Map 2' } },
      ],
    },
  },
};

describe('useLocation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and sets location data', async () => {
    const mockQuery = jest.fn().mockResolvedValue(mockLocationsData);
    require('@/lib/apolloClient').query.mockImplementation(mockQuery);

    const { result } = renderHook(() => useLocation());

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    expect(mockQuery).toHaveBeenCalledWith(expect.objectContaining({
      query: GET_ALL_LOCATIONS,
      variables: { filters: { and: [] } },
    }));

    expect(result.current.data).toEqual([
      expect.objectContaining({
        id: '1',
        name: 'Location 1',
        building: expect.objectContaining({ id: 'b1', name: 'Building 1' }),
        mapName: 'Map 1',
      }),
    ]);
  });

  it('fetches and sets map names', async () => {
    const mockQuery = jest.fn().mockResolvedValue(mockMapNamesData);
    require('@/lib/apolloClient').query.mockImplementation(mockQuery);

    const { result } = renderHook(() => useLocation());

    await waitFor(() => {
      expect(result.current.mapNames).toBeDefined();
    });

    expect(mockQuery).toHaveBeenCalledWith(expect.objectContaining({
      query: GET_MAP_NAMES,
      variables: { filters: { mapName: { containsi: '' } } },
    }));

    expect(result.current.mapNames).toEqual(['Map 1', 'Map 2']);
  });

  it('updates location', async () => {
    const mockMutate = jest.fn().mockResolvedValue({
      data: { updateLocation: { data: { id: '1' } } },
    });
    require('@/lib/apolloClient').mutate.mockImplementation(mockMutate);

    const { result } = renderHook(() => useLocation());

    let response;
    await act(async () => {
      response = await result.current.updateLocation('1', { name: 'Updated Location' });
    });

    expect(response).toEqual({ status: 200 });
    expect(mockMutate).toHaveBeenCalledWith(expect.objectContaining({
      mutation: UPDATE_LOCATION,
      variables: { id: '1', data: { name: 'Updated Location' } },
    }));
  });

  it('fetches data with search and filters', async () => {
    const mockQuery = jest.fn().mockResolvedValue(mockLocationsData);
    require('@/lib/apolloClient').query.mockImplementation(mockQuery);

    const { result } = renderHook(() => useLocation());

    await act(async () => {
      await result.current.fetchData('search', { building: ['b1'], map: ['Map 1'] }, 'buildingId');
    });

    expect(mockQuery).toHaveBeenCalledWith(expect.objectContaining({
      query: GET_ALL_LOCATIONS,
      variables: {
        filters: {
          and: [
            { name: { containsi: 'search' } },
            { building: { id: { in: ['b1'] } } },
            { mapName: { in: ['Map 1'] } },
            { building: { id: { eq: 'buildingId' } } },
          ],
        },
      },
    }));
  });

  it('handles error in updateLocation', async () => {
    const mockError = new Error('Update failed');
    const mockMutate = jest.fn().mockRejectedValue(mockError);
    require('@/lib/apolloClient').mutate.mockImplementation(mockMutate);

    const { result } = renderHook(() => useLocation());

    let response;
    await act(async () => {
      response = await result.current.updateLocation('1', { name: 'Updated Location' });
    });

    expect(response).toBe('Update failed');
  });
});