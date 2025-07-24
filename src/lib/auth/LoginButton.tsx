import { useMsal } from '@azure/msal-react';
import { Button } from '@mantine/core';
import { loginRequest } from '@/config/authConfig';

export function LoginButton() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch((e) => {
      console.error('Login failed:', e);
    });
  };

  return (
    <Button onClick={handleLogin} variant="filled">
      Sign In
    </Button>
  );
}