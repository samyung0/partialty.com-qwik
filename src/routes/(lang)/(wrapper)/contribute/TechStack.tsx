import { component$ } from '@builder.io/qwik';

import QwikIcon from "~/assets/img/qwik.png"
import TursoIcon from "~/assets/img/turso.png"
import VercelIcon from "~/assets/img/vercel.png"
import CloudinaryIcon from "~/assets/img/cloudinary.png"
import TailwindIcon from "~/assets/img/tailwind.svg"
import MuxIcon from "~/assets/img/mux.png"
import DrizzleIcon from "~/assets/img/drizzle.png"

export default component$(() => {
  return (
    <section class="mx-auto mt-16 grid max-w-xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
      <ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <li class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow">
          <div class="flex flex-1 flex-col p-8">
            <img
              class="mx-auto h-32 w-32 flex-shrink-0 object-contain"
              src={QwikIcon}
              alt="Qwik"
            />
            <h3 class="mt-6 text-sm font-medium text-gray-900">UI Library & Meta-framework</h3>
            <dl class="mt-1 flex flex-grow flex-col justify-between">
            <dt class="sr-only">Name</dt>
              <dd class="text-sm text-gray-500">Qwik & Qwik City</dd>
            </dl>
          </div>
        </li>
        <li class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow">
          <div class="flex flex-1 flex-col p-8">
            <img
              class="mx-auto h-32 w-32 flex-shrink-0 object-contain"
              src={TailwindIcon}
              alt="Tailwind"
            />
            <h3 class="mt-6 text-sm font-medium text-gray-900">CSS Library</h3>
            <dl class="mt-1 flex flex-grow flex-col justify-between">
            <dt class="sr-only">Name</dt>
              <dd class="text-sm text-gray-500">Tailwind CSS & Shadcn</dd>
            </dl>
          </div>
        </li>
        <li class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow">
          <div class="flex flex-1 flex-col p-8">
            <img
              class="mx-auto h-32 w-32 flex-shrink-0 object-contain"
              src={TursoIcon}
              alt="Turso"
            />
            <h3 class="mt-6 text-sm font-medium text-gray-900">Database</h3>
            <dl class="mt-1 flex flex-grow flex-col justify-between">
            <dt class="sr-only">Name</dt>
              <dd class="text-sm text-gray-500">Turso</dd>
            </dl>
          </div>
        </li>
        <li class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow">
          <div class="flex flex-1 flex-col p-8">
            <img
              class="mx-auto h-32 w-32 flex-shrink-0 object-contain"
              src={DrizzleIcon}
              alt="Drizzle"
            />
            <h3 class="mt-6 text-sm font-medium text-gray-900">Database ORM</h3>
            <dl class="mt-1 flex flex-grow flex-col justify-between">
            <dt class="sr-only">Name</dt>
              <dd class="text-sm text-gray-500">Drizzle</dd>
            </dl>
          </div>
        </li>
        <li class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow">
          <div class="flex flex-1 flex-col p-8">
            <img
              class="mx-auto h-32 w-32 flex-shrink-0 object-contain"
              src={VercelIcon}
              alt="Vercel"
            />
            <h3 class="mt-6 text-sm font-medium text-gray-900">Hosting Platform</h3>
            <dl class="mt-1 flex flex-grow flex-col justify-between">
            <dt class="sr-only">Name</dt>
              <dd class="text-sm text-gray-500">Vercel Serverless</dd>
            </dl>
          </div>
        </li>
        <li class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow">
          <div class="flex flex-1 flex-col p-8">
            <img
              class="mx-auto h-32 w-32 flex-shrink-0 object-contain"
              src={MuxIcon}
              alt="Mux"
            />
            <h3 class="mt-6 text-sm font-medium text-gray-900">Audio Provider</h3>
            <dl class="mt-1 flex flex-grow flex-col justify-between">
            <dt class="sr-only">Name</dt>
              <dd class="text-sm text-gray-500">Mux</dd>
            </dl>
          </div>
        </li>
        <li class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow">
          <div class="flex flex-1 flex-col p-8">
            <img
              class="mx-auto h-32 w-32 flex-shrink-0 object-contain"
              src={CloudinaryIcon}
              alt="Cloudinary"
            />
            <h3 class="mt-6 text-sm font-medium text-gray-900">Image Provider</h3>
            <dl class="mt-1 flex flex-grow flex-col justify-between">
            <dt class="sr-only">Name</dt>
              <dd class="text-sm text-gray-500">Cloudinary</dd>
            </dl>
          </div>
        </li>
      </ul>
    </section>
  );
});
