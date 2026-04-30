import { useCallback, useMemo, useState } from 'react';

type PackFormState = {
  difficultyRange: string;
  type: string;
  stepartists: string;
  year: string;
  download: string;
};

const defaultPackFormState: PackFormState = {
  difficultyRange: '',
  type: '',
  stepartists: '',
  year: '2026',
  download: ''
};

export type PackFormFields = keyof PackFormState;

export function usePackForm() {
  const [fields, setFields] = useState<PackFormState>(defaultPackFormState);

  const updateField = useCallback((name: PackFormFields, value: string) => {
    setFields(prev => ({ ...prev, [name]: value }));
  }, []);

  const optionalAttrs = useMemo(() => {
    const parsedYear = parseInt(fields.year, 10);
    return {
      difficultyRange: fields.difficultyRange || undefined,
      type: fields.type || undefined,
      stepartists: fields.stepartists || undefined,
      year: Number.isInteger(parsedYear) ? parsedYear : 2026,
      download: fields.download || undefined
    };
  }, [fields]);

  return {
    fields,
    updateField,
    optionalAttrs
  };
}
