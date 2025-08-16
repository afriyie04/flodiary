"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function BreadcrumbComponent() {
  const pathname = usePathname();

  // Split the pathname into segments, filter out empty strings
  const pathSegments = pathname.split("/").filter(Boolean);

  // Build the breadcrumb items with their corresponding hrefs
  const breadcrumbs = pathSegments.map((segment, idx) => {
    const href = "/" + pathSegments.slice(0, idx + 1).join("/");
    return {
      label: capitalize(decodeURIComponent(segment.replace(/-/g, " "))),
      href,
      isLast: idx === pathSegments.length - 1,
    };
  });

  // Optionally, add a "Home" breadcrumb at the start
  const allBreadcrumbs = [
    {
      label: "Home",
      href: "/",
      isLast: pathSegments.length === 0,
    },
    ...breadcrumbs,
  ];

  return (
    <nav
      aria-label="Breadcrumb"
      className="bg-gray-100 px-8 rounded-full border border-gray-200"
    >
      <ol className="flex flex-wrap items-center space-x-2 text-sm text-gray-600">
        {allBreadcrumbs.map((crumb, idx) => (
          <li key={crumb.href} className="flex items-center">
            {idx !== 0 && (
              <span className="mx-1 text-gray-400">
                <ChevronRight className="w-4 h-4" />
              </span>
            )}
            {crumb.isLast ? (
              <span className="font-semibold text-gray-900">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="transition-colors">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
