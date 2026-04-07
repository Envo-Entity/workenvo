"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import DashboardHeader from "./header";
import styles from "../dashboard.module.css";

type Integration = {
  name: string;
  description: string;
  logo: StaticImageData;
  logoClassName?: string;
};

type IntegrationsShellProps = {
  integrations: Integration[];
};

type ToastState = {
  id: number;
  title: string;
  message: string;
};

export default function IntegrationsShell({
  integrations,
}: IntegrationsShellProps) {
  const [connectingTool, setConnectingTool] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleConnect = (toolName: string) => {
    setConnectingTool(toolName);

    window.setTimeout(() => {
      setConnectingTool(null);

      const nextToast = {
        id: Date.now(),
        title: `${toolName} connected`,
        message: `${toolName} is now ready to sync with Workenvo.`,
      };

      setToast(nextToast);

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setToast((currentToast) =>
          currentToast?.id === nextToast.id ? null : currentToast,
        );
      }, 2600);
    }, 900);
  };

  return (
    <div className="space-y-8">
      <DashboardHeader
        tag="Connected Systems"
        title="Integrations"
        ctaSecondary=""
        ctaPrimary=""
      />

      {toast ? (
        <div className="sticky top-6 z-30 flex justify-center">
          <div
            className={`w-full max-w-2xl rounded-[1.75rem] bg-white px-5 py-4 ${styles.ambientShadow}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#008454]" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[#1c1b1b]">
                  {toast.title}
                </p>
                <p className="text-sm text-[#3e4941]">{toast.message}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <section className="rounded-[2rem] bg-white p-8 md:p-10">
        <div className="max-w-2xl space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#006841]/70">
            Integration Hub
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-[#1c1b1b]">
            Connect your tools
          </h2>
          <p className="text-sm leading-7 text-[#3e4941]">
            Bring your HRIS, CRM, and revenue systems into Workenvo so your
            signals and scorecards reflect the tools your teams already use
            every day.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {integrations.map((integration) => {
            const isConnecting = connectingTool === integration.name;

            return (
              <article
                key={integration.name}
                className="flex min-h-[280px] flex-col justify-between rounded-[1.75rem] bg-[#f6f3f2] p-6"
              >
                <div className="space-y-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[1.1rem] bg-white">
                    <Image
                      src={integration.logo}
                      alt={`${integration.name} logo`}
                      className={`h-7 w-7 object-contain ${integration.logoClassName ?? ""}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold tracking-tight text-[#1c1b1b]">
                      {integration.name}
                    </h3>
                    <p className="text-sm leading-7 text-[#3e4941]">
                      {integration.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleConnect(integration.name)}
                  disabled={isConnecting}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#008454] px-4 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01] disabled:cursor-wait disabled:opacity-90"
                >
                  {isConnecting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                      Connecting...
                    </>
                  ) : (
                    "Connect"
                  )}
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
