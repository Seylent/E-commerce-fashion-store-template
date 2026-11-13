"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useBrand, useConfigStore } from "@/store/config";
import { useEditor } from "@/store/editor";
import { activeTemplate } from "@/config/templates";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { HomeView } from "@/components/HomeView";
import { LeftNav, MobileNav } from "./LeftNav";
import { RightPanel } from "./RightPanel";
import { StudioTopBar } from "./StudioTopBar";
import { SubmissionModal } from "./SubmissionModal";
import { getPreviewScale, PREVIEW_FRAME_SIZE } from "./previewScale";
import { loadConfigDraft, saveConfigDraft } from "@/lib/configDraft";
import "./configurator.css";

type DraftStatus = "loading" | "saving" | "saved" | "error";

export function ConfiguratorApp() {
  const config      = useBrand();
  const editMode    = useEditor((s) => s.editMode);
  const device      = useEditor((s) => s.device);
  const setActive   = useEditor((s) => s.setActive);
  const submissionOpen = useEditor((s) => s.submissionOpen);
  const canvasRef = useRef<HTMLElement>(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [draftStatus, setDraftStatus] = useState<DraftStatus>("loading");
  const [draftReady, setDraftReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    let saveTimer: number | undefined;
    let unsubscribe: (() => void) | undefined;

    const startSaving = () => {
      unsubscribe = useConfigStore.subscribe((state, previous) => {
        if (state.config === previous.config) return;
        setDraftStatus("saving");
        window.clearTimeout(saveTimer);
        saveTimer = window.setTimeout(() => {
          void saveConfigDraft(state.config)
            .then(() => { if (mounted) setDraftStatus("saved"); })
            .catch(() => { if (mounted) setDraftStatus("error"); });
        }, 450);
      });
    };

    void loadConfigDraft().then((draft) => {
      if (!mounted) return;
      if (draft) useConfigStore.setState({ config: draft, past: [], future: [], pendingSnapshot: undefined });
      setDraftStatus("saved");
      setDraftReady(true);
      startSaving();
    }).catch(() => {
      if (!mounted) return;
      setDraftStatus("error");
      setDraftReady(true);
      startSaving();
    });

    return () => {
      mounted = false;
      window.clearTimeout(saveTimer);
      unsubscribe?.();
    };
  }, []);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new ResizeObserver(([entry]) => {
      setPreviewScale(getPreviewScale(entry.contentRect.width, entry.contentRect.height));
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setActive(true);
    return () => {
      setActive(false);
      useEditor.setState({ selected: null, submissionOpen: false });
    };
  }, [setActive]);

  useEffect(() => {
    const icon = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
    if (!icon || !config.favicon) return;
    const originalHref = icon.href;
    icon.href = config.favicon;
    return () => { icon.href = originalHref; };
  }, [config.favicon]);

  const themeStyle = useMemo(() => ({
    "--background":             config.colors.background,
    "--surface":                config.colors.surface,
    "--text":                   config.colors.text,
    "--muted":                  config.colors.muted,
    "--border":                 config.colors.border,
    "--accent":                 config.colors.accent,
    "--font-body":              config.typography.body,
    "--font-display":           config.typography.display,
    "--product-columns":        config.home.desktopColumns ?? 4,
    "--product-columns-mobile": config.home.mobileColumns ?? 2,
  }) as React.CSSProperties, [config]);

  const isMobile = device !== "desktop";

  if (!draftReady) {
    return <div className="studio-shell studio-draft-loading" role="status" aria-live="polite">Відновлюємо локальну чернетку…</div>;
  }

  return (
    <div className="studio-shell" lang="uk">
      {/* ── Top bar ── */}
      <StudioTopBar draftStatus={draftStatus} />

      {/* ── Body: left nav + canvas + right panel ── */}
      <div className={`studio-body${editMode ? "" : " is-preview"}`}>

        {/* ── Left icon nav ── */}
        {editMode && <LeftNav />}

        {/* ── Canvas ── */}
        <section
          ref={canvasRef}
          className={`studio-canvas${isMobile ? " is-mobile" : ""}`}
          aria-label="Попередній перегляд"
          onClickCapture={(event) => {
            if ((event.target as HTMLElement).closest("#configurator-preview a")) event.preventDefault();
          }}
          onSubmitCapture={(event) => {
            if ((event.target as HTMLElement).closest("#configurator-preview form")) event.preventDefault();
          }}
        >

          {/* Animated gradient background — visible in mobile mode */}
          <div className="studio-canvas-bg" aria-hidden="true" />

          {isMobile ? (
            /* ---- iPhone frame ---- */
            <div
              className="cfg-device-stage"
              style={{
                width: PREVIEW_FRAME_SIZE.width * previewScale,
                height: PREVIEW_FRAME_SIZE.height * previewScale,
              }}
            >
              <div className="cfg-iphone cfg-iphone--mobile-max" style={{ transform: `scale(${previewScale})` }}>
                <div className="cfg-iphone-shell" aria-hidden="true">
                  <div className="cfg-iphone-dynamic-island" />
                  <div className="cfg-iphone-btn-volume-up" />
                  <div className="cfg-iphone-btn-volume-down" />
                  <div className="cfg-iphone-btn-power" />
                  <div className="cfg-iphone-btn-action" />
                </div>
                <div
                  id="configurator-preview"
                  className="storefront cfg-iphone-screen"
                  lang={config.locale.split("-")[0]}
                  style={themeStyle}
                >
                  <Header />
                  <HomeView />
                  <Footer />
                  <CartDrawer />
                </div>
              </div>
            </div>
          ) : (
            /* ---- Desktop fill ---- */
            <div
              id="configurator-preview"
              className="storefront studio-site-layer"
              lang={config.locale.split("-")[0]}
              style={themeStyle}
            >
              <Header />
              <HomeView />
              <Footer />
              <CartDrawer />
            </div>
          )}
        </section>

        {/* ── Right property panel ── */}
        {editMode && <RightPanel />}
      </div>

      {editMode && <MobileNav />}

      {submissionOpen && <SubmissionModal />}
    </div>
  );
}
