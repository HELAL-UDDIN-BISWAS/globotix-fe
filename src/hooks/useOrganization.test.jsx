import { renderHook, act } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import useOrganization from './useOrganization';
import { GET_ORG } from "@/graphql/queries/organization";
import {
  CREATE_ORGANIZATION,
  DELETE_ORG,
  UPDATE_ORG,
} from "@/graphql/mutation/organization";

// Mock the Apollo Client
jest.mock('@/lib/apolloClient', () => ({
  query: jest.fn(),
  mutate: jest.fn(),
}));

// Mock lodash
jest.mock('lodash', () => ({
  concat: jest.fn((arr, item) => [...arr, item]),
}));

describe('useOrganization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockOrgData = {
    data: {
      organizations: {
        data: [
          {
            id: '1',
            attributes: {
              name: 'Test Org',
              users: {
                data: [
                  {
                    attributes: {
                      username: 'testuser',
                      email: 'test@example.com',
                      mobileNumber: '1234567890',
                    },
                  },
                ],
              },
              logo: {
                data: {
                  id: 'logo1',
                  attributes: {
                    url: 'http://example.com/logo.png',
                  },
                },
              },
              buildings: {
                data: [{ id: 'b1' }, { id: 'b2' }],
              },
            },
          },
        ],
      },
    },
  };

  it('fetches and sets organization data', async () => {
    const mockQuery = jest.fn().mockResolvedValue(mockOrgData);
    require('@/lib/apolloClient').query.mockImplementation(mockQuery);

    const { result } = renderHook(() => useOrganization());

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    expect(mockQuery).toHaveBeenCalledWith(expect.objectContaining({
      query: GET_ORG,
      variables: { filters: { and: [] } },
    }));

    expect(result.current.data).toEqual([
      expect.objectContaining({
        id: '1',
        name: 'Test Org',
        contactPerson: 'testuser',
        email: 'test@example.com',
        mobileNumber: '1234567890',
        logoUrl: 'http://example.com/logo.png',
        logoId: 'logo1',
        total_building: 2,
      }),
    ]);
  });

//   it('fetches data with search and filters', async () => {
//     const mockQuery = jest.fn().mockResolvedValue(mockOrgData);
//     require('@/lib/apolloClient').query.mockImplementation(mockQuery);

//     const { result } = renderHook(() => useOrganization());

//     await act(async () => {
//       await result.current.fetchData('search', {
//         building: ['b1'],
//         contactPerson: ['person1'],
//         status: ['active'],
//       });
//     });

//     expect(mockQuery).toHaveBeenCalledWith(expect.objectContaining({
//       query: GET_ORG,
//       variables: {
//         filters: {
//           and: [
//             { buildings: { name: { containsi: 'search' } } },
//             { buildings: { id: { in: ['b1'] } } },
//             { buildings: { contactPerson: { in: ['person1'] } } },
//             { buildings: { status: { in: ['active'] } } },
//           ],
//         },
//       },
//     }));
//   });

  it('fetches single organization data', async () => {
    const mockQuery = jest.fn().mockResolvedValue(mockOrgData);
    require('@/lib/apolloClient').query.mockImplementation(mockQuery);

    const { result } = renderHook(() => useOrganization());

    await act(async () => {
      await result.current.fetchSingleOrgData('Test Org');
    });

    expect(mockQuery).toHaveBeenCalledWith(expect.objectContaining({
      query: GET_ORG,
      variables: {
        filters: {
          name: { containsi: 'Test Org' },
        },
      },
    }));

    expect(result.current.singleOrgData).toEqual(
      expect.objectContaining({
        id: '1',
        name: 'Test Org',
        contactPerson: 'testuser',
        email: 'test@example.com',
        mobileNumber: '1234567890',
        logoUrl: 'http://example.com/logo.png',
        logoId: 'logo1',
        total_building: 2,
        buildings: expect.arrayContaining([
          expect.objectContaining({ id: 'b1' }),
          expect.objectContaining({ id: 'b2' }),
        ]),
      })
    );
  });

  it('creates an organization', async () => {
    const mockMutate = jest.fn().mockResolvedValue({
      data: { createOrganization: { data: { id: 'new1' } } },
    });
    require('@/lib/apolloClient').mutate.mockImplementation(mockMutate);

    const { result } = renderHook(() => useOrganization());

    const response = await result.current.createOrg({ name: 'New Org' });

    expect(mockMutate).toHaveBeenCalledWith(expect.objectContaining({
      mutation: CREATE_ORGANIZATION,
      variables: { data: { name: 'New Org' } },
    }));

    expect(response).toEqual({ status: 200, orgId: 'new1' });
  });

  it('deletes an organization', async () => {
    const mockMutate = jest.fn().mockResolvedValue({
      data: { deleteOrganization: { data: { id: '1' } } },
    });
    require('@/lib/apolloClient').mutate.mockImplementation(mockMutate);

    const { result } = renderHook(() => useOrganization());

    const response = await result.current.deleteOrg('1');

    expect(mockMutate).toHaveBeenCalledWith(expect.objectContaining({
      mutation: DELETE_ORG,
      variables: { id: '1' },
    }));

    expect(response).toEqual({ status: 200 });
  });

  it('updates an organization', async () => {
    const mockMutate = jest.fn().mockResolvedValue({
      data: { updateOrganization: { data: { id: '1' } } },
    });
    require('@/lib/apolloClient').mutate.mockImplementation(mockMutate);

    const { result } = renderHook(() => useOrganization());

    const response = await result.current.updateOrg('1', { name: 'Updated Org' });

    expect(mockMutate).toHaveBeenCalledWith(expect.objectContaining({
      mutation: UPDATE_ORG,
      variables: { id: '1', data: { name: 'Updated Org' } },
    }));

    expect(response).toEqual({ status: 200 });
  });

  it('handles errors in createOrg', async () => {
    const mockError = new Error('Creation failed');
    const mockMutate = jest.fn().mockRejectedValue(mockError);
    require('@/lib/apolloClient').mutate.mockImplementation(mockMutate);

    const { result } = renderHook(() => useOrganization());

    const response = await result.current.createOrg({ name: 'New Org' });

    expect(response).toBe('Creation failed');
  });
});