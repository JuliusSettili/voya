import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import PostCard from "./PostCard";
import type { Profile } from "../../api/supabaseClient";

let mockLocationPathname = "/";

vi.mock("react-router", () => ({
    Link: ({ to, children }: { to: string; children: React.ReactNode }) => <a href={to}>{children}</a>,
    useLocation: () => ({ pathname: mockLocationPathname }),
}));

vi.mock("react-country-flag", () => ({
    default: ({ countryCode }: { countryCode: string }) => <span data-testid={`flag-${countryCode}`} />
}));

vi.mock("../modals/BlockPostModal", () => ({
    default: ({ postId }: { postId: number }) => <dialog id={`block-modal-${postId}`} />
}));

vi.mock("../modals/UnblockPostModal", () => ({
    default: ({ postId }: { postId: number }) => <dialog id={`unblock-modal-${postId}`} />
}));

vi.mock("../modals/TogglePrivacyModal", () => ({
    default: ({ postId }: { postId: number }) => <dialog id={`toggle-privacy-modal-${postId}`} />
}));

vi.mock("~/modals/DeletePostModal", () => ({
    default: ({ postId }: { postId: number }) => <dialog id={`delete-modal-${postId}`} />
}));

const MOCK_POST_ID = 123;
const MOCK_TITLE = "Test Titel";
const MOCK_DESCRIPTION = "Test Beschreibung";
const MOCK_IMAGE_URL = "http://example.com/image.jpg";
const MOCK_PROFILE = {
    id: "p1",
    display_name: "Max",
    role_id: 1,
    created_at: ""
} as unknown as Profile;
const MOCK_COUNTRIES = [{ id: 1, name: "Germany", code: "DE" }];
const MOCK_LINK = `/post/${MOCK_POST_ID}`;

const TEXT_BLOCKED_WARNING = "(Gesperrt)";
const TOOLTIP_PRIVATE = "Ist privat (Klicken zum Ändern)";
const TOOLTIP_PUBLIC = "Ist öffentlich (Klicken zum Ändern)";

const BTN_TITLE_BLOCK = "Sperren";
const BTN_TITLE_UNBLOCK = "Freigeben";
const BTN_TITLE_DELETE = "Löschen";

const BASE_PROPS = {
    postId: MOCK_POST_ID,
    title: MOCK_TITLE,
    description: MOCK_DESCRIPTION,
    imageUrl: MOCK_IMAGE_URL,
    profile: MOCK_PROFILE,
    countries: MOCK_COUNTRIES,
    link: MOCK_LINK,
};

describe("PostCard Component", () => {
    beforeAll(() => {
        // Mockt die native DOM-Funktion für Dialoge, die in Testumgebungen oft fehlt
        HTMLDialogElement.prototype.showModal = vi.fn();
    });

    beforeEach(() => {
        vi.clearAllMocks();
        mockLocationPathname = "/";
    });

    it("renders basic post information correctly", () => {
        render(<PostCard {...BASE_PROPS} />);

        expect(screen.getByText(MOCK_TITLE)).toBeInTheDocument();
        expect(screen.getByText(MOCK_DESCRIPTION)).toBeInTheDocument();
        expect(screen.getByText(`@${MOCK_PROFILE.display_name}`)).toBeInTheDocument();
        expect(screen.getByTestId("flag-DE")).toBeInTheDocument();

        expect(screen.queryByTitle(BTN_TITLE_BLOCK)).not.toBeInTheDocument();
        expect(screen.queryByTitle(BTN_TITLE_UNBLOCK)).not.toBeInTheDocument();
        expect(screen.queryByTitle(BTN_TITLE_DELETE)).not.toBeInTheDocument();
    });

    it("applies blocked styles and warning when isBlocked is true", () => {
        render(<PostCard {...BASE_PROPS} isBlocked={true} />);

        const titleElement = screen.getByText(TEXT_BLOCKED_WARNING);
        expect(titleElement).toBeInTheDocument();

        const cardContainer = screen.getByText(MOCK_DESCRIPTION).closest(".card");
        expect(cardContainer).toHaveClass("opacity-70", "grayscale");
    });

    it("renders admin block button and opens modal when clicked", async () => {
        const user = userEvent.setup();
        render(<PostCard {...BASE_PROPS} isAdmin={true} isBlocked={false} />);

        const blockButton = screen.getByTitle(BTN_TITLE_BLOCK);
        expect(blockButton).toBeInTheDocument();

        await user.click(blockButton);
        expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
    });

    it("renders admin unblock button and opens modal when clicked", async () => {
        const user = userEvent.setup();
        render(<PostCard {...BASE_PROPS} isAdmin={true} isBlocked={true} />);

        const unblockButton = screen.getByTitle(BTN_TITLE_UNBLOCK);
        expect(unblockButton).toBeInTheDocument();

        await user.click(unblockButton);
        expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
    });

    it("renders privacy toggle and delete button on profile page", async () => {
        const user = userEvent.setup();
        mockLocationPathname = `/profile/${MOCK_PROFILE.id}`;

        render(<PostCard {...BASE_PROPS} isPrivate={false} />);

        const privacyButtonContainer = screen.getByText(MOCK_TITLE).parentElement?.querySelector('.tooltip');
        expect(privacyButtonContainer).toHaveAttribute("data-tip", TOOLTIP_PUBLIC);

        const deleteButton = screen.getByTitle(BTN_TITLE_DELETE);
        expect(deleteButton).toBeInTheDocument();

        await user.click(deleteButton);
        expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
    });

    it("shows correct tooltip when post is private on profile page", () => {
        mockLocationPathname = `/profile/${MOCK_PROFILE.id}`;

        render(<PostCard {...BASE_PROPS} isPrivate={true} />);

        const privacyButtonContainer = screen.getByText(MOCK_TITLE).parentElement?.querySelector('.tooltip');
        expect(privacyButtonContainer).toHaveAttribute("data-tip", TOOLTIP_PRIVATE);
    });
});