import { useState } from 'react';
import Form from 'react-bootstrap/Form';

type OnChange = NonNullable<Parameters<typeof Form.Control>[0]['onChange']>;

export function useFormFields<FormData extends object>(
  initialState: FormData
): [FormData, OnChange] {
  const [fields, setValues] = useState(initialState);

  const onChange: OnChange = (event) => {
    setValues({ ...fields, [event.target.id]: event.target.value });
  };

  return [fields, onChange];
}
