import React, { useRef, useEffect, useState } from 'react';

export interface PercentageInputProps {
  id?: string;
  value: string | number;
  onChange: (formattedStr: string, floatVal: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Normaliza o valor recebido para o formato numérico limpo (ex: "0,32")
 */
function toRawString(val: string | number | undefined): string {
  if (val === undefined || val === null || val === '') return '';
  if (typeof val === 'number') {
    return (val * 100).toFixed(2).replace('.', ',');
  }
  const str = String(val).replace(/[%\s]/g, '').trim();
  return str;
}

/**
 * Converte string brasileira ("0,32" ou "1,5") para float decimal (ex: 0.0032)
 */
function rawToFloat(raw: string): number {
  if (!raw) return 0.0032;
  const cleaned = raw.replace(',', '.');
  const num = parseFloat(cleaned);
  if (isNaN(num)) return 0.0032;
  return num / 100;
}

/**
 * Componente de entrada de porcentagem preenchido estritamente da esquerda para a direita (xx,xx %)
 * Permite digitação natural de números, vírgula ou ponto, garantindo formato xx,xx %.
 */
export const PercentageInput: React.FC<PercentageInputProps> = ({
  id,
  value,
  onChange,
  placeholder = '0,32%',
  className = '',
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingCaretEndRef = useRef<boolean>(false);

  const [rawText, setRawText] = useState<string>(() => toRawString(value));
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isFreshFocus, setIsFreshFocus] = useState<boolean>(false);

  // Sincroniza com valor externo quando não estiver focado
  useEffect(() => {
    if (!isFocused) {
      setRawText(toRawString(value));
    }
  }, [value, isFocused]);

  // Mantém o cursor antes do '%' quando o usuário digita
  useEffect(() => {
    if (pendingCaretEndRef.current && inputRef.current) {
      const display = getDisplayValue();
      const caretPos = display.endsWith('%') ? Math.max(0, display.length - 1) : display.length;
      inputRef.current.setSelectionRange(caretPos, caretPos);
      pendingCaretEndRef.current = false;
    }
  });

  const getDisplayValue = (): string => {
    if (!rawText) return '';
    return `${rawText}%`;
  };

  const notifyChange = (newRaw: string) => {
    setRawText(newRaw);
    const floatVal = rawToFloat(newRaw);
    onChange(newRaw ? `${newRaw}%` : '', floatVal);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setIsFreshFocus(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.select();
      }
    }, 15);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setIsFreshFocus(false);

    let finalRaw = rawText.trim();
    if (!finalRaw) {
      setRawText('');
      onChange('', 0.0032);
      return;
    } else {
      // Normaliza no formato xx,xx ao sair do campo
      if (finalRaw.endsWith(',')) {
        finalRaw = `${finalRaw}00`;
      } else if (finalRaw.includes(',')) {
        const [int, dec = ''] = finalRaw.split(',');
        finalRaw = `${int || '0'},${dec.padEnd(2, '0').slice(0, 2)}`;
      } else {
        finalRaw = `${finalRaw},00`;
      }
    }
    setRawText(finalRaw);
    const floatVal = rawToFloat(finalRaw);
    onChange(`${finalRaw}%`, floatVal);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    const input = inputRef.current;
    if (!input) return;

    const key = e.key;
    const { selectionStart, selectionEnd } = input;
    const isFullSelection =
      selectionStart !== selectionEnd &&
      selectionEnd! - selectionStart! >= (rawText.length > 0 ? rawText.length : 1);

    // Permite teclas normais de navegação e atalhos
    if (
      e.ctrlKey ||
      e.metaKey ||
      e.altKey ||
      key === 'Tab' ||
      key === 'Enter' ||
      key === 'Escape' ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight' ||
      key === 'Home' ||
      key === 'End'
    ) {
      if (key === 'ArrowLeft' || key === 'ArrowRight') {
        setIsFreshFocus(false);
      }
      return;
    }

    // 1. DIGITAÇÃO DE NÚMEROS (0-9) - PREENCHIMENTO DA ESQUERDA PARA A DIREITA (xx,xx %)
    if (/^[0-9]$/.test(key)) {
      e.preventDefault();

      let nextRaw = '';
      if (isFullSelection || (isFreshFocus && rawText)) {
        // Se estava selecionado, inicia novo valor
        if (key === '0') {
          nextRaw = '0,';
        } else {
          nextRaw = key;
        }
      } else {
        // Digitação sequencial da esquerda para a direita
        if (!rawText) {
          nextRaw = key === '0' ? '0,' : key;
        } else if (rawText.includes(',')) {
          const [intPart, decPart = ''] = rawText.split(',');
          if (decPart.length < 2) {
            nextRaw = `${intPart},${decPart}${key}`;
          } else {
            // Já preencheu os 2 decimais (xx,xx), não adiciona mais
            return;
          }
        } else {
          if (rawText === '0') {
            nextRaw = `0,${key}`;
          } else if (rawText.length === 1) {
            nextRaw = `${rawText}${key}`;
          } else if (rawText.length === 2) {
            // Já possui 2 dígitos inteiros (ex: 12), o próximo número é o primeiro decimal!
            nextRaw = `${rawText},${key}`;
          } else {
            return;
          }
        }
      }

      setIsFreshFocus(false);
      pendingCaretEndRef.current = true;
      notifyChange(nextRaw);
      return;
    }

    // 2. VÍRGULA OU PONTO: Avança para a parte decimal
    if (key === ',' || key === '.') {
      e.preventDefault();
      let nextRaw = rawText;
      if (isFullSelection || (isFreshFocus && rawText)) {
        nextRaw = '0,';
      } else if (!rawText) {
        nextRaw = '0,';
      } else if (!rawText.includes(',')) {
        nextRaw = `${rawText},`;
      }
      setIsFreshFocus(false);
      pendingCaretEndRef.current = true;
      notifyChange(nextRaw);
      return;
    }

    // 3. BACKSPACE: Deleta o último caractere inserido da direita para a esquerda
    if (key === 'Backspace') {
      e.preventDefault();
      let nextRaw = '';
      if (isFullSelection) {
        nextRaw = '';
      } else {
        nextRaw = rawText.slice(0, -1);
      }
      setIsFreshFocus(false);
      pendingCaretEndRef.current = true;
      notifyChange(nextRaw);
      return;
    }

    // 4. DELETE: Limpa o campo
    if (key === 'Delete') {
      e.preventDefault();
      setIsFreshFocus(false);
      pendingCaretEndRef.current = true;
      notifyChange('');
      return;
    }

    // Bloqueia qualquer outro caractere
    e.preventDefault();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    const cleaned = pasted.replace(/[^\d,\.]/g, '');
    const parts = cleaned.split(/[,.]/);
    let intPart = parts[0] ? parts[0].slice(0, 2) : '0';
    let decPart = parts.slice(1).join('').slice(0, 2);

    let nextRaw = `${intPart},${decPart.padEnd(2, '0')}`;
    setIsFreshFocus(false);
    pendingCaretEndRef.current = true;
    notifyChange(nextRaw);
  };

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      inputMode="decimal"
      disabled={disabled}
      value={getDisplayValue()}
      placeholder={placeholder}
      onChange={() => {
        // Tratado com precisão via onKeyDown e onPaste
      }}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={className}
    />
  );
};
