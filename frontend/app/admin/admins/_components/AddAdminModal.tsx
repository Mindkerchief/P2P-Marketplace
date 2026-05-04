import {
  AlertTriangle,
  Eye,
  EyeOff,
  Shield,
  ShieldCheck,
  UserCog,
  X
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { AUTH_LIMITS } from '@/utils/validation';

import type { AdminRole, AddModalProps } from '../_types/admin-management';
import { validateCreateAdminInput } from '../_utils/validation';

export function AddAdminModal({ onClose, onAdd }: AddModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<AdminRole>('ADMIN');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    setError('');
    const validationError = validateCreateAdminInput({
      firstName,
      lastName,
      email,
      phone,
      role,
      password,
      confirmPassword: confirm,
    });
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    try {
      await onAdd({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        role,
        password,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-[#1c1f2e] rounded-lg w-full sm:max-w-md shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#1e2433] px-6 py-5 flex items-start justify-between shrink-0 rounded-t-lg">
          <div className="flex items-center gap-2">
            <UserCog className="w-4 h-4 text-violet-400" />
            <h2 className="text-white font-bold text-base">Add New Admin</h2>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-white/10 h-7 w-7"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">
                First Name
              </Label>
              <Input
                value={firstName}
                onChange={(e) =>
                  setFirstName(
                    e.target.value.slice(0, AUTH_LIMITS.nameMaxLength),
                  )
                }
                placeholder="Enter first name"
                name="firstName"
                autoComplete="given-name"
                minLength={AUTH_LIMITS.nameMinLength}
                maxLength={AUTH_LIMITS.nameMaxLength}
                className="dark:bg-[#13151f] dark:border-[#2a2d3e]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">
                Last Name
              </Label>
              <Input
                value={lastName}
                onChange={(e) =>
                  setLastName(
                    e.target.value.slice(0, AUTH_LIMITS.nameMaxLength),
                  )
                }
                placeholder="Enter last name"
                name="lastName"
                autoComplete="family-name"
                minLength={AUTH_LIMITS.nameMinLength}
                maxLength={AUTH_LIMITS.nameMaxLength}
                className="dark:bg-[#13151f] dark:border-[#2a2d3e]"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">
              Email Address
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value.slice(0, AUTH_LIMITS.emailMaxLength))
              }
              placeholder="Enter email address"
              name="email"
              autoComplete="email"
              minLength={AUTH_LIMITS.emailMinLength}
              maxLength={AUTH_LIMITS.emailMaxLength}
              className="dark:bg-[#13151f] dark:border-[#2a2d3e]"
            />
          </div>

          {/* Contact Number */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">
              Contact Number (optional)
            </Label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                    .replace(/\D/g, '')
                    .slice(0, AUTH_LIMITS.phoneLength),
                )
              }
              placeholder="Enter contact number"
              name="phone"
              autoComplete="tel"
              maxLength={AUTH_LIMITS.phoneLength}
              className="dark:bg-[#13151f] dark:border-[#2a2d3e]"
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">
              Role
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {(['ADMIN', 'SUPER_ADMIN'] as AdminRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={cn(
                    'flex items-center gap-2.5 px-4 py-3 rounded-lg border text-sm font-semibold text-left transition-all',
                    role === r
                      ? 'bg-[#1e2433] border-[#3a4a6a] text-white'
                      : 'bg-stone-50 dark:bg-[#13151f] border-stone-200 dark:border-[#2a2d3e] text-stone-600 dark:text-stone-300 hover:border-stone-400',
                  )}
                >
                  {r === 'SUPER_ADMIN' ? (
                    <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-violet-400 shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-bold leading-tight">
                      {r === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                    </p>
                    <p className="text-xs opacity-60 mt-0.5">
                      {r === 'SUPER_ADMIN' ? 'Full access' : 'Standard access'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">
              Temporary Password
            </Label>
            <div className="relative">
              <Input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value.slice(0, AUTH_LIMITS.passwordMaxLength),
                  )
                }
                placeholder="Enter temporary password"
                name="password"
                autoComplete="new-password"
                minLength={AUTH_LIMITS.passwordMinLength}
                maxLength={AUTH_LIMITS.passwordMaxLength}
                className="pr-10 dark:bg-[#13151f] dark:border-[#2a2d3e]"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
              >
                {showPw ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Confirm password */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">
              Confirm Password
            </Label>
            <Input
              type="password"
              value={confirm}
              onChange={(e) =>
                setConfirm(
                  e.target.value.slice(0, AUTH_LIMITS.passwordMaxLength),
                )
              }
              placeholder="Re-enter password"
              name="confirmPassword"
              autoComplete="new-password"
              minLength={AUTH_LIMITS.passwordMinLength}
              maxLength={AUTH_LIMITS.passwordMaxLength}
              className="dark:bg-[#13151f] dark:border-[#2a2d3e]"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {/* Note */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-xs text-amber-700 dark:text-amber-400">
            <strong className="font-bold">Note:</strong> The new admin should
            change their password immediately on first login.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-3 flex gap-2.5 shrink-0 border-t border-stone-100 dark:border-[#252837]">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-lg dark:border-[#2a2d3e] dark:text-stone-300 dark:hover:bg-[#252837]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 rounded-lg bg-[#1e2433] hover:bg-[#2a3650] dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 text-white font-bold"
          >
            {saving ? 'Creating…' : 'Create Admin'}
          </Button>
        </div>
      </div>
    </div>
  );
}
