import { renderHook, act } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import useReports from './useReports';
import { GET_ALL_REPORTS } from "@/graphql/queries/reports";
import apolloClient from "@/lib/apolloClient";
import dayjs from "dayjs";

// Mock the Apollo Client
jest.mock('@/lib/apolloClient', () => ({
  query: jest.fn(),
}));

// Mock lodash
jest.mock('lodash', () => ({
  concat: jest.fn((arr, item) => [...arr, item]),
  isArray: jest.fn(Array.isArray),
}));

describe('useReports', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockReportsData = {
    data: {
      reports: {
        data: [
          {
            id: '1',
            attributes: {
              startIso8601Time: '2023-08-28T10:00:00Z',
              endIso8601Time: '2023-08-28T11:00:00Z',
              cleaningStatus: 'completed',
              robot: { data: { id: 'robot1', attributes: { building: { data: { id: 'building1' } } } } },
              location: { data: { attributes: { name: 'Location 1', building: { data: { attributes: { name: 'Building 1' } } } } } },
            },
          },
        ],
        meta: {
          pagination: {
            pageCount: 5,
          },
        },
      },
    },
  };

  it('fetches reports data with no filters', async () => {
    apolloClient.query.mockResolvedValue(mockReportsData);

    const { result } = renderHook(() => useReports());

    await act(async () => {
      await result.current.fetchData();
    });

    expect(apolloClient.query).toHaveBeenCalledWith(expect.objectContaining({
      query: GET_ALL_REPORTS,
      variables: expect.objectContaining({
        filters: { and: [] },
        sort: ["startIso8601Time:desc"],
      }),
    }));

    expect(result.current.data).toEqual(mockReportsData.data.reports.data);
    expect(result.current.pageCount).toBe(5);
    expect(result.current.loading).toBe(false);
  });

  it('fetches reports data with search input', async () => {
    apolloClient.query.mockResolvedValue(mockReportsData);

    const { result } = renderHook(() => useReports());

    await act(async () => {
      await result.current.fetchData('searchTerm');
    });

    expect(apolloClient.query).toHaveBeenCalledWith(expect.objectContaining({
      variables: expect.objectContaining({
        filters: {
          and: [{
            or: [
              { location: { building: { name: { containsi: 'searchTerm' } } } },
              { location: { name: { containsi: 'searchTerm' } } },
            ],
          }],
        },
      }),
    }));
  });

  it('fetches reports data with robot filter', async () => {
    apolloClient.query.mockResolvedValue(mockReportsData);

    const { result } = renderHook(() => useReports());

    await act(async () => {
      await result.current.fetchData('', { robot_id: ['robot1', 'robot2'] });
    });

    expect(apolloClient.query).toHaveBeenCalledWith(expect.objectContaining({
      variables: expect.objectContaining({
        filters: {
          and: [{ robot: { id: { in: ['robot1', 'robot2'] } } }],
        },
      }),
    }));
  });

  it('fetches reports data with cleaning status filter', async () => {
    apolloClient.query.mockResolvedValue(mockReportsData);

    const { result } = renderHook(() => useReports());

    await act(async () => {
      await result.current.fetchData('', { cleaning_status: ['completed', 'in_progress'] });
    });

    expect(apolloClient.query).toHaveBeenCalledWith(expect.objectContaining({
      variables: expect.objectContaining({
        filters: {
          and: [{ cleaningStatus: { in: ['completed', 'in_progress'] } }],
        },
      }),
    }));
  });

  it('fetches reports data with date filter', async () => {
    apolloClient.query.mockResolvedValue(mockReportsData);

    const { result } = renderHook(() => useReports());

    const minDate = '2023-08-01';
    const maxDate = '2023-08-31';

    await act(async () => {
      await result.current.fetchData('', {}, { min_date: minDate, max_date: maxDate });
    });

    expect(apolloClient.query).toHaveBeenCalledWith(expect.objectContaining({
      variables: expect.objectContaining({
        filters: {
          and: [
            { startIso8601Time: { gte: dayjs(minDate).format("YYYY-MM-DD") } },
            { endIso8601Time: { lte: dayjs(maxDate).format("YYYY-MM-DD") } },
          ],
        },
      }),
    }));
  });

  it('fetches reports data with pagination', async () => {
    apolloClient.query.mockResolvedValue(mockReportsData);

    const { result } = renderHook(() => useReports());

    await act(async () => {
      await result.current.fetchData('', {}, {}, { page: 2, pageSize: 10 });
    });

    expect(apolloClient.query).toHaveBeenCalledWith(expect.objectContaining({
      variables: expect.objectContaining({
        page: 2,
        pageSize: 10,
      }),
    }));
  });

  it('handles error when fetching reports', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    apolloClient.query.mockRejectedValue(new Error('Fetch error'));

    const { result } = renderHook(() => useReports());

    await act(async () => {
      await result.current.fetchData();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching reports:', expect.any(Error));
    expect(result.current.loading).toBe(false);

    consoleErrorSpy.mockRestore();
  });
});