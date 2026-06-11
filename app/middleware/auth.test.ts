import { describe, it, expect, vi, beforeEach } from "vitest";
import { authGuardMiddleware, guestGuardMiddleware } from "./auth";
import { getUser } from "../../api/auth";
import { redirect } from "react-router";

vi.mock("../../api/auth");
vi.mock("react-router", () => ({
    redirect: vi.fn((path) => new Response(null, { status: 302, headers: { Location: path } })),
}));

describe("auth middleware", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("authGuardMiddleware", () => {
        it("redirects to login when user is not logged in and route is private", async () => {
            vi.mocked(getUser).mockResolvedValue(null);

            await expect(authGuardMiddleware({ pattern: "/admin-page" }))
                .rejects.toEqual(expect.objectContaining({ status: 302 }));

            expect(redirect).toHaveBeenCalledWith("/login");
        });

        it("allows access when user is not logged in and route is public", async () => {
            vi.mocked(getUser).mockResolvedValue(null);

            await expect(authGuardMiddleware({ pattern: "/" })).resolves.not.toThrow();
        });

        it("allows access when user is logged in for any route", async () => {
            vi.mocked(getUser).mockResolvedValue({ id: 1 } as any);

            await expect(authGuardMiddleware({ pattern: "/admin-page" })).resolves.not.toThrow();
        });
    });

    describe("guestGuardMiddleware", () => {
        it("redirects to home when user is already logged in", async () => {
            vi.mocked(getUser).mockResolvedValue({ id: 1 } as any);

            await expect(guestGuardMiddleware())
                .rejects.toEqual(expect.objectContaining({ status: 302 }));

            expect(redirect).toHaveBeenCalledWith("/");
        });

        it("allows access when user is not logged in", async () => {
            vi.mocked(getUser).mockResolvedValue(null);

            await expect(guestGuardMiddleware()).resolves.not.toThrow();
        });
    });
});