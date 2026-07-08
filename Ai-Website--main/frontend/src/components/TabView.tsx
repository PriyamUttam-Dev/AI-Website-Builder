import { Code2, Eye } from 'lucide-react';

interface TabViewProps {
  activeTab: 'code' | 'preview';
  onTabChange: (tab: 'code' | 'preview') => void;
}

export function TabView({ activeTab, onTabChange }: TabViewProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="inline-flex rounded-xl bg-black/20 p-1 ring-1 ring-white/10">
        <button
          onClick={() => onTabChange('code')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
            activeTab === 'code'
              ? 'bg-white/10 text-white ring-1 ring-white/10'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          <Code2 className="w-4 h-4" />
          Code
        </button>
        <button
          onClick={() => onTabChange('preview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
            activeTab === 'preview'
              ? 'bg-white/10 text-white ring-1 ring-white/10'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>
      </div>

      <div className="hidden text-xs text-white/50 sm:block">Tip: switch to Preview after steps complete</div>
    </div>
  );
}