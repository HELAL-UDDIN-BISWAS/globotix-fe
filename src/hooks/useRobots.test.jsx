import { act, renderHook } from '@testing-library/react';
import useRobots from './useRobots';
import apolloClient from "@/lib/apolloClient";
import axios from "axios";
import { API_URL } from "@/lib/api";

// Mocking dependencies
jest.mock('@/lib/apolloClient', () => ({
    query: jest.fn(),
  }));
jest.mock("axios");

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

describe('useRobots', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(JSON.stringify({ state: { accessToken: 'mock-token' } }));
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useRobots());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.robot).toEqual({});
    expect(result.current.robots).toEqual([]);
  });

  it('should get robot by id', async () => {
    const mockRobotData = {
      data: {
        robot: {
          data: {
            id: '1',
            attributes: {
              baseName: 'Base1',
              displayName: 'Robot1',
              serialNumber: 'SN001',
              status: 'Active',
              batteryPercentage: 80,
              building: { data: { id: 'B1', attributes: { name: 'Building1' } } },
              locations: { data: [] },
              cleaningPlanEditors: { data: [] }
            }
          }
        }
      }
    };

    apolloClient.mutate.mockResolvedValueOnce(mockRobotData);

    const { result } = renderHook(() => useRobots());

    await act(async () => {
      await result.current.getRobotById({ id: '1' });
    });

    expect(result.current.robot).toEqual(expect.objectContaining({
      id: '1',
      baseName: 'Base1',
      displayName: 'Robot1'
    }));
  });

  it('should get all robots', async () => {
    const mockRobotsData = {
      data: {
        robots: {
          data: [
            { id: '1', attributes: { displayName: 'Robot1' } },
            { id: '2', attributes: { displayName: 'Robot2' } }
          ]
        }
      }
    };

    apolloClient.query.mockResolvedValueOnce(mockRobotsData);

    const { result } = renderHook(() => useRobots());

    await act(async () => {
      await result.current.getAllRobots();
    });

    expect(result.current.robots).toEqual([
      { id: '1', name: 'Robot1' },
      { id: '2', name: 'Robot2' }
    ]);
  });

  it('should get daily coverage performance', async () => {
    const mockPerformanceData = {
      status: 200,
      data: {
        data: {
          cleaningReport: {
            coveragePerformanceByDaily: { someData: 'performanceData' }
          }
        }
      }
    };

    axios.request.mockResolvedValueOnce(mockPerformanceData);

    const { result } = renderHook(() => useRobots());

    await act(async () => {
      await result.current.getDailyCoveragePerformance({ robotId: '1' });
    });

    expect(result.current.coveragePerformanceDaily).toEqual({ someData: 'performanceData' });
  });

  it('should get monthly issue faced', async () => {
    const mockIssueData = {
      status: 200,
      data: {
        data: {
          cleaningReport: {
            overallIssueFacedByMonthly: [{ issue: 'someIssue' }]
          }
        }
      }
    };

    axios.request.mockResolvedValueOnce(mockIssueData);

    const { result } = renderHook(() => useRobots());

    await act(async () => {
      await result.current.getMonthlyIssueFaced({ robotId: '1' });
    });

    expect(result.current.issueFacedMonthly).toEqual([{ issue: 'someIssue' }]);
  });

  it('should get monthly battery usage', async () => {
    const mockBatteryData = {
      status: 200,
      data: {
        data: {
          cleaningReport: {
            overallBatteryUsageByMonthly: [{ usage: 50 }]
          }
        }
      }
    };

    axios.request.mockResolvedValueOnce(mockBatteryData);

    const { result } = renderHook(() => useRobots());

    await act(async () => {
      await result.current.getMonthlyBatteryUsage({ robotId: '1' });
    });

    expect(result.current.batteryUsageMonthly).toEqual([{ usage: 50 }]);
  });

  it('should create a robot', async () => {
    const mockCreateData = {
      data: {
        createRobot: {
          data: { id: 'newRobot' }
        }
      }
    };

    apolloClient.mutate.mockResolvedValueOnce(mockCreateData);

    const { result } = renderHook(() => useRobots());

    const response = await result.current.createRobot({ payload: { name: 'NewRobot' } });

    expect(response).toEqual({ status: 200 });
  });

  it('should update a robot', async () => {
    const mockUpdateData = {
      data: {
        updateRobot: {
          data: { id: 'updatedRobot' }
        }
      }
    };

    apolloClient.mutate.mockResolvedValueOnce(mockUpdateData);

    const { result } = renderHook(() => useRobots());

    const response = await result.current.updateRobot({ id: 'robot1', payload: { name: 'UpdatedRobot' } });

    expect(response).toEqual({ status: 200 });
  });

  it('should handle errors', async () => {
    apolloClient.mutate.mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() => useRobots());

    const response = await result.current.updateRobot({ id: 'robot1', payload: { name: 'UpdatedRobot' } });

    expect(response).toBe('API Error');
  });
});