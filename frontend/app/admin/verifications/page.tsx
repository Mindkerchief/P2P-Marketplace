'use client';

import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  Eye,
  IdCard,
  RotateCw,
  Search,
  ShieldCheck,
  X,
  XCircle
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { ImageLink } from '@/components/image/ImageLink';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import type { SortDir } from '@/components/admin/TableSortIcon';
import { FilterSelect } from '@/components/admin/FilterSelect';
import { cn } from '@/lib/utils';
import { useConfirmDialog } from '@/utils/ConfirmDialogContext';

import { VerifDetailModal } from './_components/VerifDetailModal';
import {
  ID_TYPE_OPTIONS,
  STATUS_CONFIG,
  VERIFICATION_REVIEW_REASON_MAX_LENGTH
} from './_constants/admin-verifications';
import type {
  IdType,
  SortField,
  AdminVerification,
  AdminVerificationRecord
} from './_types/admin-verifications';
import {
  getAdminVerifications,
  setAdminVerificationStatus
} from './_services/admin-verifications';

export default function VerificationsPage() {
  const { openDialog } = useConfirmDialog();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [idTypeFilter, setIdTypeFilter] = useState<IdType>('ALL');
  const [sort, setSort] = useState<{ field: SortField; dir: SortDir }>({
    field: 'submitted',
    dir: 'desc',
  });
  const [selected, setSelected] = useState<AdminVerification | null>(null);
  const [records, setRecords] = useState<AdminVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const FETCH_LIMIT = 15;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setCurrentPage(1);
      setDebouncedSearch(search.trim());
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [search]);

  function toggleSort(field: SortField) {
    setCurrentPage(1);
    setSort((s) =>
      s.field === field
        ? { field, dir: s.dir === 'asc' ? 'desc' : 'asc' }
        : { field, dir: 'asc' },
    );
  }

  const mapRecord = useCallback(
    (record: AdminVerificationRecord): AdminVerification => {
      const submitted = new Date(record.submitted_at);
      const reviewed = record.reviewed_at ? new Date(record.reviewed_at) : null;

      return {
        id: record.id,
        user_id: record.user_id,
        user_name: record.user_name,
        user_email: record.user_email,
        profile_image_url: record.profile_image_url,
        id_first_name: record.id_first_name,
        id_last_name: record.id_last_name,
        id_birthdate: record.id_birthdate
          ? new Date(record.id_birthdate).toLocaleDateString('en-PH', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })
          : '',
        id_birthdate_raw: record.id_birthdate,
        mobile_number: record.mobile_number,
        id_type: record.id_type,
        id_number: record.id_number,
        id_image_front_url: record.id_image_front_url,
        id_image_back_url: record.id_image_back_url,
        selfie_url: record.selfie_url,
        ip_address: record.ip_address,
        user_agent: record.user_agent,
        hardware_info: record.hardware_info,
        status: record.status,
        reason: record.rejection_reason,
        reviewed_by: record.reviewed_by,
        reviewed_at_raw: record.reviewed_at,
        reviewed_at:
          reviewed && !Number.isNaN(reviewed.getTime())
            ? reviewed.toLocaleDateString('en-PH', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : null,
        submitted_at_raw: record.submitted_at,
        submitted_date: !Number.isNaN(submitted.getTime())
          ? submitted.toLocaleDateString('en-PH', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : record.submitted_at,
        submitted_time: !Number.isNaN(submitted.getTime())
          ? submitted.toLocaleTimeString('en-PH', {
              hour: 'numeric',
              minute: '2-digit',
            })
          : record.submitted_at,
      };
    },
    [],
  );

  const loadVerifications = useCallback(
    async (pageNumber: number) => {
      setLoading(true);
      const nextOffset = (pageNumber - 1) * FETCH_LIMIT;

      try {
        const payload = await getAdminVerifications({
          search: debouncedSearch,
          status: statusFilter,
          idType: idTypeFilter,
          limit: FETCH_LIMIT,
          offset: nextOffset,
        });

        const received = (payload.verifications ?? []).map(mapRecord);
        setRecords(received);
        setTotalCount(payload.total);
        setCurrentPage(pageNumber);
      } catch (error) {
        const message =
          typeof error === 'string'
            ? error
            : 'Failed to load verification records';
        toast.error(message, { position: 'top-center' });
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [mapRecord, debouncedSearch, statusFilter, idTypeFilter],
  );

  useEffect(() => {
    void loadVerifications(currentPage);
  }, [currentPage, loadVerifications]);

  const filtered = useMemo(() => {
    const data = [...records];

    data.sort((a, b) => {
      let va: string | number = '';
      let vb: string | number = '';

      if (sort.field === 'applicant') {
        va = a.user_name.toLowerCase();
        vb = b.user_name.toLowerCase();
      } else if (sort.field === 'dateOfBirth') {
        va = a.id_birthdate_raw ? new Date(a.id_birthdate_raw).getTime() : 0;
        vb = b.id_birthdate_raw ? new Date(b.id_birthdate_raw).getTime() : 0;
      } else if (sort.field === 'submitted') {
        va = a.submitted_at_raw ? new Date(a.submitted_at_raw).getTime() : 0;
        vb = b.submitted_at_raw ? new Date(b.submitted_at_raw).getTime() : 0;
      } else {
        va = a.reviewed_at_raw ? new Date(a.reviewed_at_raw).getTime() : 0;
        vb = b.reviewed_at_raw ? new Date(b.reviewed_at_raw).getTime() : 0;
      }

      if (typeof va === 'string' && typeof vb === 'string') {
        return sort.dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      }

      return sort.dir === 'asc'
        ? Number(va) - Number(vb)
        : Number(vb) - Number(va);
    });

    return data;
  }, [records, sort]);

  const pendingCount = records.filter((r) => r.status === 'PENDING').length;
  const verifiedCount = records.filter((r) => r.status === 'VERIFIED').length;
  const rejectedCount = records.filter((r) => r.status === 'REJECTED').length;
  const hasActiveFilters =
    search || statusFilter !== 'ALL' || idTypeFilter !== 'ALL';
  const totalPages = Math.max(1, Math.ceil(totalCount / FETCH_LIMIT));
  const paginationPages = useMemo(() => {
    const maxButtons = 5;
    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);
    return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
  }, [currentPage, totalPages]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sort.field !== field)
      return (
        <ChevronsUpDown className="w-3 h-3 text-stone-300 dark:text-stone-600 ml-1" />
      );
    return sort.dir === 'asc' ? (
      <ChevronUp className="w-3 h-3 ml-1" />
    ) : (
      <ChevronDown className="w-3 h-3 ml-1" />
    );
  };

  const SortableTH = ({
    label,
    field,
  }: {
    label: string;
    field: SortField;
  }) => (
    <TableHead
      className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest cursor-pointer select-none hover:text-stone-700 dark:hover:text-stone-200 whitespace-nowrap"
      onClick={() => toggleSort(field)}
    >
      <span className="inline-flex items-center">
        {label}
        <SortIcon field={field} />
      </span>
    </TableHead>
  );

  async function handleApprove(id: string, reason: string) {
    const trimmedReason = reason.trim();
    if (trimmedReason.length === 0) {
      toast.error('Reason is required', { position: 'top-center' });
      return;
    }
    if (trimmedReason.length > VERIFICATION_REVIEW_REASON_MAX_LENGTH) {
      toast.error(
        `Reason must not exceed ${VERIFICATION_REVIEW_REASON_MAX_LENGTH} characters`,
        { position: 'top-center' },
      );
      return;
    }

    openDialog({
      title: 'Approve Verification',
      message:
        'Approve this verification request? This action cannot be changed from this table.',
      confirmText: 'Approve',
      cancelText: 'Cancel',
      isDangerous: false,
      onConfirm: () => {
        void (async () => {
          setActionLoading(true);
          try {
            await setAdminVerificationStatus(id, {
              status: 'VERIFIED',
              reason: trimmedReason,
            });
            const nowIso = new Date().toISOString();
            const nowDisplay = new Date(nowIso).toLocaleDateString('en-PH', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
            setRecords((prev) =>
              prev.map((v) =>
                v.id === id
                  ? {
                      ...v,
                      status: 'VERIFIED',
                      reason: trimmedReason,
                      reviewed_by: v.reviewed_by ?? 'Admin',
                      reviewed_at_raw: nowIso,
                      reviewed_at: nowDisplay,
                    }
                  : v,
              ),
            );
            setSelected(null);
            toast.success('Verification approved successfully', {
              position: 'top-center',
            });
          } catch (error) {
            const message =
              typeof error === 'string'
                ? error
                : 'Failed to approve verification';
            toast.error(message, { position: 'top-center' });
          } finally {
            setActionLoading(false);
          }
        })();
      },
      onCancel: () => {},
    });
  }

  async function handleReject(id: string, reason: string) {
    const trimmedReason = reason.trim();
    if (trimmedReason.length === 0) {
      toast.error('Reason is required', { position: 'top-center' });
      return;
    }
    if (trimmedReason.length > VERIFICATION_REVIEW_REASON_MAX_LENGTH) {
      toast.error(
        `Reason must not exceed ${VERIFICATION_REVIEW_REASON_MAX_LENGTH} characters`,
        { position: 'top-center' },
      );
      return;
    }

    openDialog({
      title: 'Reject Verification',
      message:
        'Reject this verification request? This action cannot be changed from this table.',
      confirmText: 'Reject',
      cancelText: 'Cancel',
      isDangerous: true,
      onConfirm: () => {
        void (async () => {
          setActionLoading(true);
          try {
            await setAdminVerificationStatus(id, {
              status: 'REJECTED',
              reason: trimmedReason,
            });
            const nowIso = new Date().toISOString();
            const nowDisplay = new Date(nowIso).toLocaleDateString('en-PH', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
            setRecords((prev) =>
              prev.map((v) =>
                v.id === id
                  ? {
                      ...v,
                      status: 'REJECTED',
                      reason: trimmedReason,
                      reviewed_by: v.reviewed_by ?? 'Admin',
                      reviewed_at_raw: nowIso,
                      reviewed_at: nowDisplay,
                    }
                  : v,
              ),
            );
            setSelected(null);
            toast.success('Verification rejected successfully', {
              position: 'top-center',
            });
          } catch (error) {
            const message =
              typeof error === 'string'
                ? error
                : 'Failed to reject verification';
            toast.error(message, { position: 'top-center' });
          } finally {
            setActionLoading(false);
          }
        })();
      },
      onCancel: () => {},
    });
  }

  return (
    <div className="h-[calc(100vh)] p-5 sm:p-6 flex flex-col gap-5 min-h-0">
      {/* Page header */}
      {/* <div>
        <h2 className="text-xl font-extrabold text-stone-900 dark:text-stone-50">
          User Verifications
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">
          Review submitted identity documents and approve or reject seller verification requests
        </p>
      </div> */}

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: 'Total',
            count: totalCount,
            status: 'ALL',
            color: 'text-stone-700 dark:text-stone-200',
            Icon: CheckCircle2,
          },
          {
            label: 'Pending',
            count: pendingCount,
            status: 'PENDING',
            color: 'text-amber-600 dark:text-amber-400',
            Icon: AlertTriangle,
          },
          {
            label: 'Verified',
            count: verifiedCount,
            status: 'VERIFIED',
            color: 'text-teal-600 dark:text-teal-400',
            Icon: ShieldCheck,
          },
          {
            label: 'Rejected',
            count: rejectedCount,
            status: 'REJECTED',
            color: 'text-red-600 dark:text-red-400',
            Icon: XCircle,
          },
        ].map(({ label, count, status, color, Icon }) => (
          <Card
            key={label}
            className={cn(
              'p-4 rounded-lg cursor-pointer hover:shadow-sm transition-all card-glass border border-stone-200 dark:border-[#2a2d3e]',
              statusFilter === status && 'ring-2 ring-offset-1 ring-current',
            )}
            onClick={() => {
              setCurrentPage(1);
              setStatusFilter((prev) => {
                if (status === 'ALL') return 'ALL';
                return prev === status ? 'ALL' : status;
              });
            }}
          >
            <CardContent className="text-center">
              {/* <Icon className={cn("w-5 h-5 mx-auto mb-1.5", color)} /> */}
              <p className={cn('text-xl font-extrabold', color)}>{count}</p>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">
                {label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Search by name or email…"
            className="pl-9 dark:bg-[#13151f] dark:border-[#2a2d3e]"
          />
        </div>
        <div className="flex gap-2">
          <FilterSelect
            value={idTypeFilter}
            onChange={(v) => {
              setIdTypeFilter(v as IdType);
              setCurrentPage(1);
            }}
            options={ID_TYPE_OPTIONS}
          />
          <FilterSelect
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v);
              setCurrentPage(1);
            }}
            options={[
              ['ALL', 'All Status'],
              ['PENDING', 'Pending'],
              ['VERIFIED', 'Verified'],
              ['REJECTED', 'Rejected'],
            ]}
          />
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={() => {
                setSearch('');
                setIdTypeFilter('ALL');
                setStatusFilter('ALL');
                setCurrentPage(1);
              }}
              className="hover:bg-destructive/10! text-destructive! border-destructive! focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40"
            >
              <X className="w-3 h-3" /> Clear
            </Button>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsRefreshing(true);
            void loadVerifications(currentPage);
          }}
          disabled={loading}
          className="border-sky-600 text-sky-600! hover:bg-sky-600/10 focus-visible:border-sky-600 focus-visible:ring-sky-600/20 dark:border-sky-400 dark:text-sky-400! dark:hover:bg-sky-400/10 dark:focus-visible:border-sky-400 dark:focus-visible:ring-sky-400/40"
        >
          <RotateCw
            className={cn(
              'w-3.5 h-3.5',
              loading && isRefreshing && 'animate-spin',
            )}
          />{' '}
          Refresh
        </Button>
      </div>

      {/* Table */}
      <Card className="p-0 rounded-lg dark:bg-[#1c1f2e] dark:border-[#2a2d3e] overflow-hidden flex-1 min-h-0">
        <CardContent className="p-0 h-full min-h-0 flex flex-col">
          <div className="overflow-auto h-full">
            <Table>
              <TableHeader>
                <TableRow className="border-stone-200 dark:border-[#2a2d3e] bg-stone-50 dark:bg-[#13151f] hover:bg-stone-50 dark:hover:bg-[#13151f]">
                  <SortableTH label="Applicant" field="applicant" />
                  <TableHead className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">
                    Name
                  </TableHead>
                  <TableHead className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest whitespace-nowrap">
                    Mobile Number
                  </TableHead>
                  <SortableTH label="Date of Birth" field="dateOfBirth" />
                  <TableHead className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest whitespace-nowrap">
                    ID Type
                  </TableHead>
                  <TableHead className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">
                    Status
                  </TableHead>
                  <SortableTH label="Submitted" field="submitted" />
                  <SortableTH label="Reviewed By" field="reviewedBy" />
                  <TableHead className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="py-16 text-center text-sm text-stone-400 dark:text-stone-500"
                    >
                      Loading verification requests...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="py-16 text-center text-sm text-stone-400 dark:text-stone-500"
                    >
                      No verification requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((verif) => {
                    const sc = STATUS_CONFIG[verif.status];
                    const StatusIcon = sc.Icon;
                    return (
                      <TableRow
                        key={verif.id}
                        className="border-stone-100 dark:border-[#2a2d3e] hover:bg-stone-50 dark:hover:bg-[#252837] transition-colors"
                      >
                        {/* Applicant */}
                        <TableCell className="py-2">
                          <div className="flex items-center gap-3">
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
                        </TableCell>

                        <TableCell className="py-3.5 text-sm text-stone-500 dark:text-stone-400 whitespace-nowrap">
                          <p className="text-stone-800 dark:text-stone-100">{`${verif.id_first_name} ${verif.id_last_name}`}</p>
                        </TableCell>

                        {/* Mobile Number */}
                        <TableCell className="py-3.5 text-sm text-stone-500 dark:text-stone-400 whitespace-nowrap">
                          {verif.mobile_number}
                        </TableCell>

                        {/* Date of Birth */}
                        <TableCell className="py-3.5 text-sm text-stone-500 dark:text-stone-400 whitespace-nowrap">
                          {verif.id_birthdate || '—'}
                        </TableCell>

                        {/* ID Type */}
                        <TableCell className="py-3.5">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-[#13151f] px-2 py-1 rounded-lg">
                            <IdCard className="w-3 h-3 text-stone-400" />{' '}
                            {verif.id_type.toUpperCase()}
                          </span>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="py-3.5 whitespace-nowrap">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md',
                              sc.cls,
                            )}
                          >
                            <StatusIcon className="w-2.5 h-2.5" /> {sc.label}
                          </span>
                        </TableCell>

                        {/* Submitted At */}
                        <TableCell className="py-3.5 text-sm text-stone-500 dark:text-stone-400 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-bold text-stone-800 dark:text-stone-100">
                              {verif.submitted_date}
                            </p>
                            <p className="text-xs text-stone-400 dark:text-stone-500">
                              {verif.submitted_time}
                            </p>
                          </div>
                        </TableCell>

                        {/* Reviewed By */}
                        <TableCell className="py-3.5 text-sm text-stone-500 dark:text-stone-400 whitespace-nowrap">
                          {verif.reviewed_by ? (
                            <div>
                              <p className="text-sm font-bold text-stone-800 dark:text-stone-100">
                                {verif.reviewed_by}
                              </p>
                              <p className="text-xs text-stone-400 dark:text-stone-500">
                                {verif.reviewed_at}
                              </p>
                            </div>
                          ) : (
                            <span className="text-stone-300 dark:text-stone-600">
                              Not yet reviewed
                            </span>
                          )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              type="button"
                              title={
                                verif.status === 'PENDING' ? 'Review' : 'View'
                              }
                              aria-label={
                                verif.status === 'PENDING' ? 'Review' : 'View'
                              }
                              onClick={() => setSelected(verif)}
                              className="w-7 h-7 text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-[#252837]"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <Separator className="dark:bg-[#2a2d3e]" />
          <div className="px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-stone-400 dark:text-stone-500">
            <span>
              Showing {filtered.length.toLocaleString()} of{' '}
              {totalCount.toLocaleString()} result{totalCount !== 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={loading || currentPage <= 1}
                className="h-8 px-2.5"
              >
                Prev
              </Button>
              {paginationPages.map((page) => (
                <Button
                  key={page}
                  type="button"
                  variant={page === currentPage ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  disabled={loading}
                  className="h-8 min-w-8 px-2"
                >
                  {page}
                </Button>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={loading || currentPage >= totalPages}
                className="h-8 px-2.5"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selected && (
        <VerifDetailModal
          verif={selected}
          onClose={() => setSelected(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          actionLoading={actionLoading}
        />
      )}
    </div>
  );
}
