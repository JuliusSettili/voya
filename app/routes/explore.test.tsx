import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Explore from "./explore";
import { useSearchParams } from "react-router";
import type { Post } from "../../api/supabaseClient";

vi.mock("react-router", () => ({
    useSearchParams: vi.fn(),
}));

vi.mock("~/components/PostList", () => ({
    default: ({ posts }: any) => (
        <div data-testid="mock-postlist">
            {posts.map((p: any) => <div key={p.id}>{p.title}</div>)}
        </div>
    )
}));

vi.mock("~/components/SearchBar", () => ({
    default: (props: any) => <input data-testid="mock-searchbar" {...props} />
}));

vi.mock("~/components/FilterComponent", () => ({
    default: () => <div data-testid="mock-filter" />
}));

const MOCK_POSTS = [
    {
        id: 1,
        title: "Germany Trip",
        description: "Test",
        title_image_url: "url",
        is_private: false,
        is_blocked: false,
        countries: [{ id: 1 }],
        profiles: { id: "p1", display_name: "User" }
    },
    {
        id: 2,
        title: "Private Secret",
        description: "Test",
        title_image_url: "url",
        is_private: true,
        is_blocked: false,
        countries: [],
        profiles: { id: "p2", display_name: "User" }
    },
    {
        id: 3,
        title: "Blocked Content",
        description: "Test",
        title_image_url: "url",
        is_private: false,
        is_blocked: true,
        countries: [],
        profiles: { id: "p3", display_name: "User" }
    }
] as unknown as Post[];

// Hilfsfunktion, um die Router-Props zu simulieren
const createMockProps = (posts: Post[], isAdmin: boolean) => ({
    loaderData: { posts, isAdmin },
    params: {},
    matches: []
} as any);

describe("Explore Route Component", () => {
    it("renders components and filters out private posts", () => {
        (useSearchParams as any).mockReturnValue([new URLSearchParams()]);
        const props = createMockProps(MOCK_POSTS, false);

        render(<Explore {...props} />);

        expect(screen.getByText("Entdecken")).toBeInTheDocument();
        expect(screen.getByTestId("mock-postlist")).toHaveTextContent("Germany Trip");
        expect(screen.queryByText("Private Secret")).not.toBeInTheDocument();
    });

    it("shows blocked posts only to admins", () => {
        (useSearchParams as any).mockReturnValue([new URLSearchParams()]);

        const propsNonAdmin = createMockProps(MOCK_POSTS, false);
        const { rerender } = render(<Explore {...propsNonAdmin} />);
        expect(screen.queryByText("Blocked Content")).not.toBeInTheDocument();

        const propsAdmin = createMockProps(MOCK_POSTS, true);
        rerender(<Explore {...propsAdmin} />);
        expect(screen.getByText("Blocked Content")).toBeInTheDocument();
    });

    it("filters posts by search query", () => {
        const params = new URLSearchParams({ searchQuery: "Germany" });
        (useSearchParams as any).mockReturnValue([params]);
        const props = createMockProps(MOCK_POSTS, false);

        render(<Explore {...props} />);

        expect(screen.getByText("Germany Trip")).toBeInTheDocument();
        expect(screen.queryByText("France")).not.toBeInTheDocument();
    });
});