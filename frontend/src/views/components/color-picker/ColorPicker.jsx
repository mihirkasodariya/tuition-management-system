import React, { useState, useEffect, memo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Check, Pipette, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HexColorPicker } from 'react-colorful';

// Default color presets - you can customize these
const defaultPresets = [
  '#000000',
  '#ffffff',
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#cddc39',
  '#ffeb3b',
  '#ffc107',
  '#ff9800',
  '#ff5722',
  '#795548',
  '#607d8b',
];

const ColorPicker = ({
  value = '#fffff',
  onChange,
  presets = defaultPresets,
  label = 'Color',
  className,
  showInput = true,
  allowCustomColors = true,
  onAddToPresets,
}) => {
  const [color, setColor] = useState(value);
  const [activeTab, setActiveTab] = useState('presets');
  const [customPresets, setCustomPresets] = useState([]);

  // Update internal state when prop value changes
  useEffect(() => {
    setColor(value);
  }, [value]);

  // Load custom presets from localStorage if available
  useEffect(() => {
    const savedPresets = localStorage.getItem('customColorPresets');
    if (savedPresets) {
      try {
        setCustomPresets(JSON.parse(savedPresets));
      } catch (e) {
        console.error('Failed to parse saved color presets');
      }
    }
  }, []);

  // Ensure color has # prefix
  const ensureHash = (color) => {
    if (color.startsWith('#')) return color;
    return `#${color}`;
  };

  // Handle color change and ensure it's valid
  const handleColorChange = (newColor) => {
    const processedColor = ensureHash(newColor);
    setColor(processedColor);
    onChange?.(processedColor);
  };

  // Handle hex input change
  const handleHexChange = (e) => {
    let hex = e.target.value;

    // Remove # if entered
    if (hex.startsWith('#')) {
      hex = hex.substring(1);
    }

    // Only update if it's a valid hex character
    if (/^[0-9A-Fa-f]*$/.test(hex)) {
      handleColorChange(`#${hex}`);
    }
  };

  // Add current color to custom presets
  const addToPresets = () => {
    if (!customPresets.includes(color)) {
      const updatedPresets = [...customPresets, color];
      setCustomPresets(updatedPresets);
      localStorage.setItem('customColorPresets', JSON.stringify(updatedPresets));
      onAddToPresets?.(updatedPresets);
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label>{label}</Label>}

      <Popover>
        <PopoverTrigger asChild>
          <button
            className="h-8 w-full flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 hover:bg-gray-100"
            type="button"
          >
            <div
              className="h-5 w-5 rounded-sm border border-gray-200"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm text-gray-600">{color}</span>
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-64 p-3">
          <div className="mb-4">
            <div
              className="h-20 w-full rounded-md border mb-2"
              style={{ backgroundColor: color }}
            />

            {showInput && (
              <div className="flex items-center mt-2">
                <div className="mr-2">#</div>
                <Input
                  value={color.replace('#', '')}
                  onChange={handleHexChange}
                  className="font-mono"
                  maxLength={6}
                />
              </div>
            )}
          </div>

          {allowCustomColors && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="grid grid-cols-2 mb-2">
                <TabsTrigger value="presets">Presets</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
              </TabsList>

              <TabsContent value="presets" className="mt-0">
                <div className="grid grid-cols-5 gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset}
                      className="flex h-6 w-6 items-center justify-center rounded-sm border"
                      style={{ backgroundColor: preset }}
                      onClick={() => handleColorChange(preset)}
                      type="button"
                    >
                      {color.toLowerCase() === preset.toLowerCase() && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </button>
                  ))}
                </div>

                {customPresets.length > 0 && (
                  <div className="mt-3">
                    <Label className="text-xs mb-2 block">Custom Colors</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {customPresets.map((preset) => (
                        <button
                          key={preset}
                          className="flex h-6 w-6 items-center justify-center rounded-sm border"
                          style={{ backgroundColor: preset }}
                          onClick={() => handleColorChange(preset)}
                          type="button"
                        >
                          {color.toLowerCase() === preset.toLowerCase() && (
                            <Check className="h-4 w-4 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="custom" className="space-y-3 mt-0">
                <div className="w-full">
                  <HexColorPicker color={color} onChange={handleColorChange} className="w-full" />
                </div>

                <button
                  onClick={addToPresets}
                  className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                  type="button"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add to custom colors
                </button>
              </TabsContent>
            </Tabs>
          )}

          <div className="mt-3 border-t pt-3 text-xs text-gray-500">
            Click anywhere outside to close
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default memo(ColorPicker);
