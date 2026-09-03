export interface Application {
  id: number;
  school: string;
  city: string;
  program: string;
  level: string;
  applicationDate: string | null;
  deadline: string | null;
  examDate: string | null;
  expectedResultDate: string | null;
  status: string;
  result: string;
  officialLink: string | null;
  resultsLink: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationInput = Omit<Application, "id" | "createdAt" | "updatedAt">;
