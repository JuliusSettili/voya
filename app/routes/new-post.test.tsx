import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import NewPost from "./new-post";
import { useFetcher } from "react-router";
import { uploadPostImage } from "../../api/posts";

vi.mock("react-router", async () => {
    const actual = await vi.importActual("react-router");
    return {
        ...actual,
        useFetcher: vi.fn(),
    };
});

vi.mock("../../api/posts", () => ({
    createPost: vi.fn(),
    uploadPostImage: vi.fn(),
}));

vi.mock("~/components/CountriesInput", () => ({
    default: ({ onChange }: any) => (
        <div data-testid="countries-input" onClick={() => onChange([1])} />
    )
}));

describe("NewPost Component", () => {
    const mockFetcher = {
        state: "idle",
        data: null,
        Form: ({ children, ...props }: any) => <form {...props}>{children}</form>
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useFetcher as any).mockReturnValue(mockFetcher);
    });

    it("renders the upload field and form inputs", () => {
        render(<NewPost />);
        expect(screen.getByText("Bild hochladen")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Gib deinem Beitrag einen Titel")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /beitrag erstellen/i })).toBeDisabled();
    });

    it("handles image upload successfully", async () => {
        const file = new File(["dummy"], "test.jpg", { type: "image/jpeg" });
        (uploadPostImage as any).mockResolvedValue("https://example.com/image.jpg");

        render(<NewPost />);

        const fileInput = screen.getByLabelText(/bild hochladen/i, { selector: 'input' });

        // Simuliere Datei-Auswahl
        fireEvent.change(fileInput, { target: { files: [file] } });

        await waitFor(() => {
            expect(uploadPostImage).toHaveBeenCalledWith(file);
        });

        expect(screen.getByText(/Bild hochgeladen: test.jpg/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /beitrag erstellen/i })).not.toBeDisabled();
    });

    it("shows error if image upload fails", async () => {
        (uploadPostImage as any).mockRejectedValue(new Error("Upload Failed"));

        render(<NewPost />);

        const fileInput = screen.getByLabelText(/bild hochladen/i, { selector: 'input' });
        fireEvent.change(fileInput, { target: { files: [new File([""], "fail.jpg")] } });

        await waitFor(() => {
            expect(screen.getByText("Upload Failed")).toBeInTheDocument();
        });
    });

    it("disables button during submission", () => {
        (useFetcher as any).mockReturnValue({
            ...mockFetcher,
            state: "submitting"
        });

        render(<NewPost />);

        const submitButton = screen.getByRole("button", { name: /beitrag erstellen/i });
        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveTextContent("Beitrag erstellen");
    });
});