import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="SmileAgent Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-2xl font-bold text-[#0da2e7]">SmileAgent</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#servizi" className="text-gray-700 hover:text-[#0da2e7] transition-colors">
                Servizi
              </Link>
              <Link href="#template" className="text-gray-700 hover:text-[#0da2e7] transition-colors">
                Template Siti
              </Link>
              <Link href="#pricing" className="text-gray-700 hover:text-[#0da2e7] transition-colors">
                Prezzi
              </Link>
              <Link
                href="#trial"
                className="bg-[#0da2e7] text-white px-6 py-2 rounded-full hover:bg-[#0b8acc] transition-colors font-medium"
              >
                Inizia Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Il Tuo Studio Dentistico,
              <span className="text-[#0da2e7]"> Sempre Operativo</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Risparmia <span className="font-semibold text-[#0da2e7]">15-20 ore/settimana</span> con
              l'assistente IA che gestisce telefonate, appuntamenti e social media H24
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="#trial"
                className="bg-[#0da2e7] text-white px-8 py-4 rounded-full hover:bg-[#0b8acc] transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Prova Gratis 14 Giorni
              </Link>
              <Link
                href="#demo"
                className="border-2 border-[#0da2e7] text-[#0da2e7] px-8 py-4 rounded-full hover:bg-blue-50 transition-colors font-semibold text-lg"
              >
                Guarda Demo
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              ✓ Setup in 1 ora · ✓ Nessuna carta richiesta · ✓ Cancella quando vuoi
            </p>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#0da2e7]">-60%</div>
              <div className="text-gray-600 mt-2">No-show appuntamenti</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#0da2e7]">H24/7</div>
              <div className="text-gray-600 mt-2">Assistenza pazienti</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#0da2e7]">-75%</div>
              <div className="text-gray-600 mt-2">Costi vs segretaria</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problema -> Soluzione */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Stanco di Vivere al Telefono?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="text-red-500 text-xl">✗</div>
                  <p className="text-gray-700">
                    <span className="font-semibold">30-50 chiamate/giorno</span> che interrompono continuamente il lavoro
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-red-500 text-xl">✗</div>
                  <p className="text-gray-700">
                    <span className="font-semibold">15-20% pazienti non si presentano</span> = €150-300 persi per slot
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-red-500 text-xl">✗</div>
                  <p className="text-gray-700">
                    <span className="font-semibold">€2.500/mese per segretaria</span> + contributi e ferie da gestire
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-red-500 text-xl">✗</div>
                  <p className="text-gray-700">
                    <span className="font-semibold">15-20 ore/settimana</span> sprecate in attività ripetitive
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                La Soluzione SmileAgent
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="text-[#10b981] text-xl">✓</div>
                  <p className="text-gray-700">
                    <span className="font-semibold">Assistente IA H24</span> risponde su chat, telefono e WhatsApp
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-[#10b981] text-xl">✓</div>
                  <p className="text-gray-700">
                    <span className="font-semibold">Promemoria intelligenti</span> riducono no-show del 40-60%
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-[#10b981] text-xl">✓</div>
                  <p className="text-gray-700">
                    <span className="font-semibold">€599/mese all-inclusive</span> vs €2.500+ segretaria
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-[#10b981] text-xl">✓</div>
                  <p className="text-gray-700">
                    <span className="font-semibold">Tutto automatizzato</span> e operativo in 1 ora
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7 Servizi Dettagliati */}
      <section id="servizi" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              7 Servizi in <span className="text-[#0da2e7]">Un'Unica Piattaforma</span>
            </h2>
            <p className="text-xl text-gray-600">
              Tutto ciò che serve al tuo studio, integrato e automatizzato
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Servizio 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-[#0da2e7] rounded-xl flex items-center justify-center text-white text-2xl mb-4">
                💬
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Assistente AI H24
              </h3>
              <p className="text-gray-600 mb-4">
                Chatbot intelligente su web, WhatsApp, Instagram e Facebook che risponde ai pazienti 24/7
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span>Risposte immediate basate su knowledge base studio</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span>Prenota appuntamenti autonomamente</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span>Raccoglie lead e informazioni pazienti</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span>Trasferisce a umano quando necessario</span>
                </li>
              </ul>
            </div>

            {/* Servizio 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border border-purple-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center text-white text-2xl mb-4">
                📞
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Telefonia IA
              </h3>
              <p className="text-gray-600 mb-4">
                Risponditore telefonico con voce italiana naturale che gestisce le chiamate come un umano
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span>Numero italiano +39 dedicato</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span>Voce naturale maschile/femminile</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span>Booking appuntamenti vocale</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span>Trascrizione e sintesi automatica</span>
                </li>
              </ul>
            </div>

            {/* Servizio 3 */}
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-green-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-[#10b981] rounded-xl flex items-center justify-center text-white text-2xl mb-4">
                📅
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Calendario & Appuntamenti
              </h3>
              <p className="text-gray-600 mb-4">
                Gestione completa appuntamenti con sync Google Calendar e promemoria automatici
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span>Calendario multi-operatore</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span>Sync bidirezionale Google Calendar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span>Promemoria WhatsApp/Email/SMS automatici</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span>Riduce no-show del 40-60%</span>
                </li>
              </ul>
            </div>

            {/* Servizio 4 */}
            <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl border border-pink-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-pink-600 rounded-xl flex items-center justify-center text-white text-2xl mb-4">
                📱
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Social Media Automation
              </h3>
              <p className="text-gray-600 mb-4">
                Genera e pubblica contenuti professionali su Instagram e Facebook automaticamente
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span>AI genera caption e hashtag ottimizzati</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span>Creazione immagini con DALL-E</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span>Programmazione calendario editoriale</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span>Analytics engagement e reach</span>
                </li>
              </ul>
            </div>

            {/* Servizio 5 */}
            <div className="bg-gradient-to-br from-yellow-50 to-white p-8 rounded-2xl border border-yellow-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-yellow-600 rounded-xl flex items-center justify-center text-white text-2xl mb-4">
                ✉️
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Email Automation
              </h3>
              <p className="text-gray-600 mb-4">
                Sequenze email automatiche per conferme, promemoria e follow-up pazienti
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span>Template professionali personalizzabili</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span>Conferme e promemoria automatici</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span>Follow-up post-visita e recall periodici</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span>Tracking aperture e click</span>
                </li>
              </ul>
            </div>

            {/* Servizio 6 */}
            <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl border border-indigo-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl mb-4">
                👥
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                CRM Integrato
              </h3>
              <p className="text-gray-600 mb-4">
                Gestione completa pazienti con storico attività e segmentazione avanzata
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span>Auto-creazione profili da conversazioni</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span>Timeline completa attività paziente</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span>Note e tag personalizzati</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span>Segmentazione per campagne mirate</span>
                </li>
              </ul>
            </div>

            {/* Servizio 7 */}
            <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl border border-orange-100 hover:shadow-xl transition-shadow md:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 bg-orange-600 rounded-xl flex items-center justify-center text-white text-2xl mb-4">
                📊
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Analytics Avanzate
              </h3>
              <p className="text-gray-600 mb-4">
                Dashboard completa con KPI, metriche e insights per ottimizzare il tuo studio
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span>Conversazioni totali e tasso conversione</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span>No-show rate e tempo risposta</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span>ROI piattaforma e performance social</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span>Report PDF e export dati</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sezione Template Siti Web */}
      <section id="template" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Non Hai Ancora un <span className="text-[#0da2e7]">Sito Web?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nessun problema! Creiamo il tuo sito professionale completo di SmileAgent integrato.
              Scegli tra i nostri template ottimizzati per studi dentistici.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Template 1 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 h-48 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">🦷</div>
                  <p className="text-gray-700 font-semibold">Template Moderno</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">SmilePro</h3>
                <p className="text-gray-600 mb-4">
                  Design moderno e pulito, perfetto per studi che vogliono un look professionale e minimalista
                </p>
                <ul className="space-y-2 text-sm text-gray-700 mb-4">
                  <li className="flex items-center gap-2">
                    <span className="text-[#10b981]">✓</span>
                    <span>Homepage + 5 pagine</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#10b981]">✓</span>
                    <span>SmileAgent integrato</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#10b981]">✓</span>
                    <span>Mobile responsive</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#10b981]">✓</span>
                    <span>SEO ottimizzato</span>
                  </li>
                </ul>
                <button className="w-full bg-[#0da2e7] text-white py-3 rounded-lg hover:bg-[#0b8acc] transition-colors font-medium">
                  Anteprima
                </button>
              </div>
            </div>

            {/* Template 2 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow border-2 border-[#0da2e7]">
              <div className="bg-[#0da2e7] text-white text-sm font-bold py-1 text-center">
                PIÙ POPOLARE
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-pink-200 h-48 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">✨</div>
                  <p className="text-gray-700 font-semibold">Template Premium</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">DentalLux</h3>
                <p className="text-gray-600 mb-4">
                  Template premium con animazioni, galleria prima/dopo e sezione team completa
                </p>
                <ul className="space-y-2 text-sm text-gray-700 mb-4">
                  <li className="flex items-center gap-2">
                    <span className="text-[#10b981]">✓</span>
                    <span>Homepage + 8 pagine</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#10b981]">✓</span>
                    <span>SmileAgent + Chat avanzata</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#10b981]">✓</span>
                    <span>Galleria prima/dopo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#10b981]">✓</span>
                    <span>Animazioni premium</span>
                  </li>
                </ul>
                <button className="w-full bg-[#0da2e7] text-white py-3 rounded-lg hover:bg-[#0b8acc] transition-colors font-medium">
                  Anteprima
                </button>
              </div>
            </div>

            {/* Template 3 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
              <div className="bg-gradient-to-br from-green-100 to-teal-200 h-48 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">🌿</div>
                  <p className="text-gray-700 font-semibold">Template Naturale</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">FreshSmile</h3>
                <p className="text-gray-600 mb-4">
                  Design fresco e accogliente, ideale per studi che vogliono comunicare naturalezza e benessere
                </p>
                <ul className="space-y-2 text-sm text-gray-700 mb-4">
                  <li className="flex items-center gap-2">
                    <span className="text-[#10b981]">✓</span>
                    <span>Homepage + 6 pagine</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#10b981]">✓</span>
                    <span>SmileAgent integrato</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#10b981]">✓</span>
                    <span>Blog integrato</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#10b981]">✓</span>
                    <span>Form contatto avanzato</span>
                  </li>
                </ul>
                <button className="w-full bg-[#0da2e7] text-white py-3 rounded-lg hover:bg-[#0b8acc] transition-colors font-medium">
                  Anteprima
                </button>
              </div>
            </div>
          </div>

          <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Pacchetto Completo Sito + SmileAgent
            </h3>
            <p className="text-gray-600 mb-6">
              Sito web professionale + SmileAgent incluso per 12 mesi a prezzo speciale
            </p>
            <div className="text-4xl font-bold text-[#0da2e7] mb-6">
              €1.999 <span className="text-lg text-gray-500 font-normal">una tantum</span>
            </div>
            <button className="bg-[#0da2e7] text-white px-8 py-4 rounded-full hover:bg-[#0b8acc] transition-colors font-semibold text-lg shadow-lg">
              Richiedi Preventivo
            </button>
            <p className="text-sm text-gray-500 mt-4">
              ✓ Consegna in 7-10 giorni · ✓ 3 revisioni incluse · ✓ Hosting primo anno gratuito
            </p>
          </div>
        </div>
      </section>

      {/* Come Funziona */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Come <span className="text-[#0da2e7]">Funziona</span>
            </h2>
            <p className="text-xl text-gray-600">
              Operativo in 1 ora, senza competenze tecniche
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#0da2e7] rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Setup Guidato</h3>
              <p className="text-gray-600">
                Carica i documenti del tuo studio: listino prezzi, FAQ, orari. L'IA impara automaticamente in 5 minuti.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#0da2e7] rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Personalizza</h3>
              <p className="text-gray-600">
                Connetti calendario, social media e numero di telefono. Configura il tono di voce e le preferenze.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#0da2e7] rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Operativo H24</h3>
              <p className="text-gray-600">
                Il tuo assistente IA è attivo 24/7. Gestisce chiamate, prenota appuntamenti e risponde ai pazienti.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Prezzi <span className="text-[#0da2e7]">Trasparenti</span>
            </h2>
            <p className="text-xl text-gray-600">
              Scegli il piano perfetto per il tuo studio. Prova gratis 14 giorni.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Piano Starter */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
              <p className="text-gray-600 mb-6">Per studi individuali e micro-team</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">€299</span>
                <span className="text-gray-600">/mese</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span className="text-gray-700">1.000 conversazioni chat/mese</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span className="text-gray-700">50 chiamate (150 min/mese)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span className="text-gray-700">Calendario + Google sync</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span className="text-gray-700">5 post social/mese</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span className="text-gray-700">500 email/mese</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span className="text-gray-700">CRM base</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span className="text-gray-700">Supporto email</span>
                </li>
              </ul>
              <button className="w-full bg-gray-200 text-gray-900 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                Inizia Prova Gratuita
              </button>
            </div>

            {/* Piano Business */}
            <div className="bg-white p-8 rounded-2xl shadow-2xl border-2 border-[#0da2e7] transform scale-105">
              <div className="bg-[#0da2e7] text-white text-sm font-bold py-1 px-3 rounded-full inline-block mb-4">
                PIÙ POPOLARE
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Business</h3>
              <p className="text-gray-600 mb-6">Per studi professionali 3-10 persone</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-[#0da2e7]">€599</span>
                <span className="text-gray-600">/mese</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span className="text-gray-700"><strong>3.000 conversazioni/mese</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span className="text-gray-700"><strong>200 chiamate (600 min/mese)</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span className="text-gray-700">Multi-calendario team</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span className="text-gray-700"><strong>20 post social/mese</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span className="text-gray-700">2.000 email/mese</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span className="text-gray-700">WhatsApp integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span className="text-gray-700">Analytics avanzate</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span className="text-gray-700">Supporto prioritario chat</span>
                </li>
              </ul>
              <button className="w-full bg-[#0da2e7] text-white py-3 rounded-lg hover:bg-[#0b8acc] transition-colors font-medium">
                Inizia Prova Gratuita
              </button>
            </div>

            {/* Piano Premium */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
              <p className="text-gray-600 mb-6">Per studi strutturati 10+ persone</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">€999</span>
                <span className="text-gray-600">/mese</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span className="text-gray-700"><strong>Chat e chiamate illimitate</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span className="text-gray-700">Multi-operatore round-robin</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span className="text-gray-700"><strong>50 post social/mese</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span className="text-gray-700">5.000 email/mese</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span className="text-gray-700">API access</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span className="text-gray-700">Branding personalizzato</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span className="text-gray-700">Account manager dedicato</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span>
                  <span className="text-gray-700">SLA 99.9%</span>
                </li>
              </ul>
              <button className="w-full bg-gray-200 text-gray-900 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                Contattaci
              </button>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600">
              ✓ Tutti i piani includono 14 giorni di prova gratuita · ✓ Nessuna carta di credito richiesta · ✓ Cancella in qualsiasi momento
            </p>
          </div>
        </div>
      </section>

      {/* CTA Finale */}
      <section id="trial" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0da2e7] to-[#0b8acc] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto a Trasformare il Tuo Studio?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Inizia oggi la prova gratuita di 14 giorni. Nessuna carta richiesta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#0da2e7] px-8 py-4 rounded-full hover:bg-gray-100 transition-colors font-semibold text-lg shadow-lg">
              Inizia Prova Gratuita
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white/10 transition-colors font-semibold text-lg">
              Parla con un Esperto
            </button>
          </div>
          <p className="mt-8 text-sm opacity-75">
            Setup in 1 ora · Supporto in italiano · GDPR compliant
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/logo.png"
                  alt="SmileAgent Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <h3 className="text-white font-bold text-xl">SmileAgent</h3>
              </div>
              <p className="text-sm">
                La piattaforma all-in-one per automatizzare il tuo studio dentistico con intelligenza artificiale.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Prodotto</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#servizi" className="hover:text-white transition-colors">Servizi</Link></li>
                <li><Link href="#template" className="hover:text-white transition-colors">Template Siti</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Prezzi</Link></li>
                <li><Link href="#demo" className="hover:text-white transition-colors">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Azienda</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#about" className="hover:text-white transition-colors">Chi Siamo</Link></li>
                <li><Link href="#contact" className="hover:text-white transition-colors">Contatti</Link></li>
                <li><Link href="#privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#terms" className="hover:text-white transition-colors">Termini di Servizio</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contatti</h4>
              <ul className="space-y-2 text-sm">
                <li>Milano, Italia</li>
                <li>info@smileagent.it</li>
                <li>+39 02 1234 5678</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 SmileAgent S.R.L. - P.IVA 12345678901 - Tutti i diritti riservati</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
