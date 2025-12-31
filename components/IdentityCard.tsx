"use client";

/* =====================================================
   Imports
===================================================== */
import { useState, useEffect, useRef } from "react";
import {
  Shield,
  User,
  Mail,
  Lock,
  Fingerprint,
  Building2,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react";
import AnimatedAlert from "@/components/AnimatedAlert";
import Link from "next/link";

/* =====================================================
   Types & Interfaces
===================================================== */

// Main form state structure
interface FormType {
  name: string;
  email: string;
  password: string;
  orgCode: string;
  organization: string;
  role: string;
}

// Error object (key = field name, value = error message)
interface ErrorType {
  [key: string]: string;
}

// Password strength indicator type
interface PasswordStrength {
  label: "WEAK" | "MEDIUM" | "STRONG";
  bars: number;
  color: string;
}

/* =====================================================
   Password Strength Helper
===================================================== */
function getPasswordStrength(password: string): PasswordStrength | null {
  // No password → no strength indicator
  if (!password) return null;

  let score = 0;

  // Basic password checks
  if (password.length >= 6) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  // Return strength object based on score
  if (score <= 1) return { label: "WEAK", bars: 1, color: "bg-red-500" };
  if (score === 2 || score === 3)
    return { label: "MEDIUM", bars: 3, color: "bg-yellow-500" };

  return { label: "STRONG", bars: 4, color: "bg-green-500" };
}

/* =====================================================
   Main Component
===================================================== */
export default function IdentityCard() {
  /* ---------------- UI State ---------------- */
  const [showPassword, setShowPassword] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  /* ---------------- Refs ---------------- */
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ---------------- Form State ---------------- */
  const [form, setForm] = useState<FormType>({
    name: "",
    email: "",
    password: "",
    orgCode: "",
    organization: "",
    role: "",
  });

  /* ---------------- Error State ---------------- */
  const [errors, setErrors] = useState<ErrorType>({
    name: "",
    email: "",
    password: "",
    orgCode: "",
    organization: "",
    role: "",
  });

  /* ---------------- Submission & Alerts ---------------- */
  const [submitted, setSubmitted] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info" | "warning";
    message: string;
  } | null>(null);

  /* =====================================================
     Close dropdown when clicking outside
  ===================================================== */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- Derived Password Strength ---------------- */
  const strength = getPasswordStrength(form.password);

  /* =====================================================
     Handle Field Changes
  ===================================================== */
  const handleChange = (key: keyof FormType, value: string) => {
    // Update form state
    setForm((prev) => ({ ...prev, [key]: value }));

    // If already submitted → validate live
    if (submitted) {
      validateField(key, value);
    } else {
      // Otherwise clear error while typing
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  /* =====================================================
     Single Field Validation
  ===================================================== */
  const validateField = (key: keyof FormType, value: string) => {
    let error = "";

    switch (key) {
      case "name":
        if (!value.trim()) error = "Name is required.";
        else if (!/^[A-Za-z\s]{2,}$/.test(value))
          error = "Enter a valid name (letters only).";
        break;

      case "email":
        if (!value.trim()) error = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Enter a valid email.";
        break;

      case "password":
        if (!value) error = "Password is required.";
        else if (value.length < 6) error = "Password must be at least 6 chars.";
        else if (!/[A-Z]/.test(value))
          error = "Password must include at least one uppercase letter.";
        else if (!/[0-9]/.test(value))
          error = "Password must include at least one number.";
        break;

      case "orgCode":
        if (!value.trim()) error = "Org code is required.";
        else if (!/^\d{6}$/.test(value)) error = "Org code must be 6 digits.";
        break;

      case "role":
        if (!["User", "Admin"].includes(value))
          error = "Role must be User or Admin.";
        break;
    }

    setErrors((prev) => ({ ...prev, [key]: error }));
  };

  /* =====================================================
     Guideline (Live Hint While Typing)
  ===================================================== */
  const getGuideline = (key: keyof FormType, value: string) => {
    if (!value) return "";

    switch (key) {
      case "name":
        if (!/^[A-Za-z\s]+$/.test(value))
          return "Enter valid name (letters only).";
        break;

      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Enter a valid email address.";
        break;

      case "password":
        if (value.length < 6) return "Minimum 6 characters required.";
        if (!/[A-Z]/.test(value))
          return "Include at least one uppercase letter.";
        if (!/[0-9]/.test(value)) return "Include at least one number.";
        break;

      case "orgCode":
        if (!/^\d{6}$/.test(value)) return "Org code must be exactly 6 digits.";
        break;
    }

    return "";
  };

  /* =====================================================
     Submit Handler
  ===================================================== */
  const handleSubmit = () => {
    setSubmitted(true);

    // Validate all fields
    Object.keys(form).forEach((key) =>
      validateField(key as keyof FormType, form[key as keyof FormType])
    );

    // Required fields list
    const requiredFields: (keyof FormType)[] = [
      "name",
      "email",
      "password",
      "orgCode",
      "role",
    ];

    // Check for invalid required fields
    const invalidFields = requiredFields.filter((f) => {
      const value = form[f];
      return !value || getGuideline(f, value) !== "";
    });

    // Show error alert if invalid
    if (invalidFields.length > 0) {
      setAlert({
        type: "error",
        message: "Please fill all required fields correctly before proceeding.",
      });
      return;
    }

    // Success alert
    setAlert({
      type: "success",
      message: "AI Identity created successfully!",
    });

    console.log("Form Submitted:", form);
  };

  /* =====================================================
     Auto-dismiss Alert
  ===================================================== */
  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => setAlert(null), 3000);
    return () => clearTimeout(timer);
  }, [alert]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#030711] px-4 sm:px-6">
      <div className="w-full max-w-md sm:max-w-[420px] md:max-w-[560px] rounded-2xl bg-[#030711] border border-[#18181B] shadow-[0_0_40px_rgba(0,0,0,0.8)] p-5 sm:p-6 md:p-7 text-white relative">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-3">
          <div className="w-14 h-13 sm:w-15 sm:h-14 rounded-xl bg-[#0E1A33] flex items-center justify-center border border-[#1E2A45]">
            <Shield className="text-[#3B82F6]" size={26} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold pt-2">
            Request Identity
          </h1>
          <p className="text-sm text-gray-400 text-center">
            Enroll in the private AI cluster of your organization.
          </p>
        </div>

        <Field
          icon={<User size={16} />}
          label="Full Name"
          placeholder="John Doe"
          value={form.name}
          onChange={(v) => handleChange("name", v)}
          error={errors.name}
          guideline={getGuideline("name", form.name)}
          submitted={submitted}
          required
        />

        <Field
          icon={<Mail size={16} />}
          label="Work Email"
          placeholder="info@subventa.com"
          value={form.email}
          onChange={(v) => handleChange("email", v)}
          error={errors.email}
          guideline={getGuideline("email", form.email)}
          submitted={submitted}
          required
        />

        {/* Password */}
        <div className="mb-4">
          <label className="text-xs text-gray-300 mb-1.5 block font-semibold">
            Secure Password <span className="text-[#2563EB]">*</span>
            {strength && (
              <span
                className={`float-right text-[11px] font-bold ${
                  strength.color === "bg-red-500"
                    ? "text-red-500"
                    : strength.color === "bg-yellow-500"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                {strength.label}
              </span>
            )}
          </label>

          <div
            className={`flex items-center gap-2 border rounded-lg px-3 h-12 ${
              errors.password && submitted
                ? "border-red-500"
                : form.password
                ? "bg-[#0E1A33] border-blue-500"
                : "bg-[#16181D] border-[#1E2A45]"
            }`}
          >
            <Lock size={16} className="text-gray-400" />

            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Enter password"
              className="bg-transparent w-full outline-none text-sm text-white placeholder-gray-500 font-semibold"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-gray-400 hover:text-white transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {errors.password && submitted && (
            <p className="text-[11px] text-red-500 mt-1 italic">
              {errors.password}
            </p>
          )}

          {!errors.password && form.password && (
            <p className="text-[11px] text-gray-400 mt-1 italic">
              {getGuideline("password", form.password)}
            </p>
          )}

          {/* Strength Bars */}
          {strength && (
            <div className="flex gap-1 mt-2 text-xs">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full ${
                    i <= strength.bars ? strength.color : "bg-gray-700"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <Field
          icon={<Fingerprint size={16} />}
          label="Organization Personality Code"
          placeholder="233665"
          value={form.orgCode}
          onChange={(v) => handleChange("orgCode", v)}
          error={errors.orgCode}
          guideline={getGuideline("orgCode", form.orgCode)}
          submitted={submitted}
          required
        />
        <p className="text-[10px] text-gray-500 -mt-3.5 mb-4 italic font-semibold">
          Unique signature defining your AI’s behavioral constraints.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <Field
            icon={<Building2 size={16} />}
            label="Organization"
            placeholder="Acme"
            value={form.organization}
            onChange={(v) => handleChange("organization", v)}
            error={errors.organization}
          />

          {/* Role Dropdown */}
          <div className="mb-4 relative" ref={dropdownRef}>
            <label className="text-xs text-gray-300 mb-1.5 block font-semibold">
              Role <span className="text-[#2563EB]">*</span>
            </label>

            <div
              className={`flex items-center justify-between h-12 px-3 rounded-lg cursor-pointer ${
                errors.role && submitted
                  ? "border border-red-500 bg-gray-800/20"
                  : form.role
                  ? "border border-blue-500 bg-[#0E1A33]"
                  : "border border-[#1E2A45] bg-gray-800/20"
              }`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="text-sm">{form.role || "Select Role"}</span>
              <ChevronDown size={16} className="text-gray-400" />
            </div>

            {dropdownOpen && (
              <ul className="absolute w-full mt-1 bg-gray-800 border border-[#1E2A45] rounded-lg z-10">
                {["User", "Admin"].map((role) => (
                  <li
                    key={role}
                    onClick={() => {
                      handleChange("role", role);
                      setDropdownOpen(false);
                    }}
                    className="px-3 py-2 text-white hover:bg-[#2563EB] cursor-pointer rounded-lg"
                  >
                    {role}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full h-11 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] transition font-medium"
        >
          Create AI Identity
        </button>

        <Link href="/activate/workspace">
          <p className="text-center text-xs text-gray-400 mt-4 cursor-pointer hover:text-gray-300">
            Back to Entry
          </p>
        </Link>

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

/* =====================================================
   Reusable Field Component
===================================================== */
interface FieldProps {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  guideline?: string;
  required?: boolean;
  submitted?: boolean;
}

function Field({
  icon,
  label,
  placeholder,
  value,
  onChange,
  guideline,
  error,
  required,
}: FieldProps) {
  // Border color logic
  const borderColorClass = error
    ? "border-red-500"
    : value
    ? "border-blue-500"
    : "border-[#1E2A45]";

  // Show guideline only when typing & no error
  const showGuideline = value && guideline;

  return (
    <div className="mb-4">
      <label className="text-xs text-gray-300 mb-1.5 block font-semibold">
        {label}
        {required && <span className="text-[#2563EB] ml-1">*</span>}
      </label>

      <div
        className={`flex items-center gap-2 rounded-lg px-3 h-12 border ${borderColorClass} bg-[#16181D] focus-within:border-blue-500 transition-colors`}
      >
        <span className="text-gray-400">{icon}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent w-full outline-none text-sm text-white placeholder-gray-500"
        />
      </div>

      {error && <p className="text-[11px] text-red-500 mt-1 italic">{error}</p>}

      {showGuideline && (
        <p
          className={`text-[11px] mt-1 italic ${
            error ? "text-red-500" : "text-blue-400"
          }`}
        >
          {guideline}
        </p>
      )}
    </div>
  );
}
