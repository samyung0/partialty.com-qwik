import type { QwikIntrinsicElements } from '@builder.io/qwik';

export function TerminalIcon(props: QwikIntrinsicElements['svg'], key: string) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props} key={key}>
      <path
        fill="currentColor"
        d="M4.615 19q-.69 0-1.152-.462Q3 18.075 3 17.385V6.615q0-.69.463-1.152Q3.925 5 4.615 5h14.77q.69 0 1.152.463q.463.462.463 1.152v10.77q0 .69-.462 1.152q-.463.463-1.153.463zm0-1h14.77q.23 0 .423-.192q.192-.193.192-.423V8H4v9.385q0 .23.192.423q.193.192.423.192M7.5 16.288l-.688-.688L9.387 13l-2.6-2.6l.713-.688L10.788 13zm5 .212v-1h5v1z"
      ></path>
    </svg>
  );
}
