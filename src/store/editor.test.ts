import { beforeEach, describe, expect, it } from "vitest";
import { useEditor } from "./editor";

describe("editor navigation", () => {
  beforeEach(() => {
    useEditor.setState({
      tab: "sections",
      selected: null,
      activeSection: "hero",
      panelOpen: false,
    });
  });

  it("routes hero text selection to the section editor", () => {
    useEditor.getState().select("hero.title");

    expect(useEditor.getState().tab).toBe("sections");
    expect(useEditor.getState().activeSection).toBe("hero");
  });

  it("routes brand, product, and global style selections to their own workspaces", () => {
    useEditor.getState().select("brand.logo");
    expect(useEditor.getState().tab).toBe("brand");

    useEditor.getState().select("product.tee.name");
    expect(useEditor.getState().tab).toBe("content");
    expect(useEditor.getState().activeSection).toBe("arrivals");

    useEditor.getState().select("home.newArrivalsTitle");
    expect(useEditor.getState().tab).toBe("content");

    useEditor.getState().select("footer.social");
    expect(useEditor.getState().tab).toBe("styles");
  });
});
