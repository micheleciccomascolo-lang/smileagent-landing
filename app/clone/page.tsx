'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ClonedPage {
  title: string;
  url: string;
  filename: string;
}

interface CloneResult {
  jobId: string;
  subdomain: string;
  url?: string;
  status: 'processing' | 'completed' | 'pending_confirmation' | 'finalized' | 'failed';
  estimatedTime?: string;
  error?: string;
  pages?: ClonedPage[];
  originalUrl?: string;
}

export default function ClonePage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CloneResult | null>(null);
  const [error, setError] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');

  const validateUrl = (urlString: string): boolean => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleClone = async () => {
    setError('');
    setResult(null);

    if (!url) {
      setError('Inserisci un URL valido');
      return;
    }

    if (!validateUrl(url)) {
      setError('URL non valido. Inserisci un URL completo (es. https://www.tuosito.it)');
      return;
    }

    setLoading(true);
    setOriginalUrl(url); // Salva l'URL originale per la preview

    try {
      const response = await fetch('/api/clone-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Errore durante la clonazione');
      }

      setResult(data);

      // Poll per verificare il completamento
      if (data.jobId) {
        pollJobStatus(data.jobId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  const pollJobStatus = async (jobId: string) => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/job-status/${jobId}`);
        const data = await res.json();

        setResult(data);

        if (data.status === 'completed' || data.status === 'finalized') {
          clearInterval(intervalId);
        } else if (data.status === 'failed') {
          clearInterval(intervalId);
          setError(data.error || 'Clonazione fallita');
        }
      } catch (err) {
        console.error('Errore polling:', err);
      }
    };

    const intervalId = setInterval(checkStatus, 5000);

    // Stop dopo 10 minuti
    setTimeout(() => clearInterval(intervalId), 600000);
  };

  const handleFinalize = async () => {
    if (!result?.jobId) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/finalize-site/${result.jobId}`, {
        method: 'POST'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Errore durante la finalizzazione');
      }

      // Aggiorna lo stato del risultato
      setResult(prev => prev ? { ...prev, status: 'finalized' } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="SmileAgent Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-2xl font-bold text-[#0da2e7]">SmileAgent</span>
            </Link>
            <Link
              href="/"
              className="text-gray-700 hover:text-[#0da2e7] transition-colors"
            >
              Torna alla Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Clona il Tuo Sito con <span className="text-[#0da2e7]">Agent IA</span>
            </h1>
            <p className="text-xl text-gray-600">
              Inserisci l'URL del tuo sito esistente e lo cloniamo automaticamente integrandolo con le nostre funzionalità AI
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  URL del tuo sito web
                </label>
                <input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.tuosito.it"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0da2e7] focus:border-transparent outline-none transition-all"
                  disabled={loading}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Inserisci l'URL completo del tuo sito (incluso https://)
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleClone}
                disabled={loading || !url}
                className="w-full bg-[#0da2e7] text-white py-4 rounded-lg hover:bg-[#0b8acc] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Clonazione in corso...
                  </span>
                ) : (
                  'Inizia Clonazione'
                )}
              </button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Come funziona:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                  <li>Analizziamo la struttura del tuo sito</li>
                  <li>Scarichiamo tutti i contenuti e asset</li>
                  <li>Generiamo una copia identica del sito</li>
                  <li>Ti forniamo l'URL e le istruzioni DNS</li>
                </ol>
                <p className="text-xs text-blue-700 mt-3">
                  Tempo stimato: 5-15 minuti in base alla dimensione del sito
                </p>
              </div>
            </div>
          </div>

          {/* Progress/Result */}
          {result && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {result.status === 'processing' && (
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#0da2e7] mb-4"></div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Clonazione in corso...
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Stiamo creando una copia del tuo sito. Questo richiederà alcuni minuti.
                  </p>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      Job ID: <span className="font-mono font-semibold">{result.jobId}</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Tempo stimato: {result.estimatedTime || '5-15 minuti'}
                    </p>
                  </div>
                </div>
              )}

              {result.status === 'completed' && (
                <div>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Clonazione Completata!
                    </h3>
                    <p className="text-gray-600">
                      Controlla tutte le pagine e conferma per procedere
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                    <p className="text-sm text-gray-700 mb-2">Il tuo sito clonato è disponibile qui:</p>
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0da2e7] hover:text-[#0b8acc] font-semibold text-lg break-all"
                    >
                      {result.url}
                    </a>
                  </div>

                  {/* Lista pagine clonate */}
                  {result.pages && result.pages.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        📄 Pagine Clonate ({result.pages.length})
                      </h4>
                      <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto">
                        {result.pages.map((page, idx) => (
                          <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-[#0da2e7] transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">{page.title}</h5>
                                <p className="text-xs text-gray-500 mt-1">{page.filename}</p>
                              </div>
                              <a
                                href={page.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#0da2e7] hover:text-[#0b8acc] text-sm flex items-center gap-1"
                              >
                                Visualizza
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Preview del sito clonato */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">🎨 Anteprima Homepage</h4>
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#0da2e7] text-white px-4 py-2 rounded-lg hover:bg-[#0b8acc] text-sm flex items-center gap-2 transition-colors font-medium"
                      >
                        Apri in Nuova Scheda
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                    <div className="border-4 border-gray-200 rounded-lg overflow-hidden bg-white shadow-lg">
                      <div className="bg-gray-100 px-4 py-2 flex items-center gap-2 border-b border-gray-200">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-600 font-mono">
                          {result.url}
                        </div>
                      </div>
                      <iframe
                        src={result.url}
                        className="w-full h-[500px] border-0"
                        title="Anteprima sito clonato"
                        sandbox="allow-scripts allow-same-origin"
                        onError={() => console.error('Errore caricamento iframe')}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Preview del sito clonato - Controlla che tutto sia corretto
                    </p>
                  </div>

                  {/* Warning e pulsante conferma */}
                  <div className="mb-6 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Importante: Controlla tutte le pagine
                    </h4>
                    <p className="text-sm text-yellow-800 mb-4">
                      Prima di finalizzare, verifica che tutte le pagine siano state clonate correttamente.
                      Clicca sui link sopra per visualizzare ogni pagina. Dopo la conferma, il sito sarà
                      ottimizzato per il puntamento DNS.
                    </p>
                    <button
                      onClick={handleFinalize}
                      disabled={loading}
                      className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-lg shadow-lg"
                    >
                      {loading ? 'Finalizzazione in corso...' : '✓ Conferma e Finalizza per DNS'}
                    </button>
                  </div>
                </div>
              )}

              {result.status === 'finalized' && (
                <div>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Sito Finalizzato e Pronto!
                    </h3>
                    <p className="text-gray-600">
                      Ora puoi puntare il tuo dominio seguendo le istruzioni qui sotto
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-green-900">Sito ottimizzato</h4>
                        <p className="text-sm text-green-700">Tutti i link sono stati convertiti per il puntamento DNS</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">Path del sito clonato:</p>
                    <code className="block bg-white border border-green-300 rounded px-3 py-2 text-sm font-mono text-gray-800">
                      /public/cloned-sites/{result.subdomain}/
                    </code>
                  </div>

                  <DNSInstructions subdomain={result.subdomain} />

                  {/* Lista pagine finalizzate */}
                  {result.pages && result.pages.length > 0 && (
                    <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-3">
                        📄 Pagine Finalizzate ({result.pages.length})
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {result.pages.map((page, idx) => (
                          <div key={idx} className="bg-white rounded px-3 py-2 border border-blue-200">
                            <span className="text-green-600 mr-2">✓</span>
                            <span className="text-gray-700">{page.filename}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold mb-2 text-purple-900">Prossimi step:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-purple-800">
                      <li>Configura il tuo dominio seguendo le istruzioni DNS sopra</li>
                      <li>Attendi la propagazione DNS (fino a 24-48 ore)</li>
                      <li>Verifica che il sito sia raggiungibile dal tuo dominio</li>
                      <li>Contattaci per integrare le funzionalità SmileAgent AI</li>
                    </ol>
                  </div>
                </div>
              )}

              {result.status === 'failed' && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Clonazione Fallita
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Si è verificato un errore durante la clonazione del sito
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-700">{result.error}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DNSInstructions({ subdomain }: { subdomain: string }) {
  return (
    <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
      <h4 className="font-semibold text-blue-900 mb-3">
        Configurazione DNS per il tuo dominio
      </h4>
      <p className="text-sm text-blue-800 mb-4">
        Per puntare il tuo dominio al nuovo sito, aggiungi questo record nel pannello del tuo provider DNS (es. Aruba, Register, GoDaddy):
      </p>

      <div className="bg-white p-4 rounded-lg border border-blue-300">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-gray-500 font-medium mb-1">Tipo</div>
            <div className="font-mono font-semibold bg-gray-100 px-2 py-1 rounded">CNAME</div>
          </div>
          <div>
            <div className="text-gray-500 font-medium mb-1">Nome</div>
            <div className="font-mono font-semibold bg-gray-100 px-2 py-1 rounded">www</div>
          </div>
          <div>
            <div className="text-gray-500 font-medium mb-1">Valore</div>
            <div className="font-mono font-semibold bg-gray-100 px-2 py-1 rounded text-xs break-all">
              {subdomain}.agentia.app
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-blue-700 space-y-1">
        <p>💡 La propagazione DNS può richiedere da pochi minuti fino a 24-48 ore</p>
        <p>💡 Se usi il dominio root (senza www), crea un record A invece del CNAME</p>
        <p>💡 Hai bisogno di aiuto? Contattaci a support@smileagent.it</p>
      </div>
    </div>
  );
}
