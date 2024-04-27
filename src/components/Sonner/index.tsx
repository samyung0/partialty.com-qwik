/** @jsxImportSource react */

import { qwikify$ } from '@builder.io/qwik-react';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={props.theme || 'dark'}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast bg-background-light-gray dark:bg-highlight-dark group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  );
};

export default qwikify$(Toaster);
