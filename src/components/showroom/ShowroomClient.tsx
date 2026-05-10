"use client";

import dynamic from "next/dynamic";

const ShowroomCanvas = dynamic(
  () => import("./ShowroomCanvas").then((module) => module.ShowroomCanvas),
  {
    ssr: false,
    loading: () => <div className="flex h-full items-center justify-center text-sm text-forge-silver">Loading showroom</div>,
  },
);

export function ShowroomClient() {
  return <ShowroomCanvas />;
}
