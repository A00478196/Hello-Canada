import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import App from "./App";
import { act } from "react-dom/test-utils";

describe("Initial load result", () => {
  beforeEach(() => {
    global.fetch = jest.fn(); // Mock fetch globally before each test
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore all mocks after each test
  });

  test("show province api call and expect the list", async () => {
    const mockProvinceData = [
      {
        name: "Ontario",
        capital: "Toronto",
        flagUrl:
          "https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Ontario.svg",
      },
      {
        name: "Quebec",
        capital: "Quebec City",
        flagUrl:
          "https://upload.wikimedia.org/wikipedia/commons/5/5f/Flag_of_Quebec.svg",
      },
    ];

    await act(async () => {
      render(<App />);
    }); // Mock the response of fetch
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockProvinceData),
    });

    // Wait for the fetch call to resolve
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        "https://my-json-server.typicode.com/simonachkar/demo-canada-api-server/provinces"
      )
    );

    waitFor(() => expect(screen.getByText("Ontario")).toBeInTheDocument());
    waitFor(() => expect(screen.getByText("Toronto")).not.toBeInTheDocument());
    waitFor(() => expect(screen.getByText("Show Capital")).toBeInTheDocument());

    waitFor(() => {
      const flagImage = screen.getByAltText("Ontario's Flag"); // Find image with no alt text
      expect(flagImage).toBeInTheDocument();
      expect(flagImage.src).toBe(
        "https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Ontario.svg"
      );
    });
  });
});

describe("Province API call", () => {
  beforeEach(() => {
    global.fetch = jest.fn(); // Mock fetch globally before each test
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore all mocks after each test
  });

  test("fetches successfully from API", async () => {
    const mockProvinceData = [
      {
        name: "Ontario",
        capital: "Toronto",
        flagUrl:
          "https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Ontario.svg",
      },
      {
        name: "Quebec",
        capital: "Quebec City",
        flagUrl:
          "https://upload.wikimedia.org/wikipedia/commons/5/5f/Flag_of_Quebec.svg",
      },
    ];

    await act(async () => {
      render(<App />);
    });
    // Click on "Provinces"
    fireEvent.click(screen.getByText("Provinces"));

    // Mock the response of fetch
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockProvinceData),
    });

    // Wait for the fetch call to resolve
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        "https://my-json-server.typicode.com/simonachkar/demo-canada-api-server/provinces"
      )
    );

    waitFor(() => expect(screen.getByText("Ontario")).toBeInTheDocument());
  });
});

describe("Territory API call", () => {
  beforeEach(() => {
    global.fetch = jest.fn(); // Mock fetch globally before each test
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore all mocks after each test
  });

  test("fetches successfully from API", async () => {
    const mockTerritoriesData = [
      {
        name: "Yukon",
        capital: "Whitehorse",
        flagUrl:
          "https://upload.wikimedia.org/wikipedia/commons/6/69/Flag_of_Yukon.svg",
      },
      {
        name: "Northwest Territories",
        capital: "Yellowknife",
        flagUrl:
          "https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Northwest_Territories.svg",
      },
    ];

    await act(async () => {
      render(<App />);
    });
    // Click on "Territories"

    fireEvent.click(screen.getByText("Territories"));

    // Mock the response of fetch
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockTerritoriesData),
    });

    // Wait for the fetch call to resolve
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        "https://my-json-server.typicode.com/simonachkar/demo-canada-api-server/territories"
      )
    );

    waitFor(() => expect(screen.getByText("Yukon")).toBeInTheDocument());
  });
});

describe("Show/hide capital", () => {
  beforeEach(() => {
    global.fetch = jest.fn(); // Mock fetch globally before each test
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore all mocks after each test
  });

  const mockData = [
    { name: "Ontario", capital: "Toronto" },
    { name: "Quebec", capital: "Quebec City" },
    // Add more dynamic data as needed
  ];

  test('reveals capital when "Show Capital" button is clicked', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    await act(async () => {
      render(<App />);
    });
    waitFor(() => {
      expect(screen.getByText("Toronto")).not.toBeVisible();
      expect(screen.getByText("Show Capital")).toBeVisible();

      fireEvent.click(screen.getByText("Show Capital"));

      // Wait for the component to update with the fetched data
      expect(screen.findByText("Show Capital")).not.toBeVisible();
      expect(screen.findByText("Hide Capital")).toBeVisible();

      screen.findByText("Toronto");

      expect(screen.getByText("Toronto")).toBeInTheDocument();
    });
  });

  test('hide capital when "Hide Capital" button is clicked', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    await act(async () => {
      render(<App />);
    });

    waitFor(() => {
      expect(screen.getByText("Toronto")).not.toBeVisible();
      expect(screen.getByText("Show Capital")).toBeVisible();

      fireEvent.click(screen.getByText("Show Capital"));
      expect(screen.findByText("Hide Capital")).toBeVisible();

      screen.findByText("Toronto");

      expect(screen.getByText("Toronto")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Hide Capital"));
      expect(screen.findByText("Toronto")).not.toBeVisible();
    });
  });
});
