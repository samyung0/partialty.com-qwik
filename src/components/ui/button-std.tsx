import { component$ } from "@builder.io/qwik";

interface ItemProps {
  title: string;
  classText?: string;
  handleFunction?: any;
  noBackground?: boolean;
}

export const ButtonStd = component$((props: ItemProps) => {
  return (
    <button
      onClick$={props.handleFunction}
      class={props.classText + " rounded-sm px-4 py-2 transition-all duration-300 "}
    >
      <div>{props.title}</div>
    </button>
  );
});
