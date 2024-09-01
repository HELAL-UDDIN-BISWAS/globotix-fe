// import React from 'react';
// import { renderHook, act } from '@testing-library/react';
// import { MockedProvider } from '@apollo/client/testing';
// import useBases from './useBases';
// import { GET_ROBOTS } from '@/graphql/queries/robots';

// // Mock the Apollo Client
// jest.mock('@/lib/apolloClient', () => ({
//   query: jest.fn(),
// }));

// // Helper function to wait for a short time
// const wait = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

// describe('useBases', () => {
//   const mockRobotsData = {
//     data: {
//       robots: {
//         data: [
//           {
//             id: '1',
//             attributes: {
//               status: 'Good',
//               displayName: 'Robot 1',
//               batteryPercentage: 80,
//               serialNumber: 'SN001',
//               workingStatus: 'Online',
//               building: {
//                 data: {
//                   attributes: {
//                     name: 'Building A',
//                     locations: {
//                       data: [{ attributes: { name: 'Location 1' } }],
//                     },
//                   },
//                 },
//               },
//             },
//           },
//           {
//             id: '2',
//             attributes: {
//               status: 'Base',
//               displayName: 'Robot 2',
//               batteryPercentage: 20,
//               serialNumber: 'SN002',
//               workingStatus: 'Offline',
//               building: {
//                 data: {
//                   attributes: {
//                     name: 'Building B',
//                     locations: {
//                       data: [{ attributes: { name: 'Location 2' } }],
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         ],
//       },
//     },
//   };

//   it('should fetch and categorize robots correctly', async () => {
//     const mocks = [
//       {
//         request: {
//           query: GET_ROBOTS,
//           fetchPolicy: 'network-only',
//         },
//         result: mockRobotsData,
//       },
//     ];

//     const wrapper = ({ children }) => (
//       <MockedProvider mocks={mocks} addTypename={false}>
//         {children}
//       </MockedProvider>
//     );

//     const { result } = renderHook(() => useBases(), { wrapper });

//     expect(result.current.isLoading).toBe(false);
//     expect(result.current.onlineRobots).toEqual([]);
//     expect(result.current.offlineRobots).toEqual([]);
//     expect(result.current.allRobots).toEqual([]);

//     act(() => {
//       result.current.getAllRobots();
//     });

//     // Wait for the async operation to complete
//     await act(async () => {
//       await wait(100);
//     });

//     // We're not checking isLoading here as it seems to remain true
//     expect(result.current.onlineRobots).toEqual([]);
//     expect(result.current.offlineRobots).toEqual([]);
//     // expect(result.current.allRobots).toHaveLength(2);
//     expect(result.current.allRobots[0]).toEqual(
//       expect.objectContaining({
//         id: '1',
//         displayName: 'Robot 1',
//         status: 'Good',
//         battery: 80,
//         serialNumber: 'SN001',
//         location: 'Location 1',
//       })
//     );
//   });

//   it('should handle errors when fetching robots', async () => {
//     const errorMock = [
//       {
//         request: {
//           query: GET_ROBOTS,
//           fetchPolicy: 'network-only',
//         },
//         error: new Error('An error occurred'),
//       },
//     ];

//     const wrapper = ({ children }) => (
//       <MockedProvider mocks={errorMock} addTypename={false}>
//         {children}
//       </MockedProvider>
//     );

//     const { result } = renderHook(() => useBases(), { wrapper });

//     act(() => {
//       result.current.getAllRobots();
//     });

//     // Wait for the async operation to complete
//     await act(async () => {
//       await wait(100);
//     });

//     // We're not checking isLoading here as it seems to remain true
//     // Adjust these expectations based on how your hook actually behaves in case of an error
//     expect(result.current.onlineRobots).toEqual([]);
//     expect(result.current.offlineRobots).toEqual([]);
//     expect(result.current.allRobots).toEqual([]);
//   });
// });


import { act } from '@testing-library/react';
import useBases from './useBases';
import apolloClient from "@/lib/apolloClient";
import { GET_ROBOTS } from "@/graphql/queries/robots";

jest.mock("@/lib/apolloClient", () => ({
  query: jest.fn(),
}));

describe('useBases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useBases.setState({
      isLoading: false,
      user: [],
      offlineRobots: [],
      onlineRobots: [],
      allRobots: [],
    });
  });

  it('should initialize with default values', () => {
    const state = useBases.getState();
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual([]);
    expect(state.offlineRobots).toEqual([]);
    expect(state.onlineRobots).toEqual([]);
    expect(state.allRobots).toEqual([]);
  });

  describe('getAllRobots', () => {
    it('should fetch and categorize robots successfully', async () => {
      const mockData = {
        data: {
          robots: {
            data: [
              {
                id: '1',
                attributes: {
                  status: 'Critical',
                  displayName: 'Robot 1',
                  batteryPercentage: 80,
                  serialNumber: 'SN001',
                  building: {
                    data: {
                      attributes: {
                        name: 'Building 1',
                        locations: {
                          data: [{ attributes: { name: 'Location 1' } }]
                        }
                      }
                    }
                  },
                  baseName: 'Base 1',
                  cleaningPlanEditors: {
                    data: [{ attributes: { name: 'Plan 1' } }]
                  },
                  wireguardIp: '10.0.0.1',
                  firmwareVersion: '1.0.0',
                  license: 'License 1',
                  workingStatus: 'Online',
                  statusLevel: 'High',
                  gutterBrushUsage: 50,
                  chargingTime: '2h',
                  deployedTime: '5h',
                  zonePosition: 'Zone 1',
                }
              },
              {
                id: '2',
                attributes: {
                  status: 'Base',
                  displayName: 'Robot 2',
                  batteryPercentage: 100,
                  serialNumber: 'SN002',
                  building: {
                    data: {
                      attributes: {
                        name: 'Building 2',
                        locations: {
                          data: [{ attributes: { name: 'Location 2' } }]
                        }
                      }
                    }
                  },
                  baseName: 'Base 2',
                  cleaningPlanEditors: {
                    data: [{ attributes: { name: 'Plan 2' } }]
                  },
                  wireguardIp: '10.0.0.2',
                  firmwareVersion: '1.0.1',
                  license: 'License 2',
                  workingStatus: 'Offline',
                  statusLevel: 'Low',
                  gutterBrushUsage: 20,
                  chargingTime: '1h',
                  deployedTime: '3h',
                  zonePosition: 'Zone 2',
                }
              },
            ]
          }
        }
      };

      apolloClient.query.mockResolvedValueOnce(mockData);

      await act(async () => {
        await useBases.getState().getAllRobots();
      });

      expect(apolloClient.query).toHaveBeenCalledWith({
        query: GET_ROBOTS,
        fetchPolicy: "network-only",
      });

      const state = useBases.getState();
      expect(state.onlineRobots).toEqual({
        critical: [expect.objectContaining({ id: '1', status: 'Critical' })],
        warning: [],
        good: [],
        idle: [],
      });
      expect(state.offlineRobots).toEqual([
        expect.objectContaining({ id: '2', status: 'Base' })
      ]);
      expect(state.allRobots).toHaveLength(2);
      expect(state.allRobots[0]).toEqual(expect.objectContaining({
        id: '1',
        displayName: 'Robot 1',
        location: 'Location 1',
      }));
      expect(state.allRobots[1]).toEqual(expect.objectContaining({
        id: '2',
        displayName: 'Robot 2',
        location: 'Location 2',
      }));
    });

    it('should handle errors when fetching robots', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      apolloClient.query.mockRejectedValueOnce(new Error('Fetch error'));

      await act(async () => {
        await useBases.getState().getAllRobots();
      });

      expect(consoleLogSpy).toHaveBeenCalledWith('error', new Error('Fetch error'));
      
      const state = useBases.getState();
      expect(state.onlineRobots).toEqual([]);
      expect(state.offlineRobots).toEqual([]);
      expect(state.allRobots).toEqual([]);

      consoleLogSpy.mockRestore();
    });
  });
});