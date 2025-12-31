"use client";

import { Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ActivateIdentityLanding() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#030711] px-4 sm:px-6">
      <div className=" transform scale-80 w-full max-w-md sm:max-w-[420px] md:max-w-[480px] rounded-2xl bg-[#030711] border border-[#18181B] shadow-[0_0_40px_rgba(0,0,0,0.8)] p-6 sm:p-7 md:p-8 text-white">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 mb-7 sm:mb-8">
          <div className="w-12 h-12 sm:w-14 sm:h-13 rounded-xl bg-[#0E1A33] flex items-center justify-center border border-[#1E2A45]">
            <Shield size={26} className="text-[#3B82F6]" />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold pt-2 text-center">
            Activate Your AI Identity
          </h1>

          <p className="text-sm text-gray-400 text-center max-w-sm leading-relaxed">
            Connect to your organization&apos;s private AI knowledge layer
            securely.
          </p>
        </div>

        {/* Primary Action */}
        <button
          onClick={() => router.push("/activate/workspace")}
          className="w-full h-11 sm:h-12 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition mb-4"
        >
          Sign In to Workspace
        </button>

        {/* Secondary Action */}
        <button
          onClick={() => router.push("/request")}
          className="w-full h-11 sm:h-12 rounded-lg bg-gray-800/40 border border-[#1E2A45] text-white font-medium hover:bg-gray-800 transition"
        >
          Request AI Identity
        </button>

        {/* Footer */}
        <p className="text-center text-[10px] tracking-widest text-gray-500 mt-7 sm:mt-8">
          SECURED BY IDMIZE PROTOCOL
        </p>
      </div>
    </div>
  );
}
