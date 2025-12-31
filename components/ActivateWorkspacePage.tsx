"use client";

import { useState, useEffect } from "react";
import { Shield, Mail, Lock, Hash, Eye, EyeOff, ArrowRight } from "lucide-react";
import AnimatedAlert from "@/components/AnimatedAlert";
import Link from "next/link";

/* ---------------- Types ---------------- */
interface FormType {
  identityId: string;
  email: string;
  password: string;
}

interface ErrorType {
  identityId?: string;
  email?: string;
  password?: string;
}

/* ---------------- Page ---------------- */
export default function ActivateWorkspacePage() {
  const [form, setForm] = useState<FormType>({
    identityId: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<ErrorType>({});
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info" | "warning";
    message: string;
  } | null>(null);

  const [submitted, setSubmitted] = useState(false); // track if user tried to submit

  /* ---------------- Helpers ---------------- */
  const getInputBg = (value: string) =>
    value ? "bg-[#0E1A33]" : "bg-gray-800/20";

  /* ---------------- Validation ---------------- */
  const validateField = (key: keyof FormType, value: string) => {
    let error = "";

    switch (key) {
      case "identityId":
        if (value && !/^DM-\w{4}-\w{4}$/i.test(value)) {
          error = "Invalid Identity ID format.";
        }
        break;

      case "email":
        if (!form.identityId) {
          if (!value) error = "Email is required.";
          else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
            error = "Enter a valid email.";
        }
        break;

      case "password":
        if (!value) error = "Password is required.";
        else if (value.length < 6)
          error = "Password must be at least 6 characters.";
        break;
    }

    setErrors((prev) => ({ ...prev, [key]: error }));
  };

  const handleChange = (key: keyof FormType, value: string) => {
    setForm({ ...form, [key]: value });
    if (submitted) validateField(key, value); // only validate while typing if form was submitted
  };

  /* ---------------- Submit ---------------- */
  const handleSubmit = () => {
    setSubmitted(true); // mark form as submitted

    // validate all fields on submit
    Object.keys(form).forEach((key) =>
      validateField(key as keyof FormType, form[key as keyof FormType])
    );

    if (!form.identityId && !form.email) {
      setAlert({
        type: "error",
        message: "Provide either an AI Identity ID or a Work Email.",
      });
      return;
    }

    if (Object.values(errors).some(Boolean)) {
      setAlert({
        type: "error",
        message: "Please resolve the errors before proceeding.",
      });
      return;
    }

    setAlert({
      type: "success",
      message: "Workspace session activated successfully.",
    });

    console.log("Activated:", form);
  };

  /* ---------------- Auto Close Alert ---------------- */
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  /* ---------------- Render ---------------- */
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black px-4 sm:px-6">
      <div className="w-full max-w-md sm:max-w-[420px] md:max-w-[480px] rounded-2xl bg-black border border-[#1B2336] shadow-[0_0_40px_rgba(0,0,0,0.8)] p-5 sm:p-6 md:p-7 text-white relative">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-5 sm:mb-6">
          <div className="w-14 h-13 sm:w-15 sm:h-14 rounded-xl bg-[#0E1A33] flex items-center justify-center border border-[#1E2A45]">
            <Shield className="text-[#3B82F6]" size={26} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold pt-2 text-center">
            Activate Workspace
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 text-center max-w-xs">
            Enter your AI Identity ID or Work Email to unlock the knowledge
            vault.
          </p>
        </div>

        {/* AI Identity ID */}
        <Field
          icon={<Hash size={16} />}
          label="AI IDENTITY ID"
          placeholder="IDM-XXXX-XXXX"
          value={form.identityId}
          onChange={(v) => handleChange("identityId", v)}
          bgColor={getInputBg(form.identityId)}
          helper="(Optional if using Work Email)"
          error={errors.identityId}
        />

        {/* OR */}
        <div className="flex items-center gap-3 my-4 sm:my-5">
          <div className="h-px flex-1 bg-[#1E2A45]" />
          <span className="text-[10px] sm:text-xs text-gray-500 font-semibold">
            OR
          </span>
          <div className="h-px flex-1 bg-[#1E2A45]" />
        </div>

        {/* Email */}
        <Field
          icon={<Mail size={16} />}
          label="WORK EMAIL"
          placeholder="info@subventa.com"
          value={form.email}
          onChange={(v) => handleChange("email", v)}
          bgColor={getInputBg(form.email)}
          error={errors.email}
        />

        {/* Password */}
        <div className="mb-5 sm:mb-6">
          <label className="text-[11px] sm:text-xs text-gray-300 mb-1.5 block font-semibold">
            PASSWORD
          </label>

          <div className="flex items-center gap-2 border border-[#1E2A45] rounded-lg px-3 h-11 sm:h-12 bg-gray-800/20">
            <Lock size={16} className="text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Enter password"
              className="bg-transparent w-full outline-none text-sm text-white placeholder-gray-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-300"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {errors.password && (
            <p className="text-[11px] text-blue-400 mt-1 italic">
              {errors.password}
            </p>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={handleSubmit}
          className="w-full h-11 sm:h-12 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] transition font-medium font-semibold flex items-center justify-center gap-2"
        >
          Activate Session <ArrowRight className="w-4 h-4" />
        </button>

        <Link href="/request">
          <p className="text-center text-[11px] sm:text-xs text-gray-400 mt-4 cursor-pointer hover:text-gray-300">
            I DON’T HAVE AN IDENTITY
          </p>
        </Link>

        {/* Alert */}
        {alert && (
          <AnimatedAlert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}
      </div>
    </div>
  );
}

/* ---------------- Reusable Field ---------------- */
interface FieldProps {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  helper?: string;
  bgColor?: string;
  error?: string;
}

function Field({
  icon,
  label,
  placeholder,
  value,
  onChange,
  helper,
  bgColor,
  error,
}: FieldProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[11px] sm:text-xs text-gray-300 font-semibold">
          {label}
        </label>

        {helper && (
          <span className="text-[10px] sm:text-[11px] text-gray-500 italic">
            {helper}
          </span>
        )}
      </div>
      <div
        className={`
          flex items-center gap-2 rounded-lg px-3 h-11 sm:h-12
          border ${value ? "border-blue-500" : "border-[#1E2A45]"} 
          bg-gray-800/20
          focus-within:border-blue-500
          transition-colors
        `}
      >
        <span className="text-gray-400">{icon}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent w-full outline-none text-sm text-white placeholder-gray-500"
        />
      </div>

      {error && (
        <p className="text-[11px] text-blue-400 mt-1 italic">{error}</p>
      )}
    </div>
  );
}
