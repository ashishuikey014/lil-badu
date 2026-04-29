"use client";

import { useState } from "react";
import type { ActiveTab } from "@/types";
import TabSwitcher from "@/components/shared/TabSwitcher";
import CompressPanel from "@/components/compress/CompressPanel";
import ConvertPanel from "@/components/convert/ConvertPanel";

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("compress");

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8 text-center">
        <h1
          className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
          style={{ fontFamily: "var(--font-brand)" }}
        >
          Compress &amp; Convert Images
        </h1>
        <p className="mt-3 text-base text-text-secondary">
          Fast, free, and private — files never leave your session.
        </p>
      </div>

      <div className="mb-8 flex justify-center">
        <TabSwitcher active={activeTab} onChange={setActiveTab} />
      </div>

      {/* Keep both panels mounted to preserve file state on tab switch */}
      <div className={activeTab === "compress" ? "animate-fade-in" : "hidden"}>
        <CompressPanel />
      </div>
      <div className={activeTab === "convert" ? "animate-fade-in" : "hidden"}>
        <ConvertPanel />
      </div>
    </div>
  );
}
