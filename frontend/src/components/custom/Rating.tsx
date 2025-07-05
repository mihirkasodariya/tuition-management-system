// components/Rating.tsx

import { StarIcon } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface RatingProps {
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  name?: string;
  label?: string;
  tabIndex?: number;
}

export function Rating({
  value = 0,
  onChange,
  disabled = false,
  name = 'rating',
  tabIndex = 1,
  totalCount = 5,
}: RatingProps) {
  const handleValueChange = (val: string) => {
    if (onChange) {
      onChange(parseInt(val));
    }
  };

  return (
    <div className="space-y-2">
      <RadioGroup
        id={name}
        name={name}
        value={value ? value.toString() : ''}
        onValueChange={handleValueChange}
        disabled={disabled}
        className="flex gap-1 mt-1"
        tabIndex={tabIndex}
      >
        {[...Array(totalCount)].map((_, i) => (
          <div key={i + 1} className="flex items-center space-x-1">
            <RadioGroupItem
              value={(i + 1).toString()}
              id={`${name}-${i + 1}`}
              disabled={disabled}
              className="peer sr-only"
            />
            <Label
              htmlFor={`${name}-${i + 1}`}
              className={`cursor-pointer p-1 rounded-full transition-colors ${
                value >= i + 1 ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
              } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <StarIcon className="h-6 w-6 fill-current" />
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
