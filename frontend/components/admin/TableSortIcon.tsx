import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp
} from 'lucide-react';

export type SortDir = 'asc' | 'desc';

export function TableSortIcon({
  field,
  sort,
}: {
  field: any;
  sort: { field: any; dir: SortDir };
}) {
  if (sort.field !== field)
    return (
      <ChevronsUpDown className="w-3 h-3 text-stone-300 dark:text-stone-600 ml-1" />
    );
  return sort.dir === 'asc' ? (
    <ChevronUp className="w-3 h-3 ml-1" />
  ) : (
    <ChevronDown className="w-3 h-3 ml-1" />
  );
}
