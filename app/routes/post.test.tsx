import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PostPage from "./post";
import * as postsApi from "../../api/posts";
import * as subPostsApi from "../../api/subposts";
import { MemoryRouter } from "react-router";

vi.mock("../../api/posts", async () => {
    const actual = await vi.importActual("../../api/posts");
    return {
        ...actual,
        postBelongsToCurrentUser: vi.fn(),
        updatePostData: vi.fn(),
        updatePostCountries: vi.fn(),
    };
});

vi.mock("../../api/subposts", () => ({
    deleteSubPost: vi.fn(),
    addEmptySubPost: vi.fn(),
}));

vi.mock("~/components/SubPost", () => ({
    SubPost: ({ subPost, onDelete, onEditStateChange }: any) => (
        <div data-testid={`subpost-${subPost.id}`}>
            {onDelete && <button onClick={() => onDelete(subPost.id)}>Delete</button>}
            <button
                data-testid={`trigger-subpost-edit-${subPost.id}`}
                onClick={() => onEditStateChange?.(true)}
            >
                Edit Subpost
            </button>
        </div>
    ),
}));

vi.mock("~/components/EditField", () => ({
    default: ({ value, onChange, onEditStateChange }: any) => (
        <div>
            <input data-testid="edit-field" value={value} onChange={(e) => onChange(e.target.value)} />
            <button data-testid="trigger-edit" onClick={() => onEditStateChange?.(true)}>Edit</button>
        </div>
    ),
}));

vi.mock("~/components/CountriesInput", () => ({
    default: () => <div data-testid="countries-input" />,
}));

vi.mock("~/modals/UnsavedChangesModal", () => ({
    default: ({ isOpen }: any) => isOpen ? <div data-testid="unsaved-modal" /> : null
}));

vi.mock("react-router", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual as any,
        useBlocker: vi.fn(() => ({ state: "unblocked", proceed: vi.fn(), reset: vi.fn() })),
    };
});

const mockPost = {
    id: 1,
    title: "Test Post",
    description: "Test Desc",
    title_image_url: "test.jpg",
    is_private: false,
    profiles: { display_name: "TestUser" },
    countries: [{ id: 1, code: "DE" }],
    sub_posts: [{ id: 10, title: "Sub1", content: "", sub_post_images: [] }],
} as any;

describe("PostPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders post content for guests", async () => {
        vi.mocked(postsApi.postBelongsToCurrentUser).mockResolvedValue(false);
        const mockProps = {
            loaderData: mockPost,
            params: { id: "1" },
            matches: []
        } as any;

        render(
            <MemoryRouter>
                <PostPage {...mockProps} />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Test Post")).toBeInTheDocument();
        });

        expect(screen.queryByTestId("edit-field")).not.toBeInTheDocument();
        expect(screen.queryByText("Subpost hinzufügen")).not.toBeInTheDocument();
    });

    it("renders edit fields for owners", async () => {
        vi.mocked(postsApi.postBelongsToCurrentUser).mockResolvedValue(true);
        const mockProps = {
            loaderData: mockPost,
            params: { id: "1" },
            matches: []
        } as any;

        render(
            <MemoryRouter>
                <PostPage {...mockProps} />
            </MemoryRouter>
        );

        const editFields = await screen.findAllByTestId("edit-field");
        expect(editFields.length).toBeGreaterThan(0);
        expect(screen.getByText("Subpost hinzufügen")).toBeInTheDocument();
    });

    it("triggers add subpost", async () => {
        vi.mocked(postsApi.postBelongsToCurrentUser).mockResolvedValue(true);

        vi.mocked(subPostsApi.addEmptySubPost).mockResolvedValue({
            id: 2,
            title: "Neuer Subpost",
            content: "",
            sub_post_images: []
        });

        const user = userEvent.setup();
        const mockProps = {
            loaderData: mockPost,
            params: { id: "1" },
            matches: []
        } as any;

        render(
            <MemoryRouter>
                <PostPage {...mockProps} />
            </MemoryRouter>
        );

        const addButton = await screen.findByRole("button", { name: /subpost hinzufügen/i });
        await user.click(addButton);

        expect(subPostsApi.addEmptySubPost).toHaveBeenCalledWith(1);
    });

    it("triggers delete subpost", async () => {
        vi.mocked(postsApi.postBelongsToCurrentUser).mockResolvedValue(true);
        const user = userEvent.setup();

        const mockProps = {
            loaderData: mockPost,
            params: { id: "1" },
            matches: []
        } as any;

        render(
            <MemoryRouter>
                <PostPage {...mockProps} />
            </MemoryRouter>
        );

        const deleteButton = await screen.findByText("Delete");
        await user.click(deleteButton);

        expect(subPostsApi.deleteSubPost).toHaveBeenCalledWith(10);
    });
});