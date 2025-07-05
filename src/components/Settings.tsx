import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface GlowSettings {
  enabled: boolean;
  color: string;
  duration: number; // in seconds
  blurRadius: number; // blur intensity from 1-10
}

const DEFAULT_SETTINGS: GlowSettings = {
  enabled: true,
  color: 'green',
  duration: 3,
  blurRadius: 5
};

const COLOR_OPTIONS = [
  { name: 'Green', value: 'green', baseClass: 'ring-green-400 shadow-green-400' },
  { name: 'Blue', value: 'blue', baseClass: 'ring-blue-400 shadow-blue-400' },
  { name: 'Purple', value: 'purple', baseClass: 'ring-purple-400 shadow-purple-400' },
  { name: 'Pink', value: 'pink', baseClass: 'ring-pink-400 shadow-pink-400' },
  { name: 'Orange', value: 'orange', baseClass: 'ring-orange-400 shadow-orange-400' },
  { name: 'Red', value: 'red', baseClass: 'ring-red-400 shadow-red-400' },
  { name: 'Yellow', value: 'yellow', baseClass: 'ring-yellow-400 shadow-yellow-400' },
  { name: 'Cyan', value: 'cyan', baseClass: 'ring-cyan-400 shadow-cyan-400' }
];

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<GlowSettings>(DEFAULT_SETTINGS);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  // Function to get blur class based on blur radius
  const getBlurClass = (blurRadius: number) => {
    const blurMap: { [key: number]: string } = {
      1: '/10', 2: '/20', 3: '/25', 4: '/30', 5: '/35', 
      6: '/40', 7: '/45', 8: '/50', 9: '/60', 10: '/75'
    };
    return blurMap[blurRadius] || '/35';
  };

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('glowSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (error) {
        console.error('Error parsing glow settings:', error);
      }
    }
  }, []);

  // Manual save function
  const saveSettings = () => {
    localStorage.setItem('glowSettings', JSON.stringify(settings));
    setShowSaveConfirmation(true);
    setTimeout(() => setShowSaveConfirmation(false), 2000);
  };

  const updateSetting = (key: keyof GlowSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const selectedColorOption = COLOR_OPTIONS.find(option => option.value === settings.color);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto pt-8 pb-20 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/app')}
            className="text-2xl hover:opacity-80 transition-opacity"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold">Settings</h1>
          <div className="w-8"></div> {/* Spacer for centering */}
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Glow Effect</h2>
            <p className="text-sm text-gray-600 mb-6">
              Customize the glow effect that appears when you add a state to your rankings.
            </p>

            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <label className="font-medium text-gray-700">Enable Glow Effect</label>
                <p className="text-sm text-gray-500">Show a glow around newly ranked states</p>
              </div>
              <button
                onClick={() => updateSetting('enabled', !settings.enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.enabled ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <label className="font-medium text-gray-700 mb-3 block">Glow Color</label>
              <div className="grid grid-cols-4 gap-2">
                {COLOR_OPTIONS.map((colorOption) => (
                  <button
                    key={colorOption.value}
                    onClick={() => updateSetting('color', colorOption.value)}
                    disabled={!settings.enabled}
                    className={`p-3 rounded-lg border transition-all ${
                      settings.color === colorOption.value
                        ? 'border-gray-800 bg-gray-100'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${!settings.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className={`w-6 h-6 rounded-full mx-auto bg-${colorOption.value}-400`}></div>
                    <span className="text-xs text-gray-600 mt-1 block">{colorOption.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Slider */}
            <div className="mb-6">
              <label className="font-medium text-gray-700 mb-3 block">
                Glow Duration: {settings.duration} seconds
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={settings.duration}
                onChange={(e) => updateSetting('duration', parseFloat(e.target.value))}
                disabled={!settings.enabled}
                className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${
                  !settings.enabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1s</span>
                <span>10s</span>
              </div>
            </div>

            {/* Blur Radius Slider */}
            <div className="mb-6">
              <label className="font-medium text-gray-700 mb-3 block">
                Glow Blur: {settings.blurRadius}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={settings.blurRadius}
                onChange={(e) => updateSetting('blurRadius', parseInt(e.target.value))}
                disabled={!settings.enabled}
                className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${
                  !settings.enabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Sharp</span>
                <span>Very Blurred</span>
              </div>
            </div>

            {/* Preview */}
            {settings.enabled && (
              <div className="mb-6">
                <label className="font-medium text-gray-700 mb-3 block">Preview</label>
                <div className={`flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-200 ring-2 ${selectedColorOption?.baseClass}${getBlurClass(settings.blurRadius)} shadow-lg`}>
                  <div className="flex items-center">
                    <div className="w-12 h-12 mr-3 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-500">State</span>
                    </div>
                    <div>
                      <h3 className="font-bold">Sample State</h3>
                      <p className="text-sm text-gray-500">Sample Property</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold">1</span>
                </div>
              </div>
            )}

            {/* Save and Reset Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={saveSettings}
                className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                {showSaveConfirmation ? '✓ Saved!' : 'Save Settings'}
              </button>
              <button
                onClick={resetToDefaults}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Reset to Defaults
              </button>
            </div>

            {/* Save Confirmation */}
            {showSaveConfirmation && (
              <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-lg text-center font-medium">
                Settings saved successfully! ✨
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 