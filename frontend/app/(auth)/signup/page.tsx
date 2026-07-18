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
import { sendPostRequest } from '@/services/authService';
import type { SignupForm } from '@/types/forms';
import { AUTH_LIMITS } from '@/utils/validation';

import { validateSignupForm } from './utils/validation';

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState<SignupForm>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Use the name attribute as the key
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate user data before sending request to backend
    const validationErrors = validateSignupForm(form);
    if (validationErrors) {
      toast.error(validationErrors, { position: 'top-center' });
      setLoading(false);
      return;
    }

    try {
      // Send the form data to the backend
      await sendPostRequest('/auth/signup', form);

      // Store only what verify-email needs
      sessionStorage.setItem(
        'pending_signup',
        JSON.stringify({
          email: form.email,
          firstName: form.firstName,
          lastName: form.lastName,
          password: form.password,
        }),
      );

      // Redirect to email verification page
      router.push('/verify-email');
    } catch (error: any) {
      if (error === 'Failed to fetch') {
        error = 'Signup failed. Please contact support.';
      }
      toast.error(error, { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <AuthContainer>
      <form className="p-6 md:p-8" onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Enter your details below to create your account
            </p>
          </div>
          <Field>
            <FieldLabel htmlFor="firstName">First Name</FieldLabel>
            <Input
              name="firstName"
              type="text"
              value={form.firstName}
              onChange={handleChange}
              minLength={AUTH_LIMITS.nameMinLength}
              maxLength={AUTH_LIMITS.nameMaxLength}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
            <Input
              name="lastName"
              type="text"
              value={form.lastName}
              onChange={handleChange}
              minLength={AUTH_LIMITS.nameMinLength}
              maxLength={AUTH_LIMITS.nameMaxLength}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              name="email"
              type="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={handleChange}
              minLength={AUTH_LIMITS.emailMinLength}
              maxLength={AUTH_LIMITS.emailMaxLength}
              required
            />
          </Field>
          {/* TODO: Add password visibility toggle */}
          <Field>
            <Field className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
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
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="pr-10"
                    minLength={AUTH_LIMITS.passwordMinLength}
                    maxLength={AUTH_LIMITS.passwordMaxLength}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                    aria-label={
                      showConfirmPassword
                        ? 'Hide confirm password'
                        : 'Show confirm password'
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </Field>
            </Field>
          </Field>
          <Field>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Field>

          {/* <Auth2 /> */}

          <FieldDescription className="text-center">
            Already have an account? <Link href="/login">Log in</Link>
          </FieldDescription>
        </FieldGroup>
      </form>
    </AuthContainer>
    <FieldDescription className="px-6 pb-8 text-center">
      By creating an account, you agree to our{' '}
      <Link href="#">Terms of Service</Link> and{' '}
      <Link href="#">Privacy Policy</Link>.
    </FieldDescription>
    </>
  );
}
