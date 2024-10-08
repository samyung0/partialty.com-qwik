import type { QwikIntrinsicElements } from '@builder.io/qwik';

export function RefreshIcon(props: QwikIntrinsicElements['svg'], key: string) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props} key={key}>
      <path
        fill="currentColor"
        d="M12.077 19q-2.931 0-4.966-2.033q-2.034-2.034-2.034-4.964q0-2.93 2.034-4.966Q9.146 5 12.077 5q1.783 0 3.338.847q1.556.847 2.508 2.365V5h1v5.23h-5.23v-1h3.7q-.781-1.495-2.198-2.363Q13.78 6 12.077 6q-2.5 0-4.25 1.75T6.077 12q0 2.5 1.75 4.25t4.25 1.75q1.925 0 3.475-1.1t2.175-2.9h1.061q-.661 2.246-2.513 3.623T12.077 19"
      ></path>
    </svg>
  );
}
