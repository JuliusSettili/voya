import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BlockedPage from "./blocked"; // Passe den Pfad an

describe("BlockedPage Component", () => {
    it("renders the blocked account message", () => {
        render(<BlockedPage />);

        expect(screen.getByText("Ihr Konto wurde gesperrt")).toBeInTheDocument();
        expect(screen.getByText("Du hast keine Berechtigung, auf diese Seite zuzugreifen.")).toBeInTheDocument();
    });

    it("renders a link to the homepage", () => {
        render(<BlockedPage />);

        const homeLink = screen.getByRole("link", { name: /zur startseite/i });
        expect(homeLink).toBeInTheDocument();
        expect(homeLink).toHaveAttribute("href", "/");
    });
});