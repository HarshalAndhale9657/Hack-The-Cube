"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/content/site-config";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  User,
  Check,
  Loader2,
  Plus,
  Trash2,
  AlertCircle,
  Copy,
  CheckCircle2,
  X,
} from "lucide-react";

/* ═══════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════ */

const API_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwB8mDR7Cqnd-0B0TW3KetC6DP7km13ncj2YCvwnfpyuCvStqDT27V7cPXNl_Y_nEz_/exec";

const TSHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
const YEAR_OPTIONS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "5th Year",
] as const;

/* ═══════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════ */

type RegistrationType = "individual" | "team";

interface MemberData {
  fullName: string;
  email: string;
  phone: string;
  college: string;
  year: string;
  department: string;
}

const EMPTY_MEMBER: MemberData = {
  fullName: "",
  email: "",
  phone: "",
  college: "",
  year: "",
  department: "",
};

/* ═══════════════════════════════════════════════
   Validation Helpers
   ═══════════════════════════════════════════════ */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\d{10}$/;

function validateField(field: string, value: string): string | null {
  const v = value.trim();
  switch (field) {
    case "fullName":
      if (!v) return "Full name is required";
      if (v.length < 2) return "Must be at least 2 characters";
      return null;
    case "email":
      if (!v) return "Email is required";
      if (!EMAIL_RE.test(v)) return "Enter a valid email address";
      return null;
    case "phone": {
      const stripped = v.replace(/[\s\-+]/g, "");
      let normalized = stripped;
      if (normalized.startsWith("91") && normalized.length === 12) {
        normalized = normalized.slice(2);
      } else if (normalized.startsWith("0") && normalized.length === 11) {
        normalized = normalized.slice(1);
      }
      if (!normalized) return "Phone number is required";
      if (!PHONE_RE.test(normalized)) return "Enter a valid 10-digit number";
      return null;
    }
    case "college":
      if (!v) return "College name is required";
      return null;
    case "year":
      if (!v) return "Please select your year";
      return null;
    case "department":
      if (!v) return "Department is required";
      return null;
    default:
      return null;
  }
}

function generateRegId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "HTC26-";
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

/* ═══════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════ */

export function RegistrationForm() {
  const formRef = useRef<HTMLDivElement>(null);

  /* ── Core form state ── */
  const [type, setType] = useState<RegistrationType>("team");
  const [step, setStep] = useState(0);
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<MemberData[]>([
    { ...EMPTY_MEMBER },
    { ...EMPTY_MEMBER },
  ]);
  const [tshirtSize, setTshirtSize] = useState("");
  const [dietaryPreference, setDietaryPreference] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  /* ── Submission state ── */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registrationId, setRegistrationId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  /* ── Per-field validation state ── */
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  /* ── Derived values ── */
  const maxMembers = siteConfig.registration.maxTeamSize;
  const minMembers = siteConfig.registration.minTeamSize;

  const now = new Date();
  const regCloses = new Date(siteConfig.dates.registrationCloses);
  const regOpens = new Date(siteConfig.dates.registrationOpens);
  const daysUntilClose = Math.ceil(
    (regCloses.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  const isOpen = now >= regOpens && now <= regCloses;
  const isClosingSoon = isOpen && daysUntilClose <= 7;
  const isClosed = now > regCloses;

  const statusBadge = isClosed
    ? { text: "Registration Closed", color: "bg-error/20 text-error" }
    : isClosingSoon
      ? {
          text: `Closing in ${daysUntilClose} days`,
          color: "bg-warning/20 text-warning",
        }
      : isOpen
        ? { text: "Registration Open", color: "bg-success/20 text-success" }
        : { text: "Coming Soon", color: "bg-info/20 text-info" };

  const steps =
    type === "team"
      ? ["Team Info", "Members", "Preferences", "Review"]
      : ["Your Info", "Preferences", "Review"];

  const isLastStep = step === steps.length - 1;

  /* ── Auto-scroll to form top on step change ── */
  useEffect(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  /* ═══════════════════════════════════════════════
     Handlers
     ═══════════════════════════════════════════════ */

  const setFieldError = (key: string, error: string | null) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (error) next[key] = error;
      else delete next[key];
      return next;
    });
  };

  const handleFieldBlur = (key: string, field: string, value: string) => {
    setTouchedFields((prev) => new Set(prev).add(key));
    setFieldError(key, validateField(field, value));
  };

  const updateMember = (
    index: number,
    field: keyof MemberData,
    value: string
  ) => {
    setMembers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    // Live-clear errors for already-touched fields
    const key = `member-${index}-${field}`;
    if (touchedFields.has(key)) {
      setFieldError(key, validateField(field, value));
    }
  };

  const handleTeamNameChange = (value: string) => {
    setTeamName(value);
    if (touchedFields.has("teamName")) {
      const tn = value.trim();
      if (!tn) setFieldError("teamName", "Team name is required");
      else if (tn.length < 3)
        setFieldError("teamName", "Must be at least 3 characters");
      else setFieldError("teamName", null);
    }
  };

  const handleTeamNameBlur = () => {
    setTouchedFields((prev) => new Set(prev).add("teamName"));
    const tn = teamName.trim();
    if (!tn) setFieldError("teamName", "Team name is required");
    else if (tn.length < 3)
      setFieldError("teamName", "Must be at least 3 characters");
    else setFieldError("teamName", null);
  };

  const addMember = () => {
    if (members.length < maxMembers) {
      setMembers((prev) => [...prev, { ...EMPTY_MEMBER }]);
    }
  };

  const removeMember = (index: number) => {
    if (members.length > minMembers) {
      setMembers((prev) => prev.filter((_, i) => i !== index));
      // Clean up field errors and touched state for the removed member
      const prefix = `member-${index}-`;
      setFieldErrors((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((k) => {
          if (k.startsWith(prefix)) delete next[k];
        });
        return next;
      });
      setTouchedFields((prev) => {
        const next = new Set(prev);
        prev.forEach((k) => {
          if (k.startsWith(prefix)) next.delete(k);
        });
        return next;
      });
    }
  };

  /* ── Step validation — returns true if current step is valid ── */
  const validateCurrentStep = (): boolean => {
    let hasError = false;
    const newErrors: Record<string, string> = {};
    const newTouched = new Set(touchedFields);
    const memberFields: (keyof MemberData)[] = [
      "fullName",
      "email",
      "phone",
      "college",
      "year",
      "department",
    ];

    if (type === "team") {
      if (step === 0) {
        const tn = teamName.trim();
        newTouched.add("teamName");
        if (!tn) {
          newErrors["teamName"] = "Team name is required";
          hasError = true;
        } else if (tn.length < 3) {
          newErrors["teamName"] = "Must be at least 3 characters";
          hasError = true;
        }
      } else if (step === 1) {
        for (let i = 0; i < members.length; i++) {
          for (const f of memberFields) {
            const key = `member-${i}-${f}`;
            newTouched.add(key);
            const error = validateField(f, members[i][f]);
            if (error) {
              newErrors[key] = error;
              hasError = true;
            }
          }
        }
      } else if (step === 2 && !tshirtSize) {
        newErrors["tshirtSize"] = "Please select a T-shirt size";
        hasError = true;
      }
    } else {
      // Individual
      if (step === 0) {
        for (const f of memberFields) {
          const key = `member-0-${f}`;
          newTouched.add(key);
          const error = validateField(f, members[0][f]);
          if (error) {
            newErrors[key] = error;
            hasError = true;
          }
        }
      } else if (step === 1 && !tshirtSize) {
        newErrors["tshirtSize"] = "Please select a T-shirt size";
        hasError = true;
      }
    }

    setTouchedFields(newTouched);
    setFieldErrors((prev) => ({ ...prev, ...newErrors }));
    if (hasError)
      setErrorMsg("Please fix the highlighted errors before continuing.");
    return !hasError;
  };

  const goNext = () => {
    setErrorMsg("");
    if (validateCurrentStep()) {
      setStep((s) => s + 1);
    }
  };

  const goBack = () => {
    setErrorMsg("");
    setStep((s) => Math.max(0, s - 1));
  };

  /* ── Keyboard navigation: Enter advances, Tab flows naturally ── */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isLastStep) {
      const active = document.activeElement;
      if (
        active &&
        (active.tagName === "INPUT" || active.tagName === "SELECT")
      ) {
        e.preventDefault();
        goNext();
      }
    }
  };

  /* ═══════════════════════════════════════════════
     API Submission
     ═══════════════════════════════════════════════ */

  const handleSubmit = () => {
    if (isSubmitting) return; // Double-submit guard

    setErrorMsg("");
    setIsSubmitting(true);
    setSubmitMessage("Securing Your Spot...");

    const formData = {
      type,
      teamName: type === "team" ? teamName : "",
      tshirtSize,
      dietaryPreference,
      transactionId,
      members: type === "individual" ? [members[0]] : members,
      submittedAt: new Date().toISOString(),
    };

    // After 3s with no response, reassure the user
    const processingTimer = setTimeout(() => {
      setSubmitMessage("Processing your request, please wait...");
    }, 3000);

    // redirect: "follow" is MANDATORY — Google Apps Script returns a 302 redirect before the final response.
    // Content-Type: text/plain is MANDATORY — prevents the browser from sending a preflight OPTIONS request which GAS blocks.
    fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(formData),
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((data) => {
        clearTimeout(processingTimer);

        if (data.result === "success") {
          const fallbackId = generateRegId();
          setRegistrationId(data?.registrationId || fallbackId);
          setIsSubmitted(true);
        } else {
          throw new Error("API returned an error");
        }
      })
      .catch((error) => {
        clearTimeout(processingTimer);
        console.error(error);
        setErrorMsg("Network congestion detected. Please click Retry.");
      })
      .finally(() => {
        setIsSubmitting(false);
        setSubmitMessage("");
      });
  };

  /* ── Copy registration ID to clipboard ── */
  const copyRegId = async () => {
    try {
      await navigator.clipboard.writeText(registrationId);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = registrationId;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── Full form reset ── */
  const resetForm = () => {
    setType("team");
    setStep(0);
    setTeamName("");
    setMembers([{ ...EMPTY_MEMBER }, { ...EMPTY_MEMBER }]);
    setTshirtSize("");
    setDietaryPreference("");
    setAgreedToTerms(false);
    setTransactionId("");
    setIsSubmitted(false);
    setRegistrationId("");
    setErrorMsg("");
    setFieldErrors({});
    setTouchedFields(new Set());
    setCopied(false);
  };

  /* ═══════════════════════════════════════════════
     Render: Success Screen
     ═══════════════════════════════════════════════ */

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel p-8 sm:p-10 text-center max-w-[550px] mx-auto border border-[#262626] bg-[#0f0f0f] shadow-2xl rounded-2xl"
      >
        {/* Animated success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.15,
            type: "spring",
            stiffness: 200,
            damping: 12,
          }}
          className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 size={40} className="text-success" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-heading-1 text-gray-050 mb-2"
        >
          Registration Successful! 🎉
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-body text-gray-300 mb-8"
        >
          {type === "team"
            ? `Team "${teamName}" has been registered successfully.`
            : "You have been registered successfully."}
        </motion.p>

        {/* Registration ID Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass-panel p-6 mb-8 border border-[#262626] bg-[#141414] rounded-xl"
        >
          <p className="text-caption text-gray-500 mb-2">
            Your Registration ID
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="font-mono text-2xl font-bold text-orange-500 tracking-wider">
              {registrationId}
            </span>
            <button
              onClick={copyRegId}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              aria-label="Copy registration ID"
              id="copy-reg-id"
            >
              {copied ? (
                <Check size={18} className="text-success" />
              ) : (
                <Copy size={18} className="text-gray-300" />
              )}
            </button>
          </div>
          <AnimatePresence>
            {copied && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-success mt-2"
              >
                Copied to clipboard!
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* What's Next */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="glass-panel p-6 text-left mb-8 border border-[#262626] bg-[#141414] rounded-xl"
        >
          <h3 className="text-heading-3 text-gray-050 mb-3">
            What happens next?
          </h3>
          <ul className="space-y-2.5 text-body text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-0.5">•</span>
              You&apos;ll receive a confirmation email shortly
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-0.5">•</span>
              Problem statements will be shared before the event
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-0.5">•</span>
              Join our WhatsApp group for updates
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-0.5">•</span>
              Arrive at the venue on time — check the timeline!
            </li>
          </ul>
        </motion.div>

        <button onClick={resetForm} className="btn-secondary px-8 py-3 rounded-lg">
          Register Another Team
        </button>
      </motion.div>
    );
  }

  /* ═══════════════════════════════════════════════
     Render: Main Multi-Step Form
     ═══════════════════════════════════════════════ */

  return (
    <div
      ref={formRef}
      className="max-w-[550px] mx-auto"
      onKeyDown={handleKeyDown}
      style={{ scrollMarginTop: "calc(var(--navbar-h) + 2rem)" }}
    >
      {/* Status Badge */}
      <div className="flex justify-center mb-6">
        <span
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-semibold",
            statusBadge.color
          )}
        >
          {statusBadge.text}
        </span>
      </div>

      {/* Registration Type Toggle */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          id="reg-type-individual"
          onClick={() => {
            setType("individual");
            setStep(0);
            setMembers([{ ...EMPTY_MEMBER }]);
            setErrorMsg("");
            setFieldErrors({});
            setTouchedFields(new Set());
          }}
          disabled={isSubmitting}
          className={cn(
            "flex-1 glass-panel px-5 py-3.5 flex items-center justify-center gap-2.5 rounded-xl font-display font-semibold transition-all duration-200 border border-[#262626]",
            type === "individual"
              ? "border-orange-500 text-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.2)]"
              : "bg-[#141414] text-gray-300 hover:text-gray-050 hover:border-white/20",
            isSubmitting && "opacity-50 cursor-not-allowed"
          )}
        >
          <User size={18} /> Individual
        </button>
        <button
          id="reg-type-team"
          onClick={() => {
            setType("team");
            setStep(0);
            setMembers([{ ...EMPTY_MEMBER }, { ...EMPTY_MEMBER }]);
            setErrorMsg("");
            setFieldErrors({});
            setTouchedFields(new Set());
          }}
          disabled={isSubmitting}
          className={cn(
            "flex-1 glass-panel px-5 py-3.5 flex items-center justify-center gap-2.5 rounded-xl font-display font-semibold transition-all duration-200 border border-[#262626]",
            type === "team"
              ? "border-orange-500 text-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.2)]"
              : "bg-[#141414] text-gray-300 hover:text-gray-050 hover:border-white/20",
            isSubmitting && "opacity-50 cursor-not-allowed"
          )}
        >
          <Users size={18} /> Team
        </button>
      </div>

      {/* Step Indicator */}
      <nav
        className="flex items-center justify-center gap-2 mb-8"
        aria-label="Registration steps"
      >
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-9 h-9 rounded-full text-sm font-bold flex items-center justify-center transition-all duration-300",
                  i === step
                    ? "bg-orange-500 text-bg-void shadow-[0_0_16px_rgba(255,127,42,0.5)]"
                    : i < step
                      ? "bg-success/20 text-success border border-success/30"
                      : "bg-white/5 text-gray-700 border border-white/10"
                )}
                role="listitem"
                aria-current={i === step ? "step" : undefined}
                aria-label={`Step ${i + 1}: ${s}${i < step ? " (completed)" : i === step ? " (current)" : ""}`}
              >
                {i < step ? <Check size={16} strokeWidth={3} /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-caption hidden sm:inline transition-colors duration-300",
                  i === step
                    ? "text-gray-050 font-medium"
                    : i < step
                      ? "text-success"
                      : "text-gray-700"
                )}
              >
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "w-8 h-px transition-colors duration-300",
                  i < step ? "bg-success/40" : "bg-white/10"
                )}
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </nav>

      {/* Error Toast */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 flex items-start gap-3"
            role="alert"
          >
            <AlertCircle className="text-error shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-error flex-1">{errorMsg}</p>
            <button
              onClick={() => setErrorMsg("")}
              className="text-error/60 hover:text-error transition-colors"
              aria-label="Dismiss error"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Form Content — Animated Step Transitions ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${type}-${step}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="glass-panel p-8 sm:p-10 rounded-2xl border border-[#262626] bg-[#0f0f0f] shadow-2xl" style={{ padding: 32, display: "flex", flexDirection: "column" as const, gap: 18 }}>
            {/* ── Step 0 (Team): Team Details ── */}
            {step === 0 && type === "team" && (
              <div className="space-y-6">
                <h3 className="text-heading-2 text-gray-050">Team Details</h3>
                <InputField
                  id="team-name"
                  label="Team Name"
                  value={teamName}
                  onChange={handleTeamNameChange}
                  onBlur={handleTeamNameBlur}
                  placeholder="Enter your team name"
                  required
                  error={
                    touchedFields.has("teamName")
                      ? fieldErrors["teamName"]
                      : undefined
                  }
                  disabled={isSubmitting}
                />
                <p className="text-caption text-gray-500">
                  Teams must have {minMembers}–{maxMembers} members. You&apos;ll
                  add members in the next step.
                </p>
              </div>
            )}

            {/* ── Step 0 (Individual): Your Information ── */}
            {step === 0 && type === "individual" && (
              <div className="space-y-6">
                <h3 className="text-heading-2 text-gray-050 mb-2">
                  Your Information
                </h3>
                <MemberForm
                  member={members[0]}
                  index={0}
                  onChange={updateMember}
                  onFieldBlur={handleFieldBlur}
                  fieldErrors={fieldErrors}
                  touchedFields={touchedFields}
                  disabled={isSubmitting}
                />
              </div>
            )}

            {/* ── Step 1 (Team): Team Members ── */}
            {type === "team" && step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-heading-2 text-gray-050">
                    Team Members
                  </h3>
                  <span className="text-caption text-gray-500 font-mono">
                    {members.length}/{maxMembers} members
                  </span>
                </div>

                {members.map((member, i) => (
                  <div key={i} className="glass-panel p-6 rounded-xl border border-[#262626] bg-[#141414]">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-overline text-orange-500 font-bold tracking-wider">
                        {i === 0 ? "Team Leader" : `Member ${i + 1}`}
                      </span>
                      {i > 0 && members.length > minMembers && (
                        <button
                          onClick={() => removeMember(i)}
                          disabled={isSubmitting}
                          className="text-gray-500 hover:text-error transition-colors p-1.5 rounded-lg hover:bg-error/10"
                          aria-label={`Remove member ${i + 1}`}
                          id={`remove-member-${i}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <MemberForm
                      member={member}
                      index={i}
                      onChange={updateMember}
                      onFieldBlur={handleFieldBlur}
                      fieldErrors={fieldErrors}
                      touchedFields={touchedFields}
                      disabled={isSubmitting}
                    />
                  </div>
                ))}

                {members.length < maxMembers && (
                  <button
                    onClick={addMember}
                    disabled={isSubmitting}
                    className={cn(
                      "w-full glass-panel py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-gray-300 hover:text-orange-500 hover:border-orange-500/40 border border-[#262626] bg-[#141414] transition-all duration-200 font-medium",
                      isSubmitting && "opacity-50 cursor-not-allowed"
                    )}
                    id="add-member-btn"
                  >
                    <Plus size={18} /> Add Member
                  </button>
                )}
              </div>
            )}

            {/* ── Preferences Step ── */}
            {((type === "team" && step === 2) ||
              (type === "individual" && step === 1)) && (
              <div className="space-y-6">
                <h3 className="text-heading-2 text-gray-050">Preferences</h3>

                <div>
                  <label className="text-sm font-medium text-gray-200 block mb-2">
                    T-Shirt Size <span className="text-orange-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {TSHIRT_SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          setTshirtSize(size);
                          setFieldError("tshirtSize", null);
                        }}
                        disabled={isSubmitting}
                        className={cn(
                          "px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                          tshirtSize === size
                            ? "bg-orange-500 text-bg-void shadow-[0_0_14px_rgba(255,127,42,0.4)]"
                            : "bg-[#141414] text-gray-300 hover:bg-white/10 border border-[#334155]",
                          isSubmitting && "opacity-50 cursor-not-allowed"
                        )}
                        id={`tshirt-${size}`}
                        aria-pressed={tshirtSize === size}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <AnimatePresence>
                    {fieldErrors["tshirtSize"] && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 text-xs text-error flex items-center gap-1"
                        role="alert"
                      >
                        <AlertCircle size={12} />{" "}
                        {fieldErrors["tshirtSize"]}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <InputField
                  id="dietary-preference"
                  label="Dietary Preference (optional)"
                  value={dietaryPreference}
                  onChange={setDietaryPreference}
                  placeholder="e.g., Vegetarian, Vegan, No restrictions"
                  disabled={isSubmitting}
                />
              </div>
            )}

            {/* ── Review & Submit Step ── */}
            {((type === "team" && step === 3) ||
              (type === "individual" && step === 2)) && (
              <div className="space-y-6">
                <h3 className="text-heading-2 text-gray-050">
                  Review &amp; Submit
                </h3>

                {/* Summary table */}
                <div className="space-y-1 bg-[#141414] p-4 rounded-xl border border-[#262626]">
                  <ReviewRow
                    label="Registration Type"
                    value={
                      type === "team"
                        ? `Team — "${teamName}"`
                        : "Individual"
                    }
                  />
                  <ReviewRow
                    label="Total Members"
                    value={`${type === "individual" ? 1 : members.length} ${(type === "individual" ? 1 : members.length) === 1 ? "person" : "people"}`}
                  />
                  {(type === "individual" ? [members[0]] : members).map(
                    (m, i) => (
                      <ReviewRow
                        key={i}
                        label={
                          type === "team"
                            ? i === 0
                              ? "Leader"
                              : `Member ${i + 1}`
                            : "Participant"
                        }
                        value={`${m.fullName} (${m.email})`}
                      />
                    )
                  )}
                  <ReviewRow label="T-Shirt Size" value={tshirtSize} />
                  {dietaryPreference && (
                    <ReviewRow label="Dietary" value={dietaryPreference} />
                  )}
                </div>

                {/* Terms checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group p-4 rounded-xl bg-[#141414] border border-[#262626] hover:border-orange-500/30 transition-colors">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    disabled={isSubmitting}
                    className="mt-1 w-4 h-4 accent-orange-500 shrink-0"
                    id="agree-terms"
                  />
                  <span className="text-caption text-gray-300 group-hover:text-gray-050 transition-colors">
                    I agree to the{" "}
                    <a
                      href="#faq"
                      target="_blank"
                      className="text-orange-500 underline underline-offset-2"
                    >
                      Terms &amp; Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="#faq"
                      target="_blank"
                      className="text-orange-500 underline underline-offset-2"
                    >
                      Code of Conduct
                    </a>
                  </span>
                </label>

                {/* ── UPI Payment Card ── */}
                <div className="bg-black/20 border border-white/10 rounded-xl p-6 text-center space-y-4 mt-6">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="p-3 bg-white rounded-xl shadow-lg inline-block">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi%3A%2F%2Fpay%3Fpa%3Dhackthecube%40okhdfc%26pn%3DHack%20The%20Cube"
                        alt="UPI QR Code"
                        width={150}
                        height={150}
                        className="w-[150px] h-[150px] object-contain rounded-lg"
                      />
                    </div>
                    <p className="text-body font-semibold text-gray-050 mt-2">
                      Scan to Pay Registration Fee
                    </p>
                    <p className="text-caption text-orange-400 font-mono">
                      UPI ID: hackthecube@okhdfc
                    </p>
                  </div>

                  <div className="text-left space-y-1.5 pt-2">
                    <label
                      htmlFor="transaction-id"
                      className="block text-body-sm font-medium text-gray-200"
                    >
                      12-Digit UTR / Transaction ID <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="transaction-id"
                      required
                      minLength={12}
                      maxLength={12}
                      value={transactionId}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9a-zA-Z]/g, "").slice(0, 12);
                        setTransactionId(val);
                      }}
                      disabled={isSubmitting}
                      placeholder="e.g. 312345678901"
                      className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-gray-050 placeholder:text-gray-500 focus:border-orange-500 outline-none transition-all text-body font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Navigation Buttons ── */}
      <div className="flex items-center justify-between mt-6" style={{ marginTop: 20 }}>
        <button
          onClick={goBack}
          disabled={step === 0 || isSubmitting}
          className={cn(
            "btn-secondary py-3 px-6 rounded-lg font-medium transition-all duration-200",
            (step === 0 || isSubmitting) && "opacity-30 cursor-not-allowed"
          )}
          id="reg-back-btn"
          style={{ padding: "12px 24px", borderRadius: 8 }}
        >
          <ChevronLeft size={18} /> Back
        </button>

        {!isLastStep ? (
          <button
            onClick={goNext}
            disabled={isSubmitting}
            className="btn-primary py-3 px-8 rounded-lg font-medium transition-all duration-200 shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_20px_rgba(249,115,22,0.5)]"
            id="reg-next-btn"
            style={{ padding: "12px 28px", borderRadius: 8 }}
          >
            Next <ChevronRight size={18} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!agreedToTerms || transactionId.trim().length < 12 || isSubmitting || isClosed}
            className={cn(
              "btn-primary py-3.5 px-8 rounded-lg font-semibold transition-all duration-200 shadow-[0_0_18px_rgba(249,115,22,0.35)] hover:shadow-[0_0_25px_rgba(249,115,22,0.55)]",
              (!agreedToTerms || transactionId.trim().length < 12 || isClosed || isSubmitting) &&
                "opacity-50 cursor-not-allowed shadow-none"
            )}
            id="reg-submit-btn"
            style={{ padding: "14px 32px", borderRadius: 8, fontWeight: 700, fontSize: "1rem", letterSpacing: "0.02em", marginTop: 8, width: "100%" }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {submitMessage}
              </>
            ) : (
              "Verify Payment & Register"
            )}
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Sub-Components
   ═══════════════════════════════════════════════ */

/** Styled input field with inline error display and accessibility attributes */
function InputField({
  id,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  required = false,
  error,
  disabled = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-gray-200 block mb-1.5" style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>
        {label} {required && <span className="text-orange-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        style={{ padding: "12px 16px", width: "100%", borderRadius: 8, boxSizing: "border-box" as const }}
        className={cn(
          "w-full py-3.5 px-4 text-sm rounded-lg bg-[#141414] border border-[#334155] text-gray-050",
          "placeholder:text-gray-500 placeholder:opacity-70",
          "outline-none transition-all duration-200",
          error
            ? "border-error focus:border-error focus:ring-2 focus:ring-error/25"
            : "border-[#334155] focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 text-xs text-error flex items-center gap-1 overflow-hidden font-medium"
            role="alert"
          >
            <AlertCircle size={12} className="shrink-0" /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Member details form — 6-field grid with per-field validation */
function MemberForm({
  member,
  index,
  onChange,
  onFieldBlur,
  fieldErrors,
  touchedFields,
  disabled,
}: {
  member: MemberData;
  index: number;
  onChange: (i: number, field: keyof MemberData, value: string) => void;
  onFieldBlur: (key: string, field: string, value: string) => void;
  fieldErrors: Record<string, string>;
  touchedFields: Set<string>;
  disabled: boolean;
}) {
  const k = (field: string) => `member-${index}-${field}`;
  const err = (field: string) =>
    touchedFields.has(k(field)) ? fieldErrors[k(field)] : undefined;

  return (
    <div className="grid gap-6 sm:grid-cols-2" style={{ gap: 18 }}>
      <InputField
        id={k("fullName")}
        label="Full Name"
        value={member.fullName}
        onChange={(v) => onChange(index, "fullName", v)}
        onBlur={() => onFieldBlur(k("fullName"), "fullName", member.fullName)}
        placeholder="John Doe"
        required
        error={err("fullName")}
        disabled={disabled}
      />
      <InputField
        id={k("email")}
        label="Email"
        value={member.email}
        onChange={(v) => onChange(index, "email", v)}
        onBlur={() => onFieldBlur(k("email"), "email", member.email)}
        placeholder="john@email.com"
        type="email"
        required
        error={err("email")}
        disabled={disabled}
      />
      <InputField
        id={k("phone")}
        label="Phone Number"
        value={member.phone}
        onChange={(v) => onChange(index, "phone", v)}
        onBlur={() => onFieldBlur(k("phone"), "phone", member.phone)}
        placeholder="9876543210"
        type="tel"
        required
        error={err("phone")}
        disabled={disabled}
      />
      <InputField
        id={k("college")}
        label="College"
        value={member.college}
        onChange={(v) => onChange(index, "college", v)}
        onBlur={() => onFieldBlur(k("college"), "college", member.college)}
        placeholder="College name"
        required
        error={err("college")}
        disabled={disabled}
      />
      {/* Year dropdown with same styling as InputField */}
      <div>
        <label
          htmlFor={k("year")}
          className="text-sm font-medium text-gray-200 block mb-1.5"
          style={{ display: "block", marginBottom: 6, fontWeight: 500 }}
        >
          Year <span className="text-orange-500">*</span>
        </label>
        <select
          id={k("year")}
          value={member.year}
          onChange={(e) => onChange(index, "year", e.target.value)}
          onBlur={() => onFieldBlur(k("year"), "year", member.year)}
          disabled={disabled}
          aria-invalid={!!err("year")}
          style={{ padding: "12px 16px", width: "100%", borderRadius: 8, boxSizing: "border-box" as const }}
          className={cn(
            "w-full py-3.5 px-4 text-sm rounded-lg bg-[#141414] border text-gray-050",
            "outline-none transition-all duration-200 appearance-none",
            err("year")
              ? "border-error focus:border-error focus:ring-2 focus:ring-error/25"
              : "border-[#334155] focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <option value="" className="bg-[#141414]">
            Select year
          </option>
          {YEAR_OPTIONS.map((y) => (
            <option key={y} value={y} className="bg-[#141414]">
              {y}
            </option>
          ))}
        </select>
        <AnimatePresence>
          {err("year") && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1.5 text-xs text-error flex items-center gap-1 overflow-hidden font-medium"
              role="alert"
            >
              <AlertCircle size={12} className="shrink-0" /> {err("year")}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <InputField
        id={k("department")}
        label="Department"
        value={member.department}
        onChange={(v) => onChange(index, "department", v)}
        onBlur={() =>
          onFieldBlur(k("department"), "department", member.department)
        }
        placeholder="Computer Science"
        required
        error={err("department")}
        disabled={disabled}
      />
    </div>
  );
}

/** Read-only key-value row for the review step */
function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-white/5 last:border-0">
      <span className="text-caption text-gray-400 font-medium">{label}</span>
      <span className="text-caption text-gray-050 text-right max-w-[60%] font-semibold">
        {value}
      </span>
    </div>
  );
}
