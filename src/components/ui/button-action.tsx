import { component$ } from "@builder.io/qwik";
import { Grid } from "../svgs/grid";

interface ItemProps {
  isDisabled?: boolean;
  isLoading?: boolean;
  isLoadingLabel?: string;
  handleFunction?: any;
  label: string;
}

export const ButtonAction = component$((props: ItemProps) => {
  return (
    <button
      onClick$={props.handleFunction}
      class={
        "flex w-56 justify-center space-x-4 rounded-sm px-4 py-2 text-white shadow-lg transition-all duration-300 hover:shadow-none " +
        (props.isDisabled ? "bg-gray-500 " : "bg-sky-500 hover:bg-sky-400 ")
      }
    >
      {props.isLoading && (
        <>
          <Grid />
          <span
            class={{
              hidden: props.isLoadingLabel === undefined,
            }}
          >
            {props.isLoadingLabel}
          </span>
        </>
      )}

      {!props.isLoading && <span class="">{props.label}</span>}
    </button>
  );
});
