import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { SubPost } from "./SubPost";
import { updateSubPost, deleteSubPostImage, getSubPostById, addSubPostImage } from "../../api/subposts";
import { uploadPostImage } from "../../api/posts";
import type { SubPost as SubPostType } from "../../api/supabaseClient";

vi.mock("swiper/react", () => ({
    Swiper: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-swiper">{children}</div>,
    SwiperSlide: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-swiper-slide">{children}</div>,
}));

vi.mock("swiper/modules", () => ({
    Navigation: {},
}));

vi.mock("../../api/subposts", () => ({
    updateSubPost: vi.fn(),
    deleteSubPostImage: vi.fn(),
    getSubPostById: vi.fn(),
    addSubPostImage: vi.fn(),
}));

vi.mock("../../api/posts", () => ({
    uploadPostImage: vi.fn(),
}));

vi.mock("./EditField", () => ({
    default: ({ value, onChange, placeholderValue, onEditStateChange }: any) => (
        <div>
            <input
                data-testid={`mock-edit-${placeholderValue}`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <button
                data-testid={`trigger-edit-${placeholderValue}`}
                onClick={() => onEditStateChange?.(true)}
            >
                Edit
            </button>
        </div>
    )
}));

vi.mock("../modals/DeleteSubpostModal", () => ({
    default: ({ subPostId }: { subPostId: number }) => <dialog id={`delete-subpost-modal-${subPostId}`} />
}));

vi.mock("../modals/DeleteImageModal", () => ({
    default: ({ imageId, onConfirm }: any) => (
        <dialog id={`delete-image-modal-${imageId}`}>
            <button data-testid={`confirm-delete-img-${imageId}`} onClick={onConfirm}>
                Bestätigen
            </button>
        </dialog>
    )
}));

const MOCK_SUBPOST_ID = 1;
const MOCK_TITLE = "Test Subpost Titel";
const MOCK_CONTENT = "Test Subpost Inhalt";
const MOCK_IMAGE_ID = 10;
const MOCK_IMAGE_URL = "http://example.com/test.jpg";
const CONTAINER_CLASS = "test-class";

const PLACEHOLDER_TITLE = "Titel Subpost";
const PLACEHOLDER_CONTENT = "Beschreibung Subpost";
const BTN_TITLE_DELETE = "Löschen";

const MOCK_SUBPOST_FULL = {
    id: MOCK_SUBPOST_ID,
    title: MOCK_TITLE,
    content: MOCK_CONTENT,
    sub_post_images: [{ id: MOCK_IMAGE_ID, image_url: MOCK_IMAGE_URL }],
} as unknown as SubPostType;

const MOCK_SUBPOST_EMPTY = {
    id: 2,
    title: "",
    content: "",
    sub_post_images: [],
} as unknown as SubPostType;

describe("SubPost Component", () => {
    beforeAll(() => {
        HTMLDialogElement.prototype.showModal = vi.fn();
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns null if the subpost is empty and belongs to another user", () => {
        const { container } = render(
            <SubPost
                subPost={MOCK_SUBPOST_EMPTY}
                containerClass={CONTAINER_CLASS}
                postBelongsToCurrentUser={false}
            />
        );

        expect(container).toBeEmptyDOMElement();
    });

    it("renders read-only content if it belongs to another user", () => {
        render(
            <SubPost
                subPost={MOCK_SUBPOST_FULL}
                containerClass={CONTAINER_CLASS}
                postBelongsToCurrentUser={false}
            />
        );

        expect(screen.getByText(MOCK_TITLE)).toBeInTheDocument();
        expect(screen.getByText(MOCK_CONTENT)).toBeInTheDocument();
        expect(screen.queryByTestId(`mock-edit-${PLACEHOLDER_TITLE}`)).not.toBeInTheDocument();
        expect(screen.queryByTitle(BTN_TITLE_DELETE)).not.toBeInTheDocument();
    });

    it("renders edit fields and action buttons if it belongs to the current user", () => {
        render(
            <SubPost
                subPost={MOCK_SUBPOST_FULL}
                containerClass={CONTAINER_CLASS}
                postBelongsToCurrentUser={true}
                onDelete={vi.fn()}
            />
        );

        expect(screen.getByTestId(`mock-edit-${PLACEHOLDER_TITLE}`)).toBeInTheDocument();
        expect(screen.getByTestId(`mock-edit-${PLACEHOLDER_CONTENT}`)).toBeInTheDocument();
        expect(screen.getAllByTitle(BTN_TITLE_DELETE).length).toBeGreaterThan(0);
    });

    it("updates the title when the EditField triggers a change", async () => {
        const user = userEvent.setup();
        const NEW_TITLE = "Neuer Titel";

        render(
            <SubPost
                subPost={MOCK_SUBPOST_FULL}
                containerClass={CONTAINER_CLASS}
                postBelongsToCurrentUser={true}
            />
        );

        const titleInput = screen.getByTestId(`mock-edit-${PLACEHOLDER_TITLE}`);
        await user.clear(titleInput);
        await user.type(titleInput, NEW_TITLE);

        expect(updateSubPost).toHaveBeenCalledWith(MOCK_SUBPOST_ID, { title: NEW_TITLE });
    });

    it("opens the delete subpost modal when the delete button is clicked", async () => {
        const user = userEvent.setup();

        render(
            <SubPost
                subPost={MOCK_SUBPOST_FULL}
                containerClass={CONTAINER_CLASS}
                postBelongsToCurrentUser={true}
                onDelete={vi.fn()}
            />
        );

        const deleteButton = screen.getByTitle(BTN_TITLE_DELETE);
        await user.click(deleteButton);

        expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
    });

    it("uploads a new image and refreshes the subpost state", async () => {
        const user = userEvent.setup();
        const NEW_IMAGE_URL = "http://example.com/new.jpg";
        const file = new File(["hello"], "hello.png", { type: "image/png" });

        (uploadPostImage as any).mockResolvedValue(NEW_IMAGE_URL);
        (getSubPostById as any).mockResolvedValue({
            ...MOCK_SUBPOST_FULL,
            sub_post_images: [
                ...MOCK_SUBPOST_FULL.sub_post_images,
                { id: 99, image_url: NEW_IMAGE_URL }
            ]
        });

        render(
            <SubPost
                subPost={MOCK_SUBPOST_FULL}
                containerClass={CONTAINER_CLASS}
                postBelongsToCurrentUser={true}
            />
        );

        const fileInput = document.querySelector(`input[type="file"]`) as HTMLInputElement;
        await user.upload(fileInput, file);

        expect(uploadPostImage).toHaveBeenCalledWith(file);
        expect(addSubPostImage).toHaveBeenCalledWith(MOCK_SUBPOST_ID, NEW_IMAGE_URL);

        await waitFor(() => {
            expect(getSubPostById).toHaveBeenCalledWith(MOCK_SUBPOST_ID);
        });
    });

    it("deletes an image and refreshes the subpost state when confirmed", async () => {
        const user = userEvent.setup();
        (getSubPostById as any).mockResolvedValue(MOCK_SUBPOST_EMPTY);

        render(
            <SubPost
                subPost={MOCK_SUBPOST_FULL}
                containerClass={CONTAINER_CLASS}
                postBelongsToCurrentUser={true}
            />
        );

        const confirmButton = screen.getByTestId(`confirm-delete-img-${MOCK_IMAGE_ID}`);
        await user.click(confirmButton);

        expect(deleteSubPostImage).toHaveBeenCalledWith(MOCK_IMAGE_ID);
        expect(deleteSubPostImage).toHaveBeenCalledTimes(1);
        expect(getSubPostById).toHaveBeenCalledWith(MOCK_SUBPOST_ID);
    });

    it("calls onEditStateChange when triggered by an EditField", async () => {
        const user = userEvent.setup();
        const mockOnEditStateChange = vi.fn();

        render(
            <SubPost
                subPost={MOCK_SUBPOST_FULL}
                containerClass={CONTAINER_CLASS}
                postBelongsToCurrentUser={true}
                onEditStateChange={mockOnEditStateChange}
            />
        );

        const editButton = screen.getByTestId(`trigger-edit-${PLACEHOLDER_TITLE}`);
        await user.click(editButton);

        expect(mockOnEditStateChange).toHaveBeenCalledWith(true);
    });
});