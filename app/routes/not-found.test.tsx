import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import NotFound from "./not-found";

describe("NotFound Component", () => {
    it("renders the 404 error message correctly", () => {
        render(<NotFound />);

        expect(screen.getByText("404 - Seite nicht gefunden")).toBeInTheDocument();
        expect(screen.getByText(/Die von dir gesuchte Seite existiert nicht/i)).toBeInTheDocument();
    });

    it("renders a link to the homepage", () => {
        render(<NotFound />);

        const homeLink = screen.getByRole("link", { name: /zur startseite/i });
        expect(homeLink).toBeInTheDocument();
        expect(homeLink).toHaveAttribute("href", "/");
    });
});