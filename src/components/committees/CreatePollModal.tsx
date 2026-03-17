"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

interface CreatePollModalProps {
  committeeId: string;
  creatorId: string;
  onClose: () => void;
  onCreated: () => void;
}

const ROLE_OPTIONS = [
  { value: "student", label: "תלמידים" },
  { value: "teacher", label: "מורים" },
  { value: "parent", label: "הורים" },
];

export function CreatePollModal({ committeeId, creatorId, onClose, onCreated }: CreatePollModalProps) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [targetRoles, setTargetRoles] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function addOption() {
    if (options.length >= 10) return;
    setOptions((prev) => [...prev, ""]);
  }

  function removeOption(index: number) {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((_, i) => i !== index));
  }

  function updateOption(index: number, value: string) {
    setOptions((prev) => prev.map((opt, i) => (i === index ? value : opt)));
  }

  function toggleRole(role: string) {
    setTargetRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  }

  async function handleSubmit() {
    setError("");

    if (!question.trim()) {
      setError("יש להזין שאלה");
      return;
    }

    const filledOptions = options.filter((o) => o.trim());
    if (filledOptions.length < 2) {
      setError("יש להזין לפחות 2 אפשרויות");
      return;
    }

    if (targetRoles.length === 0) {
      setError("יש לבחור לפחות קהל יעד אחד");
      return;
    }

    setSubmitting(true);

    const supabase = createClient();
    const { error: rpcError } = await supabase.rpc("create_poll", {
      p_committee_id: committeeId,
      p_creator_id: creatorId,
      p_question: question.trim(),
      p_target_roles: targetRoles,
      p_options: filledOptions,
    });

    if (rpcError) {
      setError(rpcError.message);
      setSubmitting(false);
      return;
    }

    onCreated();
    onClose();
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="p-5 border-b border-sand-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-sand-900">יצירת סקר חדש</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-sand-100 flex items-center justify-center hover:bg-sand-200 transition-colors"
            >
              <svg className="w-4 h-4 text-sand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-5">
            {/* Question */}
            <div>
              <label className="block text-sm font-medium text-sand-700 mb-1.5">שאלה</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="מה השאלה שלכם?"
                className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-white text-sm text-sand-900 placeholder:text-sand-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
              />
            </div>

            {/* Options */}
            <div>
              <label className="block text-sm font-medium text-sand-700 mb-1.5">אפשרויות</label>
              <div className="space-y-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(i, e.target.value)}
                      placeholder={`אפשרות ${i + 1}`}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-sand-300 bg-white text-sm text-sand-900 placeholder:text-sand-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                    />
                    {options.length > 2 && (
                      <button
                        onClick={() => removeOption(i)}
                        className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center hover:bg-rainbow-red/10 hover:text-rainbow-red text-sand-400 transition-colors shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {options.length < 10 && (
                <button
                  onClick={addOption}
                  className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  הוסף אפשרות
                </button>
              )}
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-sm font-medium text-sand-700 mb-1.5">מי יכול להצביע?</label>
              <div className="flex flex-wrap gap-2">
                {ROLE_OPTIONS.map((role) => (
                  <button
                    key={role.value}
                    onClick={() => toggleRole(role.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                      targetRoles.includes(role.value)
                        ? "bg-primary-600 text-white border-primary-600"
                        : "bg-white text-sand-600 border-sand-200 hover:bg-sand-50"
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-rainbow-red bg-rainbow-red/10 px-4 py-2.5 rounded-xl">
                {error}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-sand-200 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-sand-600 hover:bg-sand-100 transition-colors"
            >
              ביטול
            </button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "יוצר..." : "פרסום סקר"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
