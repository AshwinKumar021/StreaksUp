import { useCallback, useState } from "react";

type Validator<T> = (values: T) => Partial<Record<keyof T, string>>;

export default function useFormValidation<T extends object>(
  initialValues: T,
  validate: Validator<T>,
) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const setValue = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setValues((current) => ({ ...current, [key]: value }));
      setErrors((current) => ({ ...current, [key]: undefined }));
    },
    [],
  );

  const validateForm = useCallback(() => {
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setSubmitted(true);
    return !Object.values(nextErrors).some((message) => Boolean(message));
  }, [validate, values]);

  return { values, errors, setValue, validateForm, submitted };
}
