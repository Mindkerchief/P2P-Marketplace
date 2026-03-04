'use client';

type SearchBarProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string
}

export default function SearchBar({ className, ...props }: SearchBarProps) {
    return (
        <input
            {...props}
            placeholder={props.placeholder ?? 'Search...'}
            className={
                `px-3 py-2 w-5xl max-w-xs md:max-w-md rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm md:text-base truncate whitespace-nowrap ${className ?? ''}`
            }
            aria-label={props['aria-label'] ?? 'Search'}
        />
    );
}
