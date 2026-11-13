import { beforeEach, describe, expect, it } from "vitest";
import { defaultConfig, useConfigStore } from "./config";

describe("config editor history", () => {
  beforeEach(() => {
    useConfigStore.setState({
      config: structuredClone(defaultConfig),
      past: [],
      future: [],
      pendingSnapshot: undefined,
    });
  });

  it("groups a focused field edit and a committed update into one undo step", () => {
    const store = useConfigStore.getState();
    const originalTitle = store.config.hero.title;

    store.beginEdit();
    store.replace({
      ...store.config,
      hero: { ...store.config.hero, title: "A new title" },
    });
    useConfigStore.getState().commit((config) => ({
      ...config,
      hero: { ...config.hero, shade: 0.75 },
    }));
    useConfigStore.getState().endEdit();

    expect(useConfigStore.getState().past).toHaveLength(1);
    useConfigStore.getState().undo();
    expect(useConfigStore.getState().config.hero.title).toBe(originalTitle);
    expect(useConfigStore.getState().config.hero.shade).toBe(defaultConfig.hero.shade);
  });
});
