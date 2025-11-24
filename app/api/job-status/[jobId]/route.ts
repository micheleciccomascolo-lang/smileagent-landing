import { NextRequest, NextResponse } from 'next/server';
import { jobsStore } from '../../lib/jobs-store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID mancante' },
        { status: 400 }
      );
    }

    // Verifica se il job esiste
    const job = jobsStore.get(jobId);

    if (!job) {
      return NextResponse.json(
        { error: 'Job non trovato' },
        { status: 404 }
      );
    }

    // Ritorna lo stato del job
    return NextResponse.json({
      jobId,
      status: job.status,
      subdomain: job.subdomain,
      url: job.url,
      error: job.error,
      createdAt: job.createdAt
    });

  } catch (error) {
    console.error('Errore job-status:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
