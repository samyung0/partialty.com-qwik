import { component$, Slot, useComputed$, useTask$ } from '@builder.io/qwik';
import { useCSSTransition } from 'qwik-transition';
import { cn } from '~/utils/cn';

export default component$(
  ({ open, children, ...props }: { open: boolean; children?: JSX.Element; [propName: string]: any }) => {
    const onOff = useComputed$(() => open);
    const { stage, shouldMount } = useCSSTransition(onOff, {
      timeout: 75,
    });

    return (
      shouldMount.value && (
        <div
          {...{
            ...props,
            class: cn(
              props.class,
              (stage.value === 'enterFrom' || stage.value === 'enterTo' || stage.value === 'idle') &&
                'transition duration-100 ease-out',
              (stage.value === 'leaveFrom' || stage.value === 'leaveTo') && 'transition duration-75 ease-in',
              (stage.value === 'enterFrom' || stage.value === 'idle') && 'scale-95 transform opacity-0',
              stage.value === 'enterTo' && 'scale-100 transform opacity-100',
              stage.value === 'leaveFrom' && 'scale-100 transform opacity-100',
              stage.value === 'leaveTo' && 'scale-95 transform opacity-0'
            ),
          }}
        >
          <Slot />
        </div>
      )
    );
  }
);
