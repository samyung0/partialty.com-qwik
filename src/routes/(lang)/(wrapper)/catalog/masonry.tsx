/** @jsxImportSource react */

import { qwikify$ } from "@builder.io/qwik-react";
import { Gem, Rocket, Tags } from "lucide-react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { cn } from "~/utils/cn";
import { Tag } from "../../../../../drizzle_turso/schema/tag";

const component = ({
  course,
  tags,
  children,
}: {
  course: {
    id: string;
    link: string | null;
    name: string;
    short_description: string;
    difficulty: string;
    tags: string[] | null;
    is_premium: boolean;
    created_at: string;
  }[];
  tags: Tag[];
  children?: React.ReactNode[];
}) => (
  <ResponsiveMasonry columnsCountBreakPoints={{ 640: 1, 768: 2, 1280: 3 }}>
    <Masonry gutter={"12px"}>
      {course.map((course) => (
        <a
          href={course.link || undefined}
          key={course.id}
          className="item flex cursor-pointer flex-col gap-3 rounded-lg border-2 border-primary-dark-gray bg-background-light-gray p-3 shadow-md hover:shadow-lg dark:border-disabled-dark dark:bg-highlight-dark"
        >
          <h3 className="font-mosk text-base font-bold tracking-wide md:text-lg">{course.name}</h3>
          <p className="whitespace-pre-line text-sm">{course.short_description}</p>
          <div className="flex items-center gap-2">
            <span className="-mt-[6px] block text-primary-dark-gray dark:text-background-light-gray">
              <Rocket size={15} />
            </span>
            <p
              className={cn(
                "self-start border-b-2 pb-1",
                course.difficulty === "easy" && "border-sea",
                course.difficulty === "intermediate" && "border-yellow",
                course.difficulty === "advanced" && "border-pink"
              )}
            >
              {course.difficulty}
            </p>
          </div>
          {course.tags && (
            <div className="flex items-start gap-2">
              <span className=" block text-primary-dark-gray dark:text-background-light-gray">
                <Tags size={15} />
              </span>
              <p className="flex gap-2 whitespace-pre-wrap break-all">
                {course.tags
                  .map((tagId) => tags.find((tag) => tag.id === tagId))
                  .filter((x) => x)
                  .map((tag) => tag!.name)
                  .join(", ")}
              </p>
            </div>
          )}
          {course.is_premium && (
            <div className="flex items-start gap-2">
              <p className="flex items-center gap-2">
                <span className=" text-tomato dark:text-pink">
                  <Gem size={15} />
                </span>
                <span className="text-tomato dark:text-pink">Subscription Required</span>
              </p>
            </div>
          )}
        </a>
      ))}
    </Masonry>
  </ResponsiveMasonry>
);

export default qwikify$(component, { eagerness: "load" });
