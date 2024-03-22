/** @jsxImportSource react */

import { qwikify$ } from "@builder.io/qwik-react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const component = ({ children }: { children?: React.ReactNode[] }) => (
  <ResponsiveMasonry columnsCountBreakPoints={{ 640: 1, 768: 2, 1280: 3 }}>
    <Masonry gutter={"12px"}>{children}</Masonry>
  </ResponsiveMasonry>
);

export default qwikify$(component);
