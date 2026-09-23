/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { demos } from './config/demos';
import { DemoConfig } from './config/defaultConfig';
import { demoDataMap } from './data/demoData';
import {
  Appointment,
  Client,
  Service,
  Professional,
  FinancialRecord,
  ClientHistoryItem,
  DashboardMetrics,
} from './types';
import {
  applyBrandColorsToDocument,
  getStoredDemoId,
  setStoredDemoId,
  clearLocalStorageDemoData,
} from './utils/demoHelpers';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { NewAppointmentModal } from './components/NewAppointmentModal';

import { Dashboard } from './pages/Dashboard';
import { Agenda } from './pages/Agenda';
import { Appointments } from './pages/Appointments';
import { Clients } from './pages/Clients';
import { ClientDetails } from './pages/ClientDetails';
import { Services } from './pages/Services';
import { Professionals } from './pages/Professionals';
import { Financial } from './pages/Financial';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { DemoConfigurator } from './pages/DemoConfigurator';

export default function App() {
  // Check URL param ?presentation=true
  const isPresentationUrl =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('presentation') === 'true';

  // Demo selection & presentation state
  const [currentDemoId, setCurrentDemoId] = useState<string>(() => {
    return getStoredDemoId() || 'salao';
  });

  const [presentationMode, setPresentationMode] = useState<boolean>(isPresentationUrl);
  const [currentRoute, setCurrentRoute] = useState<string>('dashboard');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Active configuration
  const [config, setConfig] = useState<DemoConfig>(() => {
    return demos[currentDemoId] || demos.salao;
  });

  // Business state loaded from demo data
  const currentDemoData = demoDataMap[currentDemoId] || demoDataMap.salao;

  const [appointments, setAppointments] = useState<Appointment[]>(currentDemoData.appointments);
  const [clients, setClients] = useState<Client[]>(currentDemoData.clients);
  const [services, setServices] = useState<Service[]>(currentDemoData.services);
  const [professionals, setProfessionals] = useState<Professional[]>(currentDemoData.professionals);
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>(currentDemoData.financialRecords);
  const [clientHistory, setClientHistory] = useState<Record<string, ClientHistoryItem[]>>(currentDemoData.clientHistories);

  // New appointment modal
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState<boolean>(false);
  const [presetTime, setPresetTime] = useState<string>('10:00');

  // Apply colors when config changes
  useEffect(() => {
    applyBrandColorsToDocument(config.colors);
    document.title = `${config.business.name} | Agendamento & Gestão`;
  }, [config]);

  // Handle demo switch
  const handleSelectDemo = (demoId: string) => {
    const nextConfig = demos[demoId] || demos.salao;
    const nextData = demoDataMap[demoId] || demoDataMap.salao;

    setCurrentDemoId(demoId);
    setStoredDemoId(demoId);
    setConfig(nextConfig);

    setAppointments(nextData.appointments);
    setClients(nextData.clients);
    setServices(nextData.services);
    setProfessionals(nextData.professionals);
    setFinancialRecords(nextData.financialRecords);
    setClientHistory(nextData.clientHistories);
    setSelectedClientId(null);

    // If on a page that is disabled in the next segment, route back to dashboard
    if (nextConfig.features.professionals === false && currentRoute === 'professionals') {
      setCurrentRoute('dashboard');
    }
  };

  // Toggle presentation mode
  const handleTogglePresentation = () => {
    const next = !presentationMode;
    setPresentationMode(next);
    if (next && currentRoute === 'demo-config') {
      setCurrentRoute('dashboard');
    }
  };

  // Approving an appointment
  const handleApproveAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'confirmado' } : a))
    );
  };

  // Rejecting an appointment
  const handleRejectAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'cancelado' } : a))
    );
  };

  // Adding a new appointment
  const handleAddAppointment = (newApp: Appointment) => {
    setAppointments((prev) => [newApp, ...prev]);

    // Also create a financial record if confirmed
    if (newApp.status === 'confirmado' && config.features.financial !== false) {
      const newRecord: FinancialRecord = {
        id: `fin-${Date.now()}`,
        date: 'Hoje',
        clientName: newApp.clientName,
        serviceName: newApp.serviceName,
        professionalName: newApp.professionalName,
        amount: newApp.price,
        paymentMethod: 'PIX',
        status: 'concluido',
      };
      setFinancialRecords((prev) => [newRecord, ...prev]);
    }
  };

  // Adding a new client
  const handleAddClient = (newClient: Client) => {
    setClients((prev) => [newClient, ...prev]);
  };

  // Updating client notes
  const handleUpdateClientNotes = (clientId: string, newNotes: string) => {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, notes: newNotes } : c))
    );
  };

  // Adding a new service
  const handleAddService = (newService: Service) => {
    setServices((prev) => [...prev, newService]);
  };

  // Updating a service
  const handleUpdateService = (updated: Service) => {
    setServices((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
  };

  // Updating config from Settings or DemoConfigurator
  const handleUpdateFullConfig = (newConfig: DemoConfig) => {
    setConfig(newConfig);
  };

  const handleUpdatePartialConfig = (partial: Partial<DemoConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...partial,
      features: { ...prev.features, ...partial.features },
      business: { ...prev.business, ...partial.business },
    }));
  };

  // Regenerate demo data with fresh variations
  const handleRegenerateData = () => {
    const base = demoDataMap[currentDemoId] || demoDataMap.salao;
    // Add realistic timestamps and shuffle slightly
    setAppointments([...base.appointments]);
    setClients([...base.clients]);
  };

  // Reset to original demo defaults
  const handleResetToDefaults = () => {
    clearLocalStorageDemoData();
    handleSelectDemo(currentDemoId);
  };

  // Open new appointment modal with optional preset time
  const handleOpenNewAppointmentModal = (time?: string) => {
    if (time) setPresetTime(time);
    setIsNewAppointmentOpen(true);
  };

  // Selected client for details page
  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];
  const clientAppointments = selectedClient
    ? appointments.filter((a) => a.clientName.toLowerCase().includes(selectedClient.name.toLowerCase()))
    : [];
  const selectedHistory = selectedClient && clientHistory[selectedClient.id] ? clientHistory[selectedClient.id] : [];

  // Compute live metrics for the active segment
  const todayAppointments = appointments.filter((a) => a.date === 'Hoje');
  const pendingAppointments = appointments.filter((a) => a.status === 'pendente');
  const revenueToday = todayAppointments.reduce((acc, a) => acc + (a.status !== 'cancelado' ? a.price : 0), 0);

  const dynamicMetrics: DashboardMetrics = {
    ...currentDemoData.dashboardMetrics,
    appointmentsToday: todayAppointments.length || currentDemoData.dashboardMetrics.appointmentsToday,
    revenueToday: revenueToday || currentDemoData.dashboardMetrics.revenueToday,
    clientsThisMonth: clients.length + 80,
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar
        config={config}
        currentRoute={currentRoute}
        onRouteChange={(route) => {
          setCurrentRoute(route);
          if (route !== 'client-details') {
            setSelectedClientId(null);
          }
        }}
        pendingCount={pendingAppointments.length}
        presentationMode={presentationMode}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Sticky Top Header adhering to 3-zone contract */}
        <Header
          config={config}
          presentationMode={presentationMode}
          onTogglePresentation={handleTogglePresentation}
          onSelectDemo={handleSelectDemo}
          onOpenNewAppointment={() => handleOpenNewAppointmentModal('10:00')}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          currentRoute={currentRoute}
        />

        {/* Scrollable Content Canvas */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {currentRoute === 'dashboard' && (
              <Dashboard
                config={config}
                metrics={dynamicMetrics}
                todayAppointments={todayAppointments}
                pendingAppointments={pendingAppointments}
                onApproveAppointment={handleApproveAppointment}
                onRejectAppointment={handleRejectAppointment}
                onNavigate={(route) => setCurrentRoute(route)}
                onOpenNewAppointment={() => handleOpenNewAppointmentModal('11:00')}
              />
            )}

            {currentRoute === 'agenda' && (
              <Agenda
                config={config}
                appointments={appointments}
                professionals={professionals}
                onOpenNewAppointment={(slot) => handleOpenNewAppointmentModal(slot || '09:00')}
              />
            )}

            {currentRoute === 'appointments' && (
              <Appointments
                config={config}
                appointments={appointments}
                professionals={professionals}
                onApproveAppointment={handleApproveAppointment}
                onRejectAppointment={handleRejectAppointment}
                onOpenNewAppointment={() => handleOpenNewAppointmentModal('10:00')}
              />
            )}

            {currentRoute === 'clients' && (
              <Clients
                config={config}
                clients={clients}
                onSelectClient={(id) => {
                  setSelectedClientId(id);
                  setCurrentRoute('client-details');
                }}
                onAddClient={handleAddClient}
              />
            )}

            {currentRoute === 'client-details' && selectedClient && (
              <ClientDetails
                config={config}
                client={selectedClient}
                history={selectedHistory}
                clientAppointments={clientAppointments}
                onBack={() => {
                  setSelectedClientId(null);
                  setCurrentRoute('clients');
                }}
                onUpdateClientNotes={handleUpdateClientNotes}
                onOpenNewAppointment={() => handleOpenNewAppointmentModal('14:00')}
              />
            )}

            {currentRoute === 'services' && (
              <Services
                config={config}
                services={services}
                onAddService={handleAddService}
                onUpdateService={handleUpdateService}
              />
            )}

            {currentRoute === 'professionals' && (
              <Professionals
                config={config}
                professionals={professionals}
              />
            )}

            {currentRoute === 'financial' && (
              <Financial
                config={config}
                records={financialRecords}
              />
            )}

            {currentRoute === 'reports' && (
              <Reports
                config={config}
                professionals={professionals}
                topServices={currentDemoData.dashboardMetrics.topServices}
              />
            )}

            {currentRoute === 'settings' && (
              <Settings
                config={config}
                onUpdateConfig={handleUpdatePartialConfig}
              />
            )}

            {currentRoute === 'demo-config' && !presentationMode && (
              <DemoConfigurator
                currentConfig={config}
                onUpdateFullConfig={handleUpdateFullConfig}
                onSwitchSegmentPreset={handleSelectDemo}
                onRegenerateData={handleRegenerateData}
                onResetToDefaults={handleResetToDefaults}
                onEnterPresentationMode={() => {
                  setPresentationMode(true);
                  setCurrentRoute('dashboard');
                }}
              />
            )}
          </div>
        </main>
      </div>

      {/* Global New Appointment Modal */}
      <NewAppointmentModal
        isOpen={isNewAppointmentOpen}
        onClose={() => setIsNewAppointmentOpen(false)}
        config={config}
        clients={clients}
        services={services}
        professionals={professionals}
        onAddAppointment={handleAddAppointment}
        initialTime={presetTime}
        initialDate="Hoje"
      />
    </div>
  );
}
