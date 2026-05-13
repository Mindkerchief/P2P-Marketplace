'use client';

import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Auth2 } from '@/components/auth/Auth2';
import { AuthContainer } from '@/components/auth/AuthContainer';
import { getSessionMeta, sendPostRequest } from '@/services/authService';
import { useUser } from '@/utils/UserContext';
import { AUTH_LIMITS } from '@/utils/validation';

import { validateLoginForm } from './_utils/validation';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { saveUserData } = useUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Use the name attribute as the key
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate auth input before sending request to backend
    const validationError = validateLoginForm(form);
    if (validationError) {
      toast.error(validationError, { position: 'top-center' });
      setLoading(false);
      return;
    }

    try {
      // Get the user's IP address and user agent
      const { ipAddress, userAgent } = await getSessionMeta();
      // Send the form data to the backend
      const data = await sendPostRequest(
        '/auth/login',
        { ...form, ipAddress, userAgent },
        true,
      );
      console.log('Logged in user:', data.user);
      saveUserData(data.user);

      // Role-based redirect
      const role = data.user?.role;
      if (role === 'SUPER_ADMIN' || role === 'ADMIN') router.push('/admin');
      else router.push('/');
    } catch (error: any) {
      if (error === 'Failed to fetch') {
        error = 'Login failed. Please contact support.';
      }
      toast.error(error, { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <form className="p-6 md:p-8" onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground text-balance">
              Login to your P2P Marketplace account
            </p>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              name="email"
              type="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={handleChange}
              minLength={AUTH_LIMITS.emailMinLength}
              maxLength={AUTH_LIMITS.emailMaxLength}
              required
            />
          </Field>
          <Field>
            <div className="flex items-center">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Link
                href="/forgot-password"
                className="ml-auto text-sm underline-offset-2 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                className="pr-10"
                minLength={AUTH_LIMITS.passwordMinLength}
                maxLength={AUTH_LIMITS.passwordMaxLength}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </Field>
          <Field>
            <Button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Field>

          {/* <Auth2 /> */}

          <FieldDescription className="text-center">
            Don&apos;t have an account? <Link href="/signup">Sign up</Link>
          </FieldDescription>
        </FieldGroup>
      </form>
    </AuthContainer>
  );
}
