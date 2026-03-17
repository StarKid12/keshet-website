"use client";

const ROLE_OPTIONS = [
  { value: "student", label: "תלמידים" },
  { value: "teacher", label: "מורים" },
  { value: "parent", label: "הורים" },
];

interface RoleSelectorProps {
  selectedRoles: string[];
  onChange: (roles: string[]) => void;
  label?: string;
}

export function RoleSelector({ selectedRoles, onChange, label = "קהל יעד" }: RoleSelectorProps) {
  const allSelected = selectedRoles.length === 0;

  function toggleRole(role: string) {
    if (selectedRoles.includes(role)) {
      onChange(selectedRoles.filter((r) => r !== role));
    } else {
      onChange([...selectedRoles, role]);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-sand-700 mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange([])}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
            allSelected
              ? "bg-primary-600 text-white border-primary-600"
              : "bg-white text-sand-600 border-sand-200 hover:bg-sand-50"
          }`}
        >
          כולם
        </button>
        {ROLE_OPTIONS.map((role) => (
          <button
            key={role.value}
            type="button"
            onClick={() => toggleRole(role.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
              selectedRoles.includes(role.value)
                ? "bg-primary-600 text-white border-primary-600"
                : "bg-white text-sand-600 border-sand-200 hover:bg-sand-50"
            }`}
          >
            {role.label}
          </button>
        ))}
      </div>
    </div>
  );
}
