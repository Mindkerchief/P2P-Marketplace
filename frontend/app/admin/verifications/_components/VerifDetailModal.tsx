import {
  AlertTriangle,
  Calendar,
  XCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  CreditCard,
  Globe,
  Hash,
  IdCard,
  Monitor,
  Phone,
  User,
  X
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { ImageLink } from '@/components/image/ImageLink';
import {
  type MediaViewerItem,
  MediaViewer,
} from '@/components/modal/MediaViewer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { validateImageURL } from '@/utils/validation';

import { IdImageCard } from './IdImageCard';
import { InfoRow } from './InfoRow';
import {
  STATUS_CONFIG,
} from '../_constants/admin-verifications';
import type {
  DetailModalProps
} from '../_types/admin-verifications';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-2.5">
      {children}
    </p>
  );
}

export function VerifDetailModal({
  verif,
  onClose,
  onApprove,
  onReject,
  actionLoading = false,
}: DetailModalProps) {
  const [rejectReason, setRejectReason] = useState(
    // Pre-fill when viewing a previously rejected submission
    verif.status === 'REJECTED' ? (verif.reason ?? '') : '',
  );
  const [hardwareOpen, setHardwareOpen] = useState(false);
  const [mediaViewerIndex, setMediaViewerIndex] = useState<number | null>(null);

  const sc = STATUS_CONFIG[verif.status];
  const Icon = sc.Icon;

  const submittedName = `${verif.id_first_name} ${verif.id_last_name}`.trim();
  const nameMatch =
    submittedName.toLowerCase() === verif.user_name.toLowerCase();
  const reasonMaxLength = 500;
  const hasReason =
    rejectReason.trim().length > 0 &&
    rejectReason.trim().length <= reasonMaxLength;

  const hardwarePretty = useMemo(() => {
    if (!verif.hardware_info) return null;
    try {
      return JSON.stringify(JSON.parse(verif.hardware_info), null, 2);
    } catch {
      return verif.hardware_info;
    }
  }, [verif.hardware_info]);

  const submittedMediaItems = useMemo<MediaViewerItem[]>(() => {
    const entries: Array<{ label: string; url: string }> = [
      { label: 'Front of ID', url: validateImageURL(verif.id_image_front_url) },
      { label: 'Back of ID', url: validateImageURL(verif.id_image_back_url) },
      {
        label: 'Selfie while holding ID',
        url: validateImageURL(verif.selfie_url),
      },
    ];

    return entries
      .filter((entry) => entry.url !== '')
      .map((entry, index) => ({
        id: `verification-image-${index}`,
        fileUrl: entry.url,
        fileType: 'IMAGE',
        fileName: entry.label,
      }));
  }, [verif.id_image_back_url, verif.id_image_front_url, verif.selfie_url]);

  const frontImageUrl = validateImageURL(verif.id_image_front_url);
  const backImageUrl = validateImageURL(verif.id_image_back_url);
  const selfieImageUrl = validateImageURL(verif.selfie_url);

  const frontImageIndex = submittedMediaItems.findIndex(
    (item) => item.fileUrl === frontImageUrl,
  );
  const backImageIndex = submittedMediaItems.findIndex(
    (item) => item.fileUrl === backImageUrl,
  );
  const selfieImageIndex = submittedMediaItems.findIndex(
    (item) => item.fileUrl === selfieImageUrl,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* ── Modal shell — max-w-5xl two-column ── */}
      <div className="bg-white dark:bg-[#1c1f2e] rounded-lg w-full max-w-5xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="bg-[#1e2433] px-6 py-4 flex items-center justify-between shrink-0 rounded-t-lg">
          <div className="flex items-center gap-3 min-w-0">
            <IdCard className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="min-w-0">
              <h2 className="text-white font-bold text-base leading-none">
                Verification Request
              </h2>
              <p className="text-slate-400 text-sm mt-0.5 truncate">
                By {verif.user_name} · Submitted on {verif.submitted_date} ·{' '}
                {verif.submitted_time}
              </p>
            </div>
            <span
              className={cn(
                'ml-2 text-xs font-bold px-2.5 py-1 rounded-md inline-flex items-center gap-1 shrink-0',
                sc.cls,
              )}
            >
              <Icon className="w-3 h-3" /> {sc.label}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-white/10 h-7 w-7 shrink-0 ml-3"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* ── Two-column body ─────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row min-h-0">
          {/* ════ LEFT — Personal + metadata ════ */}
          <div className="lg:w-[35%] overflow-y-auto border-b lg:border-b-0 lg:border-r border-stone-200 dark:border-[#2a2d3e] p-5 space-y-5">
            {/* ── Profile vs. Submitted comparison card ── */}
            <div>
              <SectionLabel>Identity Comparison</SectionLabel>
              <Card className="py-0 overflow-hidden dark:bg-[#13151f] dark:border-[#2a2d3e]">
                <CardContent className="p-0">
                  <div className="grid divide-x divide-stone-200 dark:divide-[#2a2d3e]">
                    {/* Registered profile side */}
                    <div className="p-3.5 space-y-2.5">
                      <p className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                        Profile
                      </p>
                      <div className="flex items-center gap-2.5">
                        <ImageLink
                          href={`/profile?userId=${verif.user_id}`}
                          newTab
                          src={verif.profile_image_url}
                          type="profile"
                          label={verif.user_name}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-stone-800 dark:text-stone-100 truncate">
                            {verif.user_name}
                          </p>
                          <p className="text-xs text-stone-400 dark:text-stone-500 truncate">
                            {verif.user_email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Submitted info side */}
                    <div className="p-3.5 space-y-2.5">
                      <p className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                        Submitted
                      </p>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <User className="w-4 h-4 text-stone-400 shrink-0" />
                          <p
                            className={cn(
                              'text-sm font-semibold truncate',
                              nameMatch
                                ? 'text-teal-700 dark:text-teal-400'
                                : 'text-amber-700 dark:text-amber-400',
                            )}
                          >
                            {submittedName}
                          </p>
                          {nameMatch ? (
                            <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-4 h-4 text-stone-400 shrink-0" />
                          <p className="text-sm font-mono text-stone-700 dark:text-stone-200 truncate">
                            {verif.mobile_number}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Match verdict strip */}
                  <div
                    className={cn(
                      'px-3.5 py-2 text-sm font-semibold flex items-center gap-1.5 border-t border-stone-200 dark:border-[#2a2d3e]',
                      nameMatch
                        ? 'bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400'
                        : 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400',
                    )}
                  >
                    {nameMatch ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Name matches
                        registered profile
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4" /> Name differs from
                        registered profile
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator className="dark:bg-[#2a2d3e]" />

            {/* ── ID document details ── */}
            <div>
              <SectionLabel>ID Document Details</SectionLabel>
              <div className="space-y-3.5">
                <InfoRow
                  icon={CreditCard}
                  label="ID Type"
                  value={verif.id_type.toUpperCase()}
                />
                <InfoRow
                  icon={Hash}
                  label="ID Number"
                  value={verif.id_number}
                  mono
                />
                <InfoRow
                  icon={Calendar}
                  label="Date of Birth"
                  value={verif.id_birthdate}
                />
                <InfoRow
                  icon={Phone}
                  label="Mobile Number"
                  value={verif.mobile_number}
                />
              </div>
            </div>

            <Separator className="dark:bg-[#2a2d3e]" />

            {/* ── Submission metadata ── */}
            <div>
              <SectionLabel>Submission Metadata</SectionLabel>
              <div className="space-y-3.5">
                <InfoRow
                  icon={Globe}
                  label="IP Address"
                  value={verif.ip_address}
                  mono
                />
                <InfoRow
                  icon={Monitor}
                  label="User Agent"
                  value={verif.user_agent}
                />
              </div>

              {/* Hardware JSON — collapsible */}
              {hardwarePretty && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setHardwareOpen((v) => !v)}
                    className="w-full flex items-center gap-1.5 text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest hover:text-stone-600 dark:hover:text-stone-300 transition-colors mb-2"
                  >
                    <Cpu className="w-4 h-4" />
                    Device Hardware Info
                    {hardwareOpen ? (
                      <ChevronUp className="w-3 h-3 ml-auto" />
                    ) : (
                      <ChevronDown className="w-3 h-3 ml-auto" />
                    )}
                  </button>
                  {hardwareOpen && (
                    <pre className="text-sm leading-relaxed font-mono bg-stone-100 dark:bg-[#13151f] border border-stone-200 dark:border-[#2a2d3e] rounded-lg p-3 overflow-x-auto text-stone-600 dark:text-stone-300 whitespace-pre-wrap break-all">
                      {hardwarePretty}
                    </pre>
                  )}
                </div>
              )}
            </div>

            {/* ── Existing reason ── */}
            {verif.reason && (
              <>
                <Separator className="dark:bg-[#2a2d3e]" />
                <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-3.5 space-y-1.5">
                  <SectionLabel>Reason</SectionLabel>
                  <p className="text-sm text-red-600 dark:text-red-400 leading-relaxed">
                    {verif.reason}
                  </p>
                  {verif.reviewed_by && (
                    <p className="text-xs text-red-400 dark:text-red-500 mt-1">
                      By {verif.reviewed_by} · {verif.reviewed_at}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* ════ RIGHT — ID images + reject input ════ */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
            {/* ID photo captures — larger for easier review */}
            <div>
              <SectionLabel>Uploaded Photos</SectionLabel>
              <div className="space-y-4">
                <IdImageCard
                  label="Front of ID"
                  imageUrl={verif.id_image_front_url}
                  onOpenFullscreen={
                    frontImageIndex >= 0
                      ? () => setMediaViewerIndex(frontImageIndex)
                      : undefined
                  }
                />
                <IdImageCard
                  label="Back of ID"
                  imageUrl={verif.id_image_back_url}
                  onOpenFullscreen={
                    backImageIndex >= 0
                      ? () => setMediaViewerIndex(backImageIndex)
                      : undefined
                  }
                />
                <IdImageCard
                  label="Selfie while holding ID"
                  imageUrl={verif.selfie_url}
                  onOpenFullscreen={
                    selfieImageIndex >= 0
                      ? () => setMediaViewerIndex(selfieImageIndex)
                      : undefined
                  }
                />
              </div>
            </div>

            {/* ── Reject reason field — visible for PENDING only ── */}
            {verif.status === 'PENDING' && (
              <>
                <Separator className="dark:bg-[#2a2d3e]" />
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                    Reason
                    <span className="normal-case font-normal text-stone-400 dark:text-stone-600 ml-1.5">
                      — required for approve/reject
                    </span>
                  </Label>
                  <Textarea
                    rows={4}
                    value={rejectReason}
                    onChange={(e) =>
                      setRejectReason(e.target.value.slice(0, reasonMaxLength))
                    }
                    maxLength={reasonMaxLength}
                    placeholder="Explain clearly why the submission is being rejected so the user can resubmit correctly…"
                    className="resize-none text-xs dark:bg-[#13151f] dark:border-[#2a2d3e] dark:text-stone-100 dark:placeholder-stone-600"
                  />
                  <p className="text-xs text-stone-400 dark:text-stone-500">
                    This message will be shown to the applicant.{' '}
                    {rejectReason.length} / {reasonMaxLength}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Footer actions ───────────────────────────────────────────────────── */}
        <div className="shrink-0 border-t border-stone-200 dark:border-[#2a2d3e] px-6 py-4 flex items-center gap-2.5 rounded-b-lg bg-white dark:bg-[#1c1f2e]">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-lg dark:border-[#2a2d3e] dark:text-stone-300 dark:hover:bg-[#252837]"
          >
            Close
          </Button>

          {verif.status === 'PENDING' && (
            <div className="flex items-center gap-2.5 ml-auto">
              <Button
                type="button"
                variant="outline"
                disabled={!hasReason || actionLoading}
                onClick={() => void onReject(verif.id, rejectReason.trim())}
                className="rounded-lg border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 hover:border-red-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <XCircle className="w-4 h-4 mr-1.5" />
                Reject
              </Button>
              <Button
                type="button"
                disabled={!hasReason || actionLoading}
                onClick={() => void onApprove(verif.id, rejectReason.trim())}
                className="rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-bold"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Approve
              </Button>
            </div>
          )}
        </div>
      </div>

      {mediaViewerIndex !== null && submittedMediaItems.length > 0 && (
        <MediaViewer
          mediaItems={submittedMediaItems}
          activeIndex={mediaViewerIndex}
          onSelect={setMediaViewerIndex}
          onClose={() => setMediaViewerIndex(null)}
        />
      )}
    </div>
  );
}
