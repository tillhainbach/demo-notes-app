import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import LoaderButton from '../components/LoaderButton';
import { Auth } from 'aws-amplify';
import { useAppContext } from '../lib/contextLib';
import { useNavigate } from 'react-router-dom';
import { useFormFields } from '../lib/hooksLib';
import { onError } from '../lib/errorLib';
import './Login.css';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: '',
    password: '',
  });
  const { userHasAuthenticated } = useAppContext() ?? {};
  const navigate = useNavigate();

  const validateForm = () => {
    return fields.email.length > 0 && fields.password.length > 0;
  };

  const handleSubmit: React.FormEventHandler = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      await Auth.signIn(fields.email, fields.password);
      userHasAuthenticated?.(true);
      navigate('/');
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <div className="d-grid gap-2 mt-4">
          <LoaderButton
            isLoading={isLoading}
            variant="primary"
            size="lg"
            type="submit"
            disabled={!validateForm()}
          >
            Login
          </LoaderButton>
        </div>
      </Form>
    </div>
  );
}
