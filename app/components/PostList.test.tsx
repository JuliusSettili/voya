import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PostList from "./PostList";
import type { Post } from "../../api/supabaseClient";

// Isolierung der Kind-Komponente, da deren eigene Logik separat getestet wird
vi.mock("~/components/PostCard", () => ({
    default: (props: any) => (
        <div data-testid={`mock-postcard-${props.postId}`}>
            <span data-testid={`title-${props.postId}`}>{props.title}</span>
            <span data-testid={`admin-${props.postId}`}>{String(props.isAdmin)}</span>
            <span data-testid={`blocked-${props.postId}`}>{String(props.isBlocked)}</span>
        </div>
    )
}));

const TEXT_EMPTY_STATE = "Keine Posts gefunden.";

const MOCK_POST_1 = {
    id: 1,
    title: "Erster Post",
    description: "Beschreibung 1",
    title_image_url: "img1.jpg",
    profiles: { id: "p1", display_name: "User 1" },
    countries: [{ id: 1, code: "DE" }],
    is_blocked: false,
    is_private: false
} as unknown as Post;

const MOCK_POST_2 = {
    id: 2,
    title: "Zweiter Post",
    description: "Beschreibung 2",
    title_image_url: "img2.jpg",
    profiles: { id: "p2", display_name: "User 2" },
    countries: [{ id: 2, code: "FR" }],
    is_blocked: true,
    is_private: true
} as unknown as Post;

const MOCK_POSTS_ARRAY = [MOCK_POST_1, MOCK_POST_2];

describe("PostList Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders empty state message when the posts array is empty", () => {
        render(<PostList posts={[]} />);

        expect(screen.getByText(TEXT_EMPTY_STATE)).toBeInTheDocument();
        expect(screen.queryByTestId(/mock-postcard-/)).not.toBeInTheDocument();
    });

    it("renders a PostCard for each post in the array", () => {
        render(<PostList posts={MOCK_POSTS_ARRAY} />);

        const renderedCards = screen.getAllByTestId(/mock-postcard-/);
        expect(renderedCards.length).toBe(MOCK_POSTS_ARRAY.length);

        expect(screen.getByTestId(`mock-postcard-${MOCK_POST_1.id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`mock-postcard-${MOCK_POST_2.id}`)).toBeInTheDocument();
    });

    it("passes the correct mapped properties down to the PostCard", () => {
        render(<PostList posts={[MOCK_POST_1]} isAdmin={true} />);

        expect(screen.getByTestId(`title-${MOCK_POST_1.id}`)).toHaveTextContent(MOCK_POST_1.title);
        expect(screen.getByTestId(`admin-${MOCK_POST_1.id}`)).toHaveTextContent("true");
        expect(screen.getByTestId(`blocked-${MOCK_POST_1.id}`)).toHaveTextContent("false");
    });

    it("correctly forwards the blocked status if a post is blocked", () => {
        render(<PostList posts={[MOCK_POST_2]} isAdmin={false} />);

        expect(screen.getByTestId(`title-${MOCK_POST_2.id}`)).toHaveTextContent(MOCK_POST_2.title);
        expect(screen.getByTestId(`admin-${MOCK_POST_2.id}`)).toHaveTextContent("false");
        expect(screen.getByTestId(`blocked-${MOCK_POST_2.id}`)).toHaveTextContent("true");
    });
});