// Storage condiviso per i jobs di cloning
// In produzione, sostituire con un database (Vercel KV, PostgreSQL, etc.)

export interface Job {
  status: 'processing' | 'completed' | 'failed';
  url?: string;
  subdomain: string;
  error?: string;
  createdAt: Date;
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
