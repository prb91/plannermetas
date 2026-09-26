import React, { useRef, useState, useEffect, useCallback } from 'react';

interface PercentInputProps {
  id?: string;
  value: string | number;
  onChange?: (formatted: string, floatVal: number) => void;
  onChangeValue?: (floatVal: number) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  autoSelectOnFocus?: boolean;
}

export function parseToPoints(val: string | number | undefined | null): number {
  if (val == null || val === '') return 0;
  if (typeof val === 'number') {
    if (val <= 1) {
      return Math.round(val * 10000);
    }
    return Math.round(val * 100);
  }
  const clean = String(val).replace(/[%\s]/g, '').trim();
  if (!clean) return 0;

  if (clean.includes(',')) {
    const [whole, dec = ''] = clean.split(',');
    const wNum = parseInt(whole.replace(/\D/g, ''), 10) || 0;
    const dNum = parseInt(dec.slice(0, 2).padEnd(2, '0'), 10) || 0;
    return wNum * 100 + dNum;
  }

  if (clean.includes('.')) {
    const [whole, dec = ''] = clean.split('.');
    const wNum = parseInt(whole.replace(/\D/g, ''), 10) || 0;
    const dNum = parseInt(dec.slice(0, 2).padEnd(2, '0'), 10) || 0;
    return wNum * 100 + dNum;
  }

  const num = parseInt(clean.replace(/\D/g, ''), 10);
  if (isNaN(num)) return 0;
  return num;
}

export function formatPointsToPercent(points: number): string {
  const value = points / 100;
  return `${value.toFixed(2).replace('.', ',')}%`;
}

export const PercentInput: React.FC<PercentInputProps> = ({
  id,
  value,
  onChange,
  onChangeValue,
  disabled = false,
  placeholder = '0,32%',
  className = '',
  autoSelectOnFocus = true,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isKeyAction = useRef(false);
  const initialPoints = parseToPoints(value);
  const [points, setPoints] = useState<number>(initialPoints);
  const [isSelectedAll, setIsSelectedAll] = useState(false);

  useEffect(() => {
    const newPoints = parseToPoints(value);
    setPoints(newPoints);
  }, [value]);

  const formattedDisplay = formatPointsToPercent(points);

  useEffect(() => {
    if (isKeyAction.current && inputRef.current) {
      const len = formattedDisplay.length;
      const pos = formattedDisplay.endsWith('%') ? Math.max(0, len - 1) : len;
      inputRef.current.setSelectionRange(pos, pos);
      isKeyAction.current = false;
    }
  });

  const notifyChange = useCallback(
    (newPoints: number) => {
      const formatted = newPoints === 0 ? '' : formatPointsToPercent(newPoints);
      const floatVal = newPoints / 10000;
      if (onChange) {
        onChange(formatted, floatVal);
      }
      if (onChangeValue) {
        onChangeValue(floatVal);
      }
    },
    [onChange, onChangeValue]
  );

  const handleFocus = () => {
    setIsSelectedAll(true);
    if (autoSelectOnFocus) {
      setTimeout(() => {
        inputRef.current?.select();
      }, 15);
    }
  };

  const handleBlur = () => {
    setIsSelectedAll(false);
  };

  const handleClick = () => {
    const el = inputRef.current;
    if (el && el.selectionStart === el.selectionEnd) {
      const len = formattedDisplay.length;
      const pos = formattedDisplay.endsWith('%') ? Math.max(0, len - 1) : len;
      el.setSelectionRange(pos, pos);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    const el = inputRef.current;
    if (!el) return;

    const key = e.key;
    const { selectionStart, selectionEnd } = el;
    const isSelected =
      selectionStart !== selectionEnd &&
      (selectionEnd! - selectionStart! >= formattedDisplay.length - 2 || isSelectedAll);

    if (
      e.ctrlKey ||
      e.metaKey ||
      e.altKey ||
      key === 'Tab' ||
      key === 'Enter' ||
      key === 'Escape' ||
      key === 'ArrowUp' ||
      key === 'ArrowDown' ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight' ||
      key === 'Home' ||
      key === 'End'
    ) {
      if (key === 'ArrowLeft' || key === 'ArrowRight') {
        setIsSelectedAll(false);
      }
      return;
    }

    if (/^\d$/.test(key)) {
      e.preventDefault();
      let nextPoints: number;
      if (isSelected || (isSelectedAll && points > 0)) {
        nextPoints = parseInt(key, 10);
      } else {
        const pointsStr = points === 0 ? '' : points.toString();
        if (pointsStr.length >= 4) return; // formato xx,xx (máx. 4 dígitos: 99,99%)
        const combined = (pointsStr + key).replace(/^0+/, '');
        nextPoints = combined ? parseInt(combined, 10) : 0;
      }
      setIsSelectedAll(false);
      setPoints(nextPoints);
      isKeyAction.current = true;
      notifyChange(nextPoints);
      return;
    }

    if (key === 'Backspace') {
      e.preventDefault();
      let nextPoints: number;
      if (isSelected || isSelectedAll) {
        nextPoints = 0;
      } else {
        const pointsStr = points.toString();
        if (pointsStr.length <= 1) {
          nextPoints = 0;
        } else {
          nextPoints = parseInt(pointsStr.slice(0, -1), 10) || 0;
        }
      }
      setIsSelectedAll(false);
      setPoints(nextPoints);
      isKeyAction.current = true;
      notifyChange(nextPoints);
      return;
    }

    if (key === 'Delete') {
      e.preventDefault();
      setIsSelectedAll(false);
      setPoints(0);
      isKeyAction.current = true;
      notifyChange(0);
      return;
    }

    e.preventDefault();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const newPoints = parseToPoints(pasteData);
    setIsSelectedAll(false);
    setPoints(newPoints);
    isKeyAction.current = true;
    notifyChange(newPoints);
  };

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      inputMode="numeric"
      value={points === 0 && !isSelectedAll ? '' : formattedDisplay}
      placeholder={placeholder}
      disabled={disabled}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onChange={() => {}}
      className={className}
    />
  );
};

export default PercentInput;
