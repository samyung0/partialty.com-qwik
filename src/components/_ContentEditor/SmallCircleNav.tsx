/** @jsxImportSource react */

import { EllipsisVertical, Eye, HelpCircle, ListEnd, ListStart, Menu, Save } from "lucide-react";
import { useState } from "react";
import Draggable from "react-draggable";

export default ({
  toggleSmallCircleNav,
  openSmallCircleNav,
  toggleSideNav,
}: {
  toggleSmallCircleNav: () => void;
  openSmallCircleNav: boolean;
  toggleSideNav: () => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const eventControl = (event: { type: any }, info: any) => {
    if (event.type === "mousemove" || event.type === "touchmove") {
      setIsDragging(true);
    }

    if (event.type === "mouseup" || event.type === "touchend") {
      setTimeout(() => {
        setIsDragging(false);
      }, 100);
    }
  };
  return (
    <Draggable onDrag={eventControl} onStop={eventControl} allowAnyClick bounds="parent">
      <div className="content block text-background-light-gray xl:hidden">
        <ul id="menu" className={openSmallCircleNav ? "menuOpened" : ""}>
          <button
            className="menu-button flex items-center justify-center bg-primary-dark-gray text-white dark:bg-highlight-dark"
            onClick={() => {
              if (isDragging) return;
              toggleSmallCircleNav();
            }}
            onTouchEnd={() => {
              if (isDragging) return;
              toggleSmallCircleNav();
            }}
          >
            <Menu size={20} strokeWidth={3} />
          </button>
          <li className="menu-item bg-primary-dark-gray dark:bg-highlight-dark">
            <button>
              <span className="inline-block h-[20px] w-[20px] text-white">
                <ListEnd size={20} />
              </span>
            </button>
          </li>
          <li className="menu-item bg-primary-dark-gray dark:bg-highlight-dark">
            <button>
              <span className="inline-block h-[20px] w-[20px] text-white">
                <ListStart size={20} />
              </span>
            </button>
          </li>
          <li className="menu-item bg-primary-dark-gray dark:bg-highlight-dark">
            <button>
              <span className="inline-block h-[20px] w-[20px] text-white">
                <HelpCircle size={20} />
              </span>
            </button>
          </li>
          <li className="menu-item bg-primary-dark-gray dark:bg-highlight-dark">
            <button>
              <span className="inline-block h-[20px] w-[20px] text-white">
                <Save size={20} />
              </span>
            </button>
          </li>
          <li className="menu-item bg-primary-dark-gray dark:bg-highlight-dark">
            <button>
              <span className="inline-block h-[20px] w-[20px] text-white">
                <Eye size={20} />
              </span>
            </button>
          </li>
          <li className="menu-item bg-primary-dark-gray dark:bg-highlight-dark">
            <button onClick={toggleSideNav}>
              <span className="inline-block h-[20px] w-[20px]">
                <EllipsisVertical size={20} />
              </span>
            </button>
          </li>
        </ul>
      </div>
    </Draggable>
  );
};
