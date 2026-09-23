import React, { useState, useEffect } from 'react';
import { DemoConfig, BrandColors, TerminologyConfig } from '../config/defaultConfig';
import { demos } from '../config/demos';
import { AppFeatures } from '../config/features';
import { businessThemes, ColorThemePreset } from '../config/colorThemes';
import { downloadJsonFile, applyBrandColorsToDocument } from '../utils/demoHelpers';
import {
  Sparkles,
  Sliders,
  Palette,
  Layers,
  Database,
  Eye,
  Download,
  RotateCcw,
  Save,
  Check,
  CheckCircle2,
  Filter,
} from 'lucide-react';

interface DemoConfiguratorProps {
  currentConfig: DemoConfig;
  onUpdateFullConfig: (newConfig: DemoConfig) => void;
  onSwitchSegmentPreset: (presetId: string) => void;
  onRegenerateData: () => void;
  onResetToDefaults: () => void;
  onEnterPresentationMode: () => void;
}

export const DemoConfigurator: React.FC<DemoConfiguratorProps> = ({
  currentConfig,
  onUpdateFullConfig,
  onSwitchSegmentPreset,
  onRegenerateData,
  onResetToDefaults,
  onEnterPresentationMode,
}) => {
  const [business, setBusiness] = useState(currentConfig.business);
  const [terminology, setTerminology] = useState<TerminologyConfig>(currentConfig.terminology);
  const [features, setFeatures] = useState<AppFeatures>(currentConfig.features);
  const [colors, setColors] = useState<BrandColors>(currentConfig.colors);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [themeFilter, setThemeFilter] = useState<'current' | 'all'>('current');

  // Keep local state in sync when currentConfig changes from outside
  useEffect(() => {
    setBusiness(currentConfig.business);
    setTerminology(currentConfig.terminology);
    setFeatures(currentConfig.features);
    setColors(currentConfig.colors);
  }, [currentConfig]);

  // Handle Preset Segment Change
  const handlePresetChange = (presetId: string) => {
    onSwitchSegmentPreset(presetId);
    const target = demos[presetId] || demos.salao;
    setBusiness(target.business);
    setTerminology(target.terminology);
    setFeatures(target.features);
    setColors(target.colors);
    setSelectedThemeId(null);
    applyBrandColorsToDocument(target.colors);
  };

  // Live Apply a Color Theme Preset
  const handleApplyThemePreset = (theme: ColorThemePreset) => {
    setSelectedThemeId(theme.id);
    setColors(theme.colors);
    applyBrandColorsToDocument(theme.colors);

    // Apply live to global config so the whole app updates immediately
    const updated: DemoConfig = {
      ...currentConfig,
      business,
      terminology,
      features,
      colors: theme.colors,
    };
    onUpdateFullConfig(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Live Custom Color Change
  const handleColorChange = (key: keyof BrandColors, value: string) => {
    const updatedColors = {
      ...colors,
      [key]: value,
      ...(key === 'primary' ? { primaryHover: value } : {}),
    };
    setColors(updatedColors);
    applyBrandColorsToDocument(updatedColors);
    setSelectedThemeId(null); // customized

    // Live update
    onUpdateFullConfig({
      ...currentConfig,
      business,
      terminology,
      features,
      colors: updatedColors,
    });
  };

  // Toggle Features Live
  const handleFeatureToggle = (featureKey: keyof AppFeatures) => {
    const updatedFeatures = {
      ...features,
      [featureKey]: !features[featureKey],
    };
    setFeatures(updatedFeatures);
    onUpdateFullConfig({
      ...currentConfig,
      business,
      terminology,
      features: updatedFeatures,
      colors,
    });
  };

  // Save Full Config to LocalStorage / State
  const handleSave = () => {
    const updated: DemoConfig = {
      ...currentConfig,
      business,
      terminology,
      features,
      colors,
    };
    onUpdateFullConfig(updated);
    applyBrandColorsToDocument(colors);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  // Export JSON
  const handleExportJson = () => {
    const exportPayload = {
      demoId: currentConfig.id,
      exportedAt: new Date().toISOString(),
      business,
      terminology,
      features,
      colors,
    };
    downloadJsonFile(exportPayload, `demo-config-${currentConfig.id}.json`);
  };

  // Themes filtered by segment
  const recommendedThemes = businessThemes.filter((t) => t.segment === currentConfig.id);
  const otherThemes = businessThemes.filter((t) => t.segment !== currentConfig.id);
  const displayedThemes = themeFilter === 'current' ? recommendedThemes : businessThemes;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Top Banner with Quick Actions */}
      <div className="app-card border-indigo-200 bg-gradient-to-r from-indigo-50/70 via-slate-50 to-white flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              Configurador da Demonstração Comercial
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            Altere a identidade visual, temas por ramo de negócio, terminologias e módulos ativados em tempo real.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={onEnterPresentationMode}
            className="flex-1 sm:flex-initial btn-secondary text-xs py-2 px-3 border-indigo-200 text-indigo-700 hover:bg-indigo-100/50 justify-center"
            title="Ocultar elementos de configuração para demonstração limpa"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Modo Apresentação</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex-1 sm:flex-initial btn-primary text-xs py-2 px-4 justify-center"
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Salvo e Aplicado!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Salvar Configuração</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 1. SELETOR RÁPIDO DE SEGMENTO PRESET */}
      <div className="app-card space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Sliders className="w-4 h-4 text-indigo-600 shrink-0" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            1. Troca Rápida de Segmento do Negócio
          </h3>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Selecione o nicho da empresa:
          </label>
          <select
            value={currentConfig.id}
            onChange={(e) => handlePresetChange(e.target.value)}
            className="app-select text-xs sm:text-sm font-medium w-full"
          >
            <option value="salao">Salão de Beleza (Studio Bella)</option>
            <option value="barbearia">Barbearia Clássica (Barber 88)</option>
            <option value="clinica">Clínica Médica (Clínica Horizonte)</option>
            <option value="estetica">Clínica Estética (Essenza)</option>
            <option value="psicologia">Consultório de Psicologia (Espaço Mente)</option>
            <option value="petshop">Pet Shop & Estética Animal (PetCare)</option>
            <option value="generico">Atendimento Geral & Consultoria (AtendeMais)</option>
          </select>
          <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
            Ao selecionar um segmento, todas as terminologias, paleta de cores recomendada, serviços e profissionais são atualizados instantaneamente em toda a aplicação.
          </p>
        </div>
      </div>

      {/* 2. TEMAS E PALETAS COERENTES COM O RAMO DO NEGÓCIO */}
      <div className="app-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-600 shrink-0" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              2. Paletas & Temas Coerentes com o Ramo
            </h3>
          </div>

          {/* Toggle filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/60 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setThemeFilter('current')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                themeFilter === 'current'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Recomendados ({recommendedThemes.length})
            </button>
            <button
              type="button"
              onClick={() => setThemeFilter('all')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                themeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos os Temas ({businessThemes.length})
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-600">
          Escolha um tema desenvolvido especificamente para este nicho. O clique aplica a identidade visual instantaneamente na barra superior, menus, botões e cartões:
        </p>

        {/* Theme Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {displayedThemes.map((theme) => {
            const isSelected =
              selectedThemeId === theme.id ||
              (colors.primary.toLowerCase() === theme.colors.primary.toLowerCase() &&
                colors.background.toLowerCase() === theme.colors.background.toLowerCase());

            return (
              <div
                key={theme.id}
                onClick={() => handleApplyThemePreset(theme)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 text-left relative group ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                <div>
                  {/* Top Bar: Title & Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        {theme.name}
                        {isSelected && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 inline" />
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {theme.segmentName}
                      </p>
                    </div>

                    {theme.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-slate-100 text-slate-600 uppercase tracking-wider shrink-0">
                        {theme.badge}
                      </span>
                    )}
                  </div>

                  {/* 4-Stripe Color Palette Preview */}
                  <div className="mt-2.5 flex h-6 w-full rounded-md overflow-hidden border border-slate-200/80 shadow-2xs">
                    <div
                      className="flex-1 transition-all"
                      style={{ backgroundColor: theme.colors.primary }}
                      title={`Primária: ${theme.colors.primary}`}
                    />
                    <div
                      className="flex-1 transition-all"
                      style={{ backgroundColor: theme.colors.accent }}
                      title={`Destaque: ${theme.colors.accent}`}
                    />
                    <div
                      className="flex-1 transition-all"
                      style={{ backgroundColor: theme.colors.secondary }}
                      title={`Secundária: ${theme.colors.secondary}`}
                    />
                    <div
                      className="flex-1 transition-all"
                      style={{ backgroundColor: theme.colors.background }}
                      title={`Fundo: ${theme.colors.background}`}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {theme.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-slate-400 text-[10px]">
                    {theme.colors.primary}
                  </span>
                  <span
                    className={`font-semibold transition-colors ${
                      isSelected ? 'text-indigo-600' : 'text-slate-500 group-hover:text-slate-800'
                    }`}
                  >
                    {isSelected ? 'Tema Ativo' : 'Aplicar Tema'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Fine-Tuning Color Inputs */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">
              Ajuste Fino Manual das Cores (Customização precisa):
            </span>
            <span className="text-[11px] text-slate-400">
              Atualiza em tempo real
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Cor Primária
              </label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1 bg-white">
                <input
                  type="color"
                  value={colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-7 h-7 rounded border-none cursor-pointer p-0 bg-transparent shrink-0"
                />
                <span className="font-mono text-xs text-slate-700 truncate">{colors.primary}</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Destaque / Accent
              </label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1 bg-white">
                <input
                  type="color"
                  value={colors.accent}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="w-7 h-7 rounded border-none cursor-pointer p-0 bg-transparent shrink-0"
                />
                <span className="font-mono text-xs text-slate-700 truncate">{colors.accent}</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Secundária
              </label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1 bg-white">
                <input
                  type="color"
                  value={colors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="w-7 h-7 rounded border-none cursor-pointer p-0 bg-transparent shrink-0"
                />
                <span className="font-mono text-xs text-slate-700 truncate">{colors.secondary}</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Plano de Fundo
              </label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1 bg-white">
                <input
                  type="color"
                  value={colors.background}
                  onChange={(e) => handleColorChange('background', e.target.value)}
                  className="w-7 h-7 rounded border-none cursor-pointer p-0 bg-transparent shrink-0"
                />
                <span className="font-mono text-xs text-slate-700 truncate">{colors.background}</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Texto Principal
              </label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1 bg-white">
                <input
                  type="color"
                  value={colors.textPrimary}
                  onChange={(e) => handleColorChange('textPrimary', e.target.value)}
                  className="w-7 h-7 rounded border-none cursor-pointer p-0 bg-transparent shrink-0"
                />
                <span className="font-mono text-xs text-slate-700 truncate">{colors.textPrimary}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DADOS GERAIS DO ESTABELECIMENTO */}
      <div className="app-card space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Layers className="w-4 h-4 text-indigo-600 shrink-0" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            3. Dados Gerais do Estabelecimento
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome do Estabelecimento
            </label>
            <input
              type="text"
              value={business.name}
              onChange={(e) => {
                const updated = { ...business, name: e.target.value };
                setBusiness(updated);
                onUpdateFullConfig({ ...currentConfig, business: updated, terminology, features, colors });
              }}
              className="app-input text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Categoria / Ramo de Atuação
            </label>
            <input
              type="text"
              value={business.category}
              onChange={(e) => {
                const updated = { ...business, category: e.target.value };
                setBusiness(updated);
                onUpdateFullConfig({ ...currentConfig, business: updated, terminology, features, colors });
              }}
              className="app-input text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Slogan / Subtítulo
            </label>
            <input
              type="text"
              value={business.tagline}
              onChange={(e) => {
                const updated = { ...business, tagline: e.target.value };
                setBusiness(updated);
                onUpdateFullConfig({ ...currentConfig, business: updated, terminology, features, colors });
              }}
              className="app-input text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Telefone / Contato
            </label>
            <input
              type="text"
              value={business.phone}
              onChange={(e) => {
                const updated = { ...business, phone: e.target.value };
                setBusiness(updated);
                onUpdateFullConfig({ ...currentConfig, business: updated, terminology, features, colors });
              }}
              className="app-input text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Endereço / Localização
            </label>
            <input
              type="text"
              value={business.address}
              onChange={(e) => {
                const updated = { ...business, address: e.target.value };
                setBusiness(updated);
                onUpdateFullConfig({ ...currentConfig, business: updated, terminology, features, colors });
              }}
              className="app-input text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Caminho da Logo (Asset local)
            </label>
            <input
              type="text"
              value={business.logoUrl || '/src/assets/logo.png'}
              onChange={(e) => {
                const updated = { ...business, logoUrl: e.target.value };
                setBusiness(updated);
                onUpdateFullConfig({ ...currentConfig, business: updated, terminology, features, colors });
              }}
              className="app-input font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* 4. TERMINOLOGIA EDITÁVEL */}
      <div className="app-card space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Sliders className="w-4 h-4 text-indigo-600 shrink-0" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            4. Dicionário de Terminologia por Segmento
          </h3>
        </div>

        <p className="text-xs text-slate-600">
          Personalize as palavras visíveis em botões, tabelas, modais e títulos do sistema. As alterações têm efeito imediato:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Cliente (singular)
            </label>
            <input
              type="text"
              value={terminology.customer}
              onChange={(e) => {
                const updated = { ...terminology, customer: e.target.value };
                setTerminology(updated);
                onUpdateFullConfig({ ...currentConfig, business, terminology: updated, features, colors });
              }}
              className="app-input text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Clientes (plural)
            </label>
            <input
              type="text"
              value={terminology.customers}
              onChange={(e) => {
                const updated = { ...terminology, customers: e.target.value };
                setTerminology(updated);
                onUpdateFullConfig({ ...currentConfig, business, terminology: updated, features, colors });
              }}
              className="app-input text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Profissional (singular)
            </label>
            <input
              type="text"
              value={terminology.professional}
              onChange={(e) => {
                const updated = { ...terminology, professional: e.target.value };
                setTerminology(updated);
                onUpdateFullConfig({ ...currentConfig, business, terminology: updated, features, colors });
              }}
              className="app-input text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Profissionais (plural)
            </label>
            <input
              type="text"
              value={terminology.professionals}
              onChange={(e) => {
                const updated = { ...terminology, professionals: e.target.value };
                setTerminology(updated);
                onUpdateFullConfig({ ...currentConfig, business, terminology: updated, features, colors });
              }}
              className="app-input text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Serviço (singular)
            </label>
            <input
              type="text"
              value={terminology.service}
              onChange={(e) => {
                const updated = { ...terminology, service: e.target.value };
                setTerminology(updated);
                onUpdateFullConfig({ ...currentConfig, business, terminology: updated, features, colors });
              }}
              className="app-input text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Serviços (plural)
            </label>
            <input
              type="text"
              value={terminology.services}
              onChange={(e) => {
                const updated = { ...terminology, services: e.target.value };
                setTerminology(updated);
                onUpdateFullConfig({ ...currentConfig, business, terminology: updated, features, colors });
              }}
              className="app-input text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Agendamento (singular)
            </label>
            <input
              type="text"
              value={terminology.appointment}
              onChange={(e) => {
                const updated = { ...terminology, appointment: e.target.value };
                setTerminology(updated);
                onUpdateFullConfig({ ...currentConfig, business, terminology: updated, features, colors });
              }}
              className="app-input text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Agendamentos (plural)
            </label>
            <input
              type="text"
              value={terminology.appointments}
              onChange={(e) => {
                const updated = { ...terminology, appointments: e.target.value };
                setTerminology(updated);
                onUpdateFullConfig({ ...currentConfig, business, terminology: updated, features, colors });
              }}
              className="app-input text-xs"
            />
          </div>
        </div>
      </div>

      {/* 5. FUNCIONALIDADES & MÓDULOS (SWITCHES QUE ALTERAM A INTERFACE) */}
      <div className="app-card space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Layers className="w-4 h-4 text-indigo-600 shrink-0" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            5. Ativação / Desativação de Módulos (Feature Toggles)
          </h3>
        </div>

        <p className="text-xs text-slate-600">
          Estes interruptores ocultam ou exibem telas, colunas e menus instantaneamente:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Módulo {terminology.professionals || 'Profissionais'}
              </span>
              <span className="text-[11px] text-slate-500">
                Exibe menu, lista de membros e filtros por especialista
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleFeatureToggle('professionals')}
              className="app-switch shrink-0"
              data-checked={features.professionals}
            >
              <span className="app-switch-thumb" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Aprovação Manual Obrigatória
              </span>
              <span className="text-[11px] text-slate-500">
                Ativa seção de solicitações pendentes e fluxos de aceite
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleFeatureToggle('approvalRequired')}
              className="app-switch shrink-0"
              data-checked={features.approvalRequired}
            >
              <span className="app-switch-thumb" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Módulo Financeiro
              </span>
              <span className="text-[11px] text-slate-500">
                Extrato, formas de pagamento e métricas de receita
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleFeatureToggle('financial')}
              className="app-switch shrink-0"
              data-checked={features.financial}
            >
              <span className="app-switch-thumb" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Módulo de Relatórios
              </span>
              <span className="text-[11px] text-slate-500">
                Gráficos analíticos e indicadores de desempenho
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleFeatureToggle('reports')}
              className="app-switch shrink-0"
              data-checked={features.reports}
            >
              <span className="app-switch-thumb" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Controle de Comissões
              </span>
              <span className="text-[11px] text-slate-500">
                Exibe taxa de comissão por especialista e cálculo
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleFeatureToggle('commissions')}
              className="app-switch shrink-0"
              data-checked={features.commissions}
            >
              <span className="app-switch-thumb" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Histórico Clínico / Detalhes
              </span>
              <span className="text-[11px] text-slate-500">
                Anotações e timeline de atendimentos passados
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleFeatureToggle('history')}
              className="app-switch shrink-0"
              data-checked={features.history}
            >
              <span className="app-switch-thumb" />
            </button>
          </div>
        </div>
      </div>

      {/* 6. GERENCIAMENTO DE DADOS & EXPORTAÇÃO */}
      <div className="app-card space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Database className="w-4 h-4 text-indigo-600 shrink-0" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            6. Dados Fictícios & Exportação
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onRegenerateData}
            className="flex-1 sm:flex-initial btn-secondary text-xs py-2 px-3 justify-center"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Gerar Novos Dados Fictícios</span>
          </button>

          <button
            type="button"
            onClick={handleExportJson}
            className="flex-1 sm:flex-initial btn-secondary text-xs py-2 px-3 justify-center"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Exportar Configuração (JSON)</span>
          </button>

          <button
            type="button"
            onClick={onResetToDefaults}
            className="flex-1 sm:flex-initial btn-subtle text-xs py-2 px-3 text-rose-600 hover:bg-rose-50 justify-center"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrão da Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
