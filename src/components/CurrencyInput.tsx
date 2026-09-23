import React, { useRef, useEffect, useState, useCallback } from 'react';

export interface CurrencyInputProps {
  id?: string;
  value: number | string | undefined;
  onChangeValue?: (val: number) => void;
  onValueChange?: (values: { floatValue?: number; formattedValue: string; value: string }) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  autoSelectOnFocus?: boolean;
}

/**
 * Converte valor (numérico ou string) para centavos inteiros
 */
function parseValueToCents(val: string | number | undefined): number {
  if (val === undefined || val === null || val === '') return 0;
  if (typeof val === 'number') {
    return Math.round(val * 100);
  }
  const str = String(val).replace(/[R$\s]/g, '').trim();
  if (!str) return 0;

  if (str.includes(',')) {
    const cleaned = str.replace(/\./g, '').replace(',', '.');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : Math.round(num * 100);
  }

  if (str.includes('.')) {
    const parts = str.split('.');
    if (parts.length === 2 && parts[1].length <= 2) {
      const num = parseFloat(str);
      return isNaN(num) ? 0 : Math.round(num * 100);
    }
    const num = parseFloat(str.replace(/\./g, ''));
    return isNaN(num) ? 0 : Math.round(num * 100);
  }

  const num = parseFloat(str);
  return isNaN(num) ? 0 : Math.round(num * 100);
}

/**
 * Formata centavos no padrão monetário BRL (R$ 0,00)
 */
function formatCentsToBRL(cents: number): string {
  const reais = cents / 100;
  return `R$ ${new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(reais)}`;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  id,
  value,
  onChangeValue,
  onValueChange,
  disabled = false,
  placeholder = 'R$ 0,00',
  className = '',
  autoSelectOnFocus = true,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingCaretEndRef = useRef<boolean>(false);

  const initialCents = parseValueToCents(value);
  const [cents, setCents] = useState<number>(initialCents);
  const [isFreshFocus, setIsFreshFocus] = useState<boolean>(false);

  // Sincroniza com o valor externo quando alterado pelo componente pai
  useEffect(() => {
    const newCents = parseValueToCents(value);
    setCents(newCents);
  }, [value]);

  // Garante que o cursor permaneça no final da máscara após digitação
  useEffect(() => {
    if (pendingCaretEndRef.current && inputRef.current) {
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
      pendingCaretEndRef.current = false;
    }
  });

  const displayValue = formatCentsToBRL(cents);

  const notify = useCallback(
    (newCents: number) => {
      const floatVal = newCents / 100;
      const formatted = formatCentsToBRL(newCents);
      const valueStr = floatVal.toString();

      if (onValueChange) {
        onValueChange({
          floatValue: floatVal,
          formattedValue: formatted,
          value: valueStr,
        });
      }
      if (onChangeValue) {
        onChangeValue(floatVal);
      }
    },
    [onValueChange, onChangeValue]
  );

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFreshFocus(true);
    if (autoSelectOnFocus) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.select();
        }
      }, 15);
    }
  };

  const handleBlur = () => {
    setIsFreshFocus(false);
  };

  const handleClick = () => {
    // Se o usuário clicar sem selecionar texto, posiciona o cursor ao final
    const input = inputRef.current;
    if (!input) return;
    if (input.selectionStart === input.selectionEnd) {
      const len = input.value.length;
      input.setSelectionRange(len, len);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    const input = inputRef.current;
    if (!input) return;

    const key = e.key;
    const { selectionStart, selectionEnd } = input;
    const isFullSelection =
      selectionStart !== selectionEnd &&
      (selectionEnd! - selectionStart! >= displayValue.length - 3 || isFreshFocus);

    // Permite teclas de controle e navegação
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
        setIsFreshFocus(false);
      }
      return;
    }

    // 1. DIGITAÇÃO DE DÍGITOS (0-9): MÁSCARA ATM / CAIXA ELETRÔNICO
    // Ex: digita 1 -> 0,01; digita 0 -> 0,10; digita 0 -> 1,00; digita 0 -> 10,00; digita 0 -> 100,00
    if (/^\d$/.test(key)) {
      e.preventDefault();

      let nextCents: number;
      if (isFullSelection || (isFreshFocus && cents > 0)) {
        // Ao começar a digitar um novo valor com o campo selecionado / recém-focado:
        nextCents = parseInt(key, 10);
      } else {
        // Concatena o novo dígito ao final da sequência existente
        const currentStr = cents === 0 ? '' : cents.toString();
        // Limita a até 12 dígitos para evitar estouro
        if (currentStr.length >= 12) return;
        const newStr = (currentStr + key).replace(/^0+/, '');
        nextCents = newStr ? parseInt(newStr, 10) : 0;
      }

      setIsFreshFocus(false);
      setCents(nextCents);
      pendingCaretEndRef.current = true;
      notify(nextCents);
      return;
    }

    // 2. BACKSPACE: Remove o último dígito inserido (desloca para a direita)
    if (key === 'Backspace') {
      e.preventDefault();

      let nextCents: number;
      if (isFullSelection) {
        nextCents = 0;
      } else {
        const currentStr = cents.toString();
        if (currentStr.length <= 1) {
          nextCents = 0;
        } else {
          nextCents = parseInt(currentStr.slice(0, -1), 10) || 0;
        }
      }

      setIsFreshFocus(false);
      setCents(nextCents);
      pendingCaretEndRef.current = true;
      notify(nextCents);
      return;
    }

    // 3. DELETE: Zera o valor
    if (key === 'Delete') {
      e.preventDefault();
      setIsFreshFocus(false);
      setCents(0);
      pendingCaretEndRef.current = true;
      notify(0);
      return;
    }

    // Bloqueia qualquer outro caractere (inclusive vírgula e ponto, pois a máscara é automática em centavos)
    e.preventDefault();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    const nextCents = parseValueToCents(text);
    setIsFreshFocus(false);
    setCents(nextCents);
    pendingCaretEndRef.current = true;
    notify(nextCents);
  };

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      inputMode="numeric"
      disabled={disabled}
      value={displayValue}
      placeholder={placeholder}
      onChange={() => {
        // Manipulado com precisão matemática por onKeyDown e onPaste
      }}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={className}
    />
  );
};
