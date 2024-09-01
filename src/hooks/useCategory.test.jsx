import { act } from '@testing-library/react';
import useCategory from "./useCategory";
import apolloClient from "@/lib/apolloClient";
import { GET_ALL_CATEGORY } from "@/graphql/queries/category";

jest.mock("@/lib/apolloClient", () => ({
  query: jest.fn(),
}));

describe("useCategory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useCategory.setState({ isLoading: false, listCategory: [] });
  });

  it("should initialize with default values", () => {
    const state = useCategory.getState();
    expect(state.isLoading).toBe(false);
    expect(state.listCategory).toEqual([]);
  });

  it("should fetch and set categories", async () => {
    const mockResponse = {
      data: {
        categories: {
          data: [
            { id: "1", attributes: { name: "Category 1" } },
            { id: "2", attributes: { name: "Category 2" } },
          ],
        },
      },
    };

    apolloClient.query.mockResolvedValue(mockResponse);

    await act(async () => {
      await useCategory.getState().getAllCategory();
    });

    const state = useCategory.getState();
    expect(state.listCategory).toEqual([
      { id: "1", name: "Category 1" },
      { id: "2", name: "Category 2" },
    ]);

    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_ALL_CATEGORY,
      fetchPolicy: "network-only",
    });
  });

  it("should handle errors when fetching categories", async () => {
    const mockError = new Error("Network error");
    apolloClient.query.mockRejectedValue(mockError);

    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    await act(async () => {
      await useCategory.getState().getAllCategory();
    });

    const state = useCategory.getState();
    expect(state.listCategory).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith("error", mockError);

    consoleSpy.mockRestore();
  });
});