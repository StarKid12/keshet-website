"use client";

interface SaveButtonProps {
  saving: boolean;
  onClick: () => void;
  label?: string;
  savingLabel?: string;
  successMessage?: string | null;
}

export function SaveButton({
  saving,
  onClick,
  label = "שמירה",
  savingLabel = "שומר...",
  successMessage,
}: SaveButtonProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={onClick}
        disabled={saving}
        className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700
          transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? savingLabel : label}
      </button>
      {successMessage && (
        <span className="text-sm text-rainbow-green font-medium flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {successMessage}
        </span>
      )}
    </div>
  );
}
