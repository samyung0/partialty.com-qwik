import * as exports from "~/utils/protectedRoutes";
import { checkProtectedPath } from "~/utils/redirect";

vi.spyOn(exports, "protectedRoutes", "get").mockReturnValue([
  {
    path: "/a/",
    authRolesPermitted: [],
    redirectTo: "/b",
    exact: true,
  },
  {
    path: "/b/",
    authRolesPermitted: ["admin"],
    redirectTo: "/c",
  },
]);

describe("testing redirect", () => {
  it("No Role - /a/ - no redirect", () => {
    expect(checkProtectedPath("/a/", "")).toSatisfy(([redirect] : [boolean]) => !redirect);
  });
  it("Paid Role - /a/ - redirect to /b", () => {
    const a = new URLSearchParams();
    a.append("redirectedFrom", "/a/");
    expect(checkProtectedPath("/a/", "paid")).toStrictEqual([true, "/b", a]);
  });
  it("No Role - /a - no redirect", () => {
    expect(checkProtectedPath("/a", "")).toSatisfy(([redirect] : [boolean]) => !redirect);
  });
  it("Paid Role - /a - redirect to /b", () => {
    const a = new URLSearchParams();
    a.append("redirectedFrom", "/a");
    expect(checkProtectedPath("/a", "paid")).toStrictEqual([true, "/b", a]);
  });
  it("Admin Role - /b - no redirect", () => {
    expect(checkProtectedPath("/b", "admin")).toSatisfy(([redirect] : [boolean]) => !redirect);
  });
  it("Paid Role - /b - redirect to /c", () => {
    const a = new URLSearchParams();
    a.append("redirectedFrom", "/b");
    expect(checkProtectedPath("/b", "paid")).toStrictEqual([true, "/c", a]);
  });
  it("No Role - /b - redirect to /c", () => {
    const a = new URLSearchParams();
    a.append("redirectedFrom", "/b");
    expect(checkProtectedPath("/b", "")).toStrictEqual([true, "/c", a]);
  });
  it("Admin Role - /b/d - no redirect", () => {
    expect(checkProtectedPath("/b/d", "admin")).toSatisfy(([redirect] : [boolean]) => !redirect);
  });
  it("Paid Role - /b/d - redirect to /c", () => {
    const a = new URLSearchParams();
    a.append("redirectedFrom", "/b/d");
    expect(checkProtectedPath("/b/d", "paid")).toStrictEqual([true, "/c", a]);
  });
  it("No Role - /b/d - redirect to /c", () => {
    const a = new URLSearchParams();
    a.append("redirectedFrom", "/b/d");
    expect(checkProtectedPath("/b/d", "")).toStrictEqual([true, "/c", a]);
  });
  it("Admin Role - /d/b - no redirect", () => {
    expect(checkProtectedPath("/d/b", "admin")).toSatisfy(([redirect] : [boolean]) => !redirect);
  });
  it("No Role - /d/b - no redirect", () => {
    expect(checkProtectedPath("/d/b", "")).toSatisfy(([redirect] : [boolean]) => !redirect);
  });
});
