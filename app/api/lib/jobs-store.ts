// Storage condiviso per i jobs di cloning
// In produzione, sostituire con un database (Vercel KV, PostgreSQL, etc.)

export interface ClonedPage {
  title: string;
  url: string;
  filename: string;
}

export interface Job {
  status: 'processing' | 'completed' | 'pending_confirmation' | 'finalized' | 'failed';
  url?: string;
  subdomain: string;
  error?: string;
  createdAt: Date;
  pages?: ClonedPage[];
  originalUrl?: string;
}

// Usa globalThis per persistere tra hot-reloads in dev mode
const globalForJobs = globalThis as unknown as {
  jobsStore: Map<string, Job> | undefined;
};

// Map globale condivisa tra tutte le route
export const jobsStore = globalForJobs.jobsStore ?? new Map<string, Job>();

// Salva la reference in globalThis
if (process.env.NODE_ENV !== 'production') {
  globalForJobs.jobsStore = jobsStore;
}
