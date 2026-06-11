import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ErrorBoundary } from "./root";
import { isRouteErrorResponse } from "react-router";

vi.mock("react-router", async () => {
    const actual = await vi.importActual("react-router");
    return {
        ...actual,
        isRouteErrorResponse: vi.fn(),
    };
});

describe("ErrorBoundary", () => {
    it("renders 404 message for route errors", () => {
        vi.mocked(isRouteErrorResponse).mockReturnValue(true);

        const mockProps = {
            error: { status: 404, statusText: "Not Found" }
        } as any;

        render(<ErrorBoundary {...mockProps} />);

        expect(screen.getByText("404")).toBeInTheDocument();
        expect(screen.getByText(/could not be found/i)).toBeInTheDocument();
    });

    it("renders generic error message for unexpected errors", () => {
        vi.mocked(isRouteErrorResponse).mockReturnValue(false);

        const mockProps = {
            error: new Error("Something went wrong")
        } as any;

        render(<ErrorBoundary {...mockProps} />);

        expect(screen.getByText("Oops!")).toBeInTheDocument();
    });
});