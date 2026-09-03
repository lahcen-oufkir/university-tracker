export const STATUSES = [
  "To Apply",
  "Applied",
  "Waiting",
  "Exam",
  "Results Published",
  "Admitted",
  "Waiting List",
  "Rejected",
  "Cancelled",
] as const;

export const LEVELS = [
  "Licence",
  "Licence Professionnelle",
  "Master",
  "Master Spécialisé",
  "Concours",
  "BTS",
  "Other",
] as const;

export const RESULTS = ["Not Published", "Admitted", "Waiting List", "Rejected"] as const;

export const STATUS_BADGE: Record<string, string> = {
  "To Apply": "bg-gray-100 text-gray-600 ring-gray-300",
  Applied: "bg-blue-50 text-blue-700 ring-blue-200",
  Waiting: "bg-yellow-50 text-yellow-800 ring-yellow-300",
  Exam: "bg-blue-50 text-blue-700 ring-blue-200",
  "Results Published": "bg-purple-50 text-purple-700 ring-purple-200",
  Admitted: "bg-green-50 text-green-700 ring-green-200",
  "Waiting List": "bg-orange-50 text-orange-700 ring-orange-200",
  Rejected: "bg-red-50 text-red-700 ring-red-200",
  Cancelled: "bg-gray-100 text-gray-400 ring-gray-200",
};

export const RESULT_BADGE: Record<string, string> = {
  "Not Published": "bg-gray-100 text-gray-500 ring-gray-200",
  Admitted: "bg-green-50 text-green-700 ring-green-200",
  "Waiting List": "bg-orange-50 text-orange-700 ring-orange-200",
  Rejected: "bg-red-50 text-red-700 ring-red-200",
};
