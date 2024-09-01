// import React from 'react';
// import { renderHook, act } from '@testing-library/react';
// import { MockedProvider } from '@apollo/client/testing';
// import useBuilding from './useBuilding';
// import {
//   GET_BUILDINGS,
//   GET_BUILDING_BY_ID,
//   GET_ALL_CONTACT_PERSON
// } from '@/graphql/queries/buildings';
// import { CREATE_BUILDING, UPDATE_BUILDING } from '@/graphql/mutation/building';

// // Mock the Apollo Client
// jest.mock('@/lib/apolloClient', () => ({
//   query: jest.fn(),
//   mutate: jest.fn(),
// }));

// // Helper function to wait for a short time
// const wait = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

// // Define the mock data
// const mockBuildingsData = {
//   data: {
//     buildings: [
//       {
//         id: '1',
//         name: 'Building 1',
//         status: 'Active',
//       }
//     ]
//   }
// };

// const mockSingleBuildingData = {
//   data: {
//     building: {
//       id: '1',
//       name: 'Building 1',
//       status: 'Active',
//     }
//   }
// };

// const mockContactPersonData = {
//   data: {
//     contactPersons: [
//       {
//         id: '1',
//         name: 'John Doe'
//       },
//       {
//         id: '2',
//         name: 'Jane Smith'
//       }
//     ]
//   }
// };

// describe('useBuilding', () => {
//   it('should fetch and set buildings data', async () => {
//     const mocks = [
//       {
//         request: {
//           query: GET_BUILDINGS,
//           variables: { filters: { and: [] } }
//         },
//         result: mockBuildingsData
//       }
//     ];

//     const wrapper = ({ children }) => (
//       <MockedProvider mocks={mocks} addTypename={false}>
//         {children}
//       </MockedProvider>
//     );

//     const { result } = renderHook(() => useBuilding(), { wrapper });

//     // Trigger the fetch
//     act(() => {
//       result.current.fetchData();
//     });

//     // Wait for the async operation to complete
//     await act(async () => {
//       await wait(0);
//     });

//     expect(result.current.data).toHaveLength(1);
//     expect(result.current.data[0].name).toBe('Building 1');
//   });

//   it('should fetch single building data', async () => {
//     const mocks = [
//       {
//         request: {
//           query: GET_BUILDING_BY_ID,
//           variables: { id: '1' }
//         },
//         result: mockSingleBuildingData
//       }
//     ];

//     const wrapper = ({ children }) => (
//       <MockedProvider mocks={mocks} addTypename={false}>
//         {children}
//       </MockedProvider>
//     );

//     const { result } = renderHook(() => useBuilding(), { wrapper });

//     act(() => {
//       result.current.fetchSingleData('1');
//     });

//     // Wait for the async operation to complete
//     await act(async () => {
//       await wait(0);
//     });

//     expect(result.current.singleData.name).toBe('Building 1');
//     expect(result.current.singleData.status).toBe('Active');
//   });

//   it('should update building', async () => {
//     const updateMock = jest.fn().mockResolvedValue({
//       data: {
//         updateBuilding: {
//           data: { id: '1' }
//         }
//       }
//     });

//     const mocks = [
//       {
//         request: {
//           query: UPDATE_BUILDING,
//           variables: { id: '1', data: { name: 'Updated Building' } }
//         },
//         result: updateMock
//       }
//     ];

//     const wrapper = ({ children }) => (
//       <MockedProvider mocks={mocks} addTypename={false}>
//         {children}
//       </MockedProvider>
//     );

//     const { result } = renderHook(() => useBuilding(), { wrapper });

//     let updateResult;
//     await act(async () => {
//       updateResult = await result.current.updateBuilding('1', { name: 'Updated Building' });
//     });

//     expect(updateResult).toEqual({ status: 200, id: '1' });
//   });

//   it('should create building', async () => {
//     const createMock = jest.fn().mockResolvedValue({
//       data: {
//         createBuilding: {
//           data: { id: '2' }
//         }
//       }
//     });

//     const mocks = [
//       {
//         request: {
//           query: CREATE_BUILDING,
//           variables: { data: { name: 'New Building' } }
//         },
//         result: createMock
//       }
//     ];

//     const wrapper = ({ children }) => (
//       <MockedProvider mocks={mocks} addTypename={false}>
//         {children}
//       </MockedProvider>
//     );

//     const { result } = renderHook(() => useBuilding(), { wrapper });

//     let createResult;
//     await act(async () => {
//       createResult = await result.current.createBuilding({ name: 'New Building' });
//     });

//     expect(createResult).toEqual({ status: 200, id: '2' });
//   });

//   it('should fetch contact persons', async () => {
//     const mocks = [
//       {
//         request: {
//           query: GET_ALL_CONTACT_PERSON,
//           variables: { filters: { contactPerson: { containsi: '' } } }
//         },
//         result: mockContactPersonData
//       }
//     ];

//     const wrapper = ({ children }) => (
//       <MockedProvider mocks={mocks} addTypename={false}>
//         {children}
//       </MockedProvider>
//     );

//     const { result } = renderHook(() => useBuilding(), { wrapper });

//     act(() => {
//       result.current.fetchContactPerson();
//     });

//     // Wait for the async operation to complete
//     await act(async () => {
//       await wait(0);
//     });

//     expect(result.current.contactPerson).toEqual(['John Doe', 'Jane Smith']);
//   });
// });



import { renderHook, act } from '@testing-library/react';
import useBuilding from './useBuilding';
import apolloClient from "@/lib/apolloClient";
import { GET_BUILDINGS, GET_BUILDING_BY_ID, GET_ALL_CONTACT_PERSON } from "@/graphql/queries/buildings";
import { CREATE_BUILDING, UPDATE_BUILDING } from "@/graphql/mutation/building";

jest.mock("@/lib/apolloClient", () => ({
  query: jest.fn(),
  mutate: jest.fn(),
}));

describe('useBuilding', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with undefined data', () => {
    const { result } = renderHook(() => useBuilding());
    expect(result.current.data).toBeUndefined();
    expect(result.current.singleData).toBeUndefined();
    expect(result.current.contactPerson).toBeUndefined();
  });

  it('should fetch buildings data', async () => {
    const mockBuildingsData = {
      data: {
        buildings: {
          data: [
            {
              id: '1',
              attributes: {
                name: 'Building 1',
                address: '123 Main St',
                mobileNumberCode: '+1',
                mobileNumber: '1234567890',
                organization: {
                  data: {
                    id: '1',
                    attributes: {
                      name: 'Org 1',
                      logo: { data: { attributes: { url: 'logo.png' }, id: '1' } }
                    }
                  }
                },
                email: 'test@example.com',
                contactPerson: 'John Doe',
                status: 'Active',
                category: { data: { attributes: { name: 'Category 1' } } }
              }
            }
          ]
        }
      }
    };

    apolloClient.query.mockResolvedValueOnce(mockBuildingsData);

    const { result, waitForNextUpdate } = renderHook(() => useBuilding());

    await waitForNextUpdate();

    expect(apolloClient.query).toHaveBeenCalledWith(expect.objectContaining({
      query: GET_BUILDINGS,
      fetchPolicy: "network-only",
    }));

    expect(result.current.data).toEqual([
      expect.objectContaining({
        id: '1',
        name: 'Building 1',
        address: '123 Main St',
      })
    ]);
  });

  it('should fetch single building data', async () => {
    const mockSingleBuildingData = {
      data: {
        building: {
          data: {
            id: '1',
            attributes: {
              name: 'Building 1',
              status: 'Active',
              address: '123 Main St',
              // ... other fields
            }
          }
        }
      }
    };

    apolloClient.query.mockResolvedValueOnce(mockSingleBuildingData);

    const { result } = renderHook(() => useBuilding());

    await act(async () => {
      await result.current.fetchSingleData('1');
    });

    expect(apolloClient.query).toHaveBeenCalledWith(expect.objectContaining({
      query: GET_BUILDING_BY_ID,
      variables: { id: '1' },
    }));

    expect(result.current.singleData).toEqual(expect.objectContaining({
      id: '1',
      name: 'Building 1',
      status: 'Active',
    }));
  });

  it('should update building', async () => {
    const mockUpdateResponse = {
      data: {
        updateBuilding: {
          data: { id: '1' }
        }
      }
    };

    apolloClient.mutate.mockResolvedValueOnce(mockUpdateResponse);

    const { result } = renderHook(() => useBuilding());

    const updateResult = await result.current.updateBuilding('1', { name: 'Updated Building' });

    expect(apolloClient.mutate).toHaveBeenCalledWith(expect.objectContaining({
      mutation: UPDATE_BUILDING,
      variables: { id: '1', data: { name: 'Updated Building' } },
    }));

    expect(updateResult).toEqual({ status: 200, id: '1' });
  });

  it('should create building', async () => {
    const mockCreateResponse = {
      data: {
        createBuilding: {
          data: { id: '2' }
        }
      }
    };

    apolloClient.mutate.mockResolvedValueOnce(mockCreateResponse);

    const { result } = renderHook(() => useBuilding());

    const createResult = await result.current.createBuilding({ name: 'New Building' });

    expect(apolloClient.mutate).toHaveBeenCalledWith(expect.objectContaining({
      mutation: CREATE_BUILDING,
      variables: { data: { name: 'New Building' } },
    }));

    expect(createResult).toEqual({ status: 200, id: '2' });
  });

  it('should fetch contact persons', async () => {
    const mockContactPersonsData = {
      data: {
        buildings: {
          data: [
            { attributes: { contactPerson: 'John Doe' } },
            { attributes: { contactPerson: 'Jane Smith' } }
          ]
        }
      }
    };

    apolloClient.query.mockResolvedValueOnce(mockContactPersonsData);

    const { result } = renderHook(() => useBuilding());

    await act(async () => {
      await result.current.fetchContactPerson();
    });

    expect(apolloClient.query).toHaveBeenCalledWith(expect.objectContaining({
      query: GET_ALL_CONTACT_PERSON,
    }));

    expect(result.current.contactPerson).toEqual(['John Doe', 'Jane Smith']);
  });
});