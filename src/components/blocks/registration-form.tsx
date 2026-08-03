"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/content/site-config";
import { ChevronLeft, ChevronRight, Users, User, Check, Loader2, Plus, Trash2, AlertCircle } from "lucide-react";
import { createRazorpayOrder, verifyPaymentAndRegister, type RegistrationData, type PaymentVerificationData } from "@/app/actions/register";

type RegistrationType = "individual" | "team";

// Minimal Razorpay checkout typings (SDK injected via <script> at runtime)
interface RazorpayHandlerResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number | string;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayHandlerResponse) => void;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  modal: { ondismiss: () => void };
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface MemberData {
  fullName: string;
  email: string;
  phone: string;
  college: string;
  year: string;
  department: string;
}

const emptyMember: MemberData = {
  fullName: "",
  email: "",
  phone: "",
  college: "",
  year: "",
  department: "",
};

const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];
const tshirtSizes = ["XS", "S", "M", "L", "XL", "XXL"];

export function RegistrationForm() {
  const [type, setType] = useState<RegistrationType>("team");
  const [step, setStep] = useState(0);
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<MemberData[]>([{ ...emptyMember }, { ...emptyMember }]);
  const [tshirtSize, setTshirtSize] = useState("");
  const [dietaryPreference, setDietaryPreference] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const maxMembers = siteConfig.registration.maxTeamSize;
  const minMembers = siteConfig.registration.minTeamSize;

  // Registration status
  const now = new Date();
  const regCloses = new Date(siteConfig.dates.registrationCloses);
  const regOpens = new Date(siteConfig.dates.registrationOpens);
  const daysUntilClose = Math.ceil((regCloses.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isOpen = now >= regOpens && now <= regCloses;
  const isClosingSoon = isOpen && daysUntilClose <= 7;
  const isClosed = now > regCloses;

  const statusBadge = isClosed
    ? { text: "Registration Closed", color: "bg-error/20 text-error" }
    : isClosingSoon
    ? { text: `Closing in ${daysUntilClose} days`, color: "bg-warning/20 text-warning" }
    : isOpen
    ? { text: "Registration Open", color: "bg-success/20 text-success" }
    : { text: "Coming Soon", color: "bg-info/20 text-info" };

  const updateMember = (index: number, field: keyof MemberData, value: string) => {
    setMembers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addMember = () => {
    if (members.length < maxMembers) {
      setMembers((prev) => [...prev, { ...emptyMember }]);
    }
  };

  const removeMember = (index: number) => {
    if (members.length > minMembers) {
      setMembers((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async () => {
    setErrorMsg("");
    setIsSubmitting(true);
    
    try {
      // 1. Load Razorpay Script
      const res = await loadRazorpayScript();
      if (!res) {
        throw new Error("Razorpay SDK failed to load. Are you online?");
      }

      // 2. Prepare Data
      const formData: RegistrationData = {
        type,
        teamName: type === "team" ? teamName : "",
        tshirtSize,
        dietaryPreference,
        members: type === "individual" ? [members[0]] : members,
      };

      const fee = siteConfig.registration.registrationFee;

      // 3. Create Order on Server
      const orderData = await createRazorpayOrder(fee);
      if (!orderData.success || !orderData.orderId) {
        throw new Error(orderData.error || "Failed to create payment order.");
      }

      // 4. Initialize Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder", // Provide fallback for testing UI
        amount: orderData.amount,
        currency: "INR",
        name: siteConfig.name,
        description: `${type === "team" ? "Team" : "Individual"} Registration Fee`,
        order_id: orderData.orderId,
        handler: async function (response: RazorpayHandlerResponse) {
          try {
            // Payment successful, now verify and register via Server Action
            const paymentVerification: PaymentVerificationData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            };

            const registrationResult = await verifyPaymentAndRegister(paymentVerification, formData);
            
            if (registrationResult.success) {
              setIsSubmitted(true);
            } else {
              setErrorMsg(registrationResult.error || "Registration failed after payment.");
            }
          } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred during verification.");
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: members[0].fullName,
          email: members[0].email,
          contact: members[0].phone,
        },
        theme: {
          color: "#f97316", // orange-500
        },
        modal: {
          ondismiss: function() {
            setIsSubmitting(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setIsSubmitting(false);
    }
  };

  const steps = type === "team"
    ? ["Team Info", "Members", "Preferences", "Review"]
    : ["Your Info", "Preferences", "Review"];

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-8 md:p-12 text-center max-w-2xl mx-auto"
      >
        <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
          <Check size={32} className="text-success" />
        </div>
        <h2 className="text-heading-1 text-gray-050 mb-3">Registration Successful!</h2>
        <p className="text-body text-gray-300 mb-6">
          {type === "team"
            ? `Team "${teamName}" has been registered successfully.`
            : "You have been registered successfully."}
        </p>
        <div className="glass-panel p-6 text-left mb-6">
          <h3 className="text-heading-3 text-gray-050 mb-3">What happens next?</h3>
          <ul className="space-y-2 text-body text-gray-300">
            <li>• You&apos;ll receive a confirmation email shortly</li>
            <li>• Problem statements will be shared before the event</li>
            <li>• Join our WhatsApp group for updates</li>
            <li>• Arrive at the venue on time — check the timeline!</li>
          </ul>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Status Badge */}
      <div className="flex justify-center mb-8">
        <span className={cn("px-4 py-1.5 rounded-full text-sm font-semibold", statusBadge.color)}>
          {statusBadge.text}
        </span>
      </div>

      {/* Type Toggle */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => { setType("individual"); setStep(0); setMembers([{ ...emptyMember }]); }}
          className={cn(
            "glass-panel px-6 py-3 flex items-center gap-2 font-display font-semibold transition-all",
            type === "individual" ? "border-orange-500 text-orange-500 glow-orange-sm" : "text-gray-300 hover:text-gray-050"
          )}
        >
          <User size={20} /> Individual
        </button>
        <button
          onClick={() => { setType("team"); setStep(0); setMembers([{ ...emptyMember }, { ...emptyMember }]); }}
          className={cn(
            "glass-panel px-6 py-3 flex items-center gap-2 font-display font-semibold transition-all",
            type === "team" ? "border-orange-500 text-orange-500 glow-orange-sm" : "text-gray-300 hover:text-gray-050"
          )}
        >
          <Users size={20} /> Team
        </button>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => setStep(i)}
              className={cn(
                "w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center transition-all",
                i === step
                  ? "bg-orange-500 text-bg-void"
                  : i < step
                  ? "bg-orange-500/20 text-orange-500"
                  : "bg-white/5 text-gray-500"
              )}
            >
              {i < step ? <Check size={14} /> : i + 1}
            </button>
            <span className={cn("text-caption hidden sm:inline", i === step ? "text-gray-050" : "text-gray-500")}>
              {s}
            </span>
            {i < steps.length - 1 && <div className="w-8 h-px bg-white/10" />}
          </div>
        ))}
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 flex items-start gap-3">
          <AlertCircle className="text-error shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-error">{errorMsg}</p>
        </div>
      )}

      {/* Form Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${type}-${step}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="glass-panel p-5 md:p-7">
            {/* Step 0: Team Info or Individual Info */}
            {step === 0 && type === "team" && (
              <div className="space-y-6">
                <h3 className="text-heading-2 text-gray-050">Team Details</h3>
                <InputField label="Team Name" value={teamName} onChange={setTeamName} placeholder="Enter your team name" required />
                <p className="text-caption text-gray-500">
                  Teams must have {minMembers}–{maxMembers} members. You&apos;ll add members in the next step.
                </p>
              </div>
            )}

            {step === 0 && type === "individual" && (
              <div className="space-y-6">
                <h3 className="text-heading-2 text-gray-050">Your Information</h3>
                <MemberForm member={members[0]} index={0} onChange={updateMember} />
              </div>
            )}

            {/* Step 1 (team): Members */}
            {((type === "team" && step === 1) || false) && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-heading-2 text-gray-050">Team Members</h3>
                  <span className="text-caption text-gray-500">
                    {members.length}/{maxMembers} members
                  </span>
                </div>

                {members.map((member, i) => (
                  <div key={i} className="glass-panel p-4 sm:p-5 relative">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-overline text-orange-500">
                        {i === 0 ? "Team Leader" : `Member ${i + 1}`}
                      </span>
                      {i > 0 && members.length > minMembers && (
                        <button onClick={() => removeMember(i)} className="text-gray-500 hover:text-error transition-colors">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <MemberForm member={member} index={i} onChange={updateMember} />
                  </div>
                ))}

                {members.length < maxMembers && (
                  <button
                    onClick={addMember}
                    className="w-full glass-panel p-4 flex items-center justify-center gap-2 text-gray-300 hover:text-orange-500 hover:border-orange-500/30 transition-all"
                  >
                    <Plus size={18} /> Add Member
                  </button>
                )}
              </div>
            )}

            {/* Preferences Step */}
            {((type === "team" && step === 2) || (type === "individual" && step === 1)) && (
              <div className="space-y-6">
                <h3 className="text-heading-2 text-gray-050">Preferences</h3>

                <div>
                  <label className="text-caption text-gray-300 block mb-2">T-Shirt Size</label>
                  <div className="flex flex-wrap gap-2">
                    {tshirtSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setTshirtSize(size)}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                          tshirtSize === size
                            ? "bg-orange-500 text-bg-void"
                            : "bg-white/5 text-gray-300 hover:bg-white/10"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <InputField
                  label="Dietary Preference (optional)"
                  value={dietaryPreference}
                  onChange={setDietaryPreference}
                  placeholder="e.g., Vegetarian, Vegan, No restrictions"
                />

                <div className="glass-panel p-4 bg-navy-900/30">
                  <p className="text-caption text-gray-300 mb-1">
                    <strong>Registration Fee:</strong> ₹{siteConfig.registration.registrationFee} per {type === "team" ? "team" : "individual"}
                  </p>
                  <p className="text-caption text-gray-500">
                    Payment will be processed via Razorpay after form submission.
                  </p>
                </div>
              </div>
            )}

            {/* Review Step */}
            {((type === "team" && step === 3) || (type === "individual" && step === 2)) && (
              <div className="space-y-6">
                <h3 className="text-heading-2 text-gray-050">Review & Submit</h3>

                <div className="space-y-4">
                  <ReviewRow label="Type" value={type === "team" ? `Team — "${teamName}"` : "Individual"} />
                  <ReviewRow label="Members" value={`${members.length} ${members.length === 1 ? "person" : "people"}`} />
                  {members.map((m, i) => (
                    <ReviewRow key={i} label={i === 0 && type === "team" ? "Leader" : `Member ${i + 1}`} value={`${m.fullName} (${m.email})`} />
                  ))}
                  {tshirtSize && <ReviewRow label="T-Shirt" value={tshirtSize} />}
                  {dietaryPreference && <ReviewRow label="Dietary" value={dietaryPreference} />}
                  <ReviewRow label="Fee" value={`₹${siteConfig.registration.registrationFee}`} />
                </div>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-orange-500"
                  />
                  <span className="text-caption text-gray-300 group-hover:text-gray-050 transition-colors">
                    I agree to the{" "}
                    <a href="/terms" target="_blank" className="text-orange-500 underline">
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a href="/terms" target="_blank" className="text-orange-500 underline">
                      Code of Conduct
                    </a>
                  </span>
                </label>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0 || isSubmitting}
          className={cn(
            "btn-secondary py-3 px-6",
            (step === 0 || isSubmitting) && "opacity-30 cursor-not-allowed"
          )}
        >
          <ChevronLeft size={18} /> Back
        </button>

        {step < steps.length - 1 ? (
          <button
            onClick={() => {
              setErrorMsg("");
              let isValid = true;
              if (type === "team") {
                if (step === 0 && !teamName.trim()) {
                  setErrorMsg("Team Name is required.");
                  isValid = false;
                } else if (step === 1) {
                  for (let i = 0; i < members.length; i++) {
                    const m = members[i];
                    if (!m.fullName.trim() || !m.email.trim() || !m.phone.trim() || !m.college.trim() || !m.year.trim() || !m.department.trim()) {
                      setErrorMsg(`Please fill all fields for ${i === 0 ? "Team Leader" : `Member ${i + 1}`}.`);
                      isValid = false;
                      break;
                    }
                  }
                } else if (step === 2 && !tshirtSize) {
                  setErrorMsg("T-Shirt size is required.");
                  isValid = false;
                }
              } else {
                if (step === 0) {
                  const m = members[0];
                  if (!m.fullName.trim() || !m.email.trim() || !m.phone.trim() || !m.college.trim() || !m.year.trim() || !m.department.trim()) {
                    setErrorMsg("Please fill all required fields in Your Information.");
                    isValid = false;
                  }
                } else if (step === 1 && !tshirtSize) {
                  setErrorMsg("T-Shirt size is required.");
                  isValid = false;
                }
              }
              if (isValid) setStep((s) => s + 1);
            }}
            disabled={isSubmitting}
            className="btn-primary py-3 px-8"
          >
            Next <ChevronRight size={18} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!agreedToTerms || isSubmitting || isClosed}
            className={cn(
              "btn-primary py-3 px-8",
              (!agreedToTerms || isClosed || isSubmitting) && "opacity-50 cursor-not-allowed"
            )}
          >
            {isSubmitting ? (
              <><Loader2 size={18} className="animate-spin" /> Processing...</>
            ) : (
              <>Pay & Register</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-caption text-gray-300 block mb-1.5">
        {label} {required && <span className="text-orange-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-white/5 border border-white/10 text-gray-050 placeholder:text-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 outline-none transition-all"
      />
    </div>
  );
}

function MemberForm({
  member,
  index,
  onChange,
}: {
  member: MemberData;
  index: number;
  onChange: (i: number, field: keyof MemberData, value: string) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <InputField label="Full Name" value={member.fullName} onChange={(v) => onChange(index, "fullName", v)} placeholder="John Doe" required />
      <InputField label="Email" value={member.email} onChange={(v) => onChange(index, "email", v)} placeholder="john@email.com" type="email" required />
      <InputField label="Phone" value={member.phone} onChange={(v) => onChange(index, "phone", v)} placeholder="+91 98765 43210" type="tel" required />
      <InputField label="College" value={member.college} onChange={(v) => onChange(index, "college", v)} placeholder="College name" required />
      <div>
        <label className="text-caption text-gray-300 block mb-1.5">Year <span className="text-orange-500">*</span></label>
        <select
          value={member.year}
          onChange={(e) => onChange(index, "year", e.target.value)}
          className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-white/5 border border-white/10 text-gray-050 focus:border-orange-500 outline-none transition-all appearance-none"
        >
          <option value="" className="bg-bg-surface-2">Select year</option>
          {yearOptions.map((y) => (
            <option key={y} value={y} className="bg-bg-surface-2">{y}</option>
          ))}
        </select>
      </div>
      <InputField label="Department" value={member.department} onChange={(v) => onChange(index, "department", v)} placeholder="Computer Science" required />
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-white/5">
      <span className="text-caption text-gray-500">{label}</span>
      <span className="text-caption text-gray-050 text-right max-w-[60%]">{value}</span>
    </div>
  );
}
