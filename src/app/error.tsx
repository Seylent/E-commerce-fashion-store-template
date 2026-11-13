"use client";
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) { return <div className="state-page"><h1>Let&apos;s try that again.</h1><p>We could not load this page.</p><button className="button-dark" onClick={reset}>TRY AGAIN</button></div>; }
