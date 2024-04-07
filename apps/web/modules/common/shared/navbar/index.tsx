"use client";

import { Button } from "@fenamnow/ui/components/ui/button";
import { ColorToggle } from "@fenamnow/ui/components/ui/color-toggle";
import { PlusIcon } from "@radix-ui/react-icons";
import { cn } from "@ui/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import { useState } from "react";
import { useSession } from "../providers/session";
import { NavDropdown } from "./nav-dropdown";

export default function Navbar({ isDashboard }: { isDashboard?: boolean }) {
  const { session } = useSession();
  const [mobileNavActive, setMobileNavActive] = useState(false);
  const layoutSegment = useSelectedLayoutSegment();
  const pathname = usePathname();

  const [] = useState(false);
  const paths = pathname.split("/");
  const searchPath = pathname.split("/")[2];
  return (
    <div
      className={cn(
        "bg-background container sticky top-0 z-20 flex h-14 w-full items-center",
        isDashboard && "border-y-muted -container fixed border-b px-4"
      )}
    >
      <div className="flex size-full items-center justify-between">
        <Link
          href="/"
          className="flex items-center space-x-4"
          title="Fenamnow home"
        >
          <Image src="/logo.png" width={50} height={50} alt="Fenamnow" />
          <p className="mt-4 text-lg font-semibold">Fenamnow</p>
        </Link>

        {!isDashboard && (
          <div className="hidden h-full w-1/3 items-center justify-between lg:flex">
            <Button
              variant={searchPath == "rental" ? "secondary" : "ghost"}
              asChild
            >
              <Link href="/search/rental?page=1">Rent</Link>
            </Button>
            <Button
              variant={searchPath == "sale" ? "secondary" : "ghost"}
              asChild
            >
              <Link href="/search/sale?page=1">Buy</Link>
            </Button>
            <Button
              variant={searchPath == "lease" ? "secondary" : "ghost"}
              asChild
            >
              <Link href="/search/lease?page=1">Lease</Link>
            </Button>

            <Button
              variant={searchPath == "blog" ? "secondary" : "ghost"}
              asChild
            >
              <Link href="/blog">Blog</Link>
            </Button>
          </div>
        )}
        <div
          className={cn(
            "flex h-full w-full items-center justify-between space-x-4",
            session !== undefined && session !== null && "justify-end"
          )}
        >
          {session !== undefined && session === null ? (
            <div className="hidden space-x-2 md:flex">
              <Button asChild variant="secondary">
                <Link
                  href={
                    pathname.split("/")[1] === "property"
                      ? `/login?redirectTo=${"/property/" + paths[2]}`
                      : "/login"
                  }
                  title="Login"
                >
                  Login
                </Link>
              </Button>
              <Button asChild>
                <Link href="/register" title="Register">
                  Get started
                </Link>
              </Button>
              <ColorToggle />
            </div>
          ) : (
            <div className="hidden items-center space-x-4 border border-red-500 md:flex">
              {layoutSegment == "properties" && (
                <Button asChild>
                  <Link href="/properties/create">
                    <PlusIcon className="mr-2" />
                    Add property
                  </Link>
                </Button>
              )}
              <NavDropdown />
            </div>
          )}
        </div>
        <div className="flex h-full w-max flex-col justify-center md:hidden">
          {session !== undefined && session === null ? (
            <Button
              variant="ghost"
              className="mt-5"
              size="icon"
              onClick={() => setMobileNavActive(!mobileNavActive)}
            >
              <Menu className="text-foreground h-8 w-8" />
            </Button>
          ) : (
            <NavDropdown />
          )}

          <AnimatePresence>
            {mobileNavActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute left-0 top-14 h-[100vh] w-full bg-transparent"
              >
                <div className="bg-background z-40 flex min-h-max w-full flex-col py-8">
                  {/* Links */}
                  <div className="flex flex-col items-start">
                    <Button
                      variant={searchPath == "rental" ? "secondary" : "ghost"}
                      asChild
                    >
                      <Link href="/search/rental?page=1">Rent</Link>
                    </Button>
                    <Button
                      variant={searchPath == "sale" ? "secondary" : "ghost"}
                      asChild
                    >
                      <Link href="/search/sale?page=1">Buy</Link>
                    </Button>
                    <Button
                      variant={searchPath == "lease" ? "secondary" : "ghost"}
                      asChild
                    >
                      <Link href="/search/lease?page=1">Lease</Link>
                    </Button>

                    <Button
                      variant={searchPath == "blog" ? "secondary" : "ghost"}
                      asChild
                    >
                      <Link href="/blog">Blog</Link>
                    </Button>
                  </div>
                  {/* Auth links */}
                  {session !== undefined && session === null ? (
                    <div className="flex gap-x-4 pl-4">
                      <Button asChild variant="outline">
                        <Link
                          href={
                            pathname.split("/")[1] === "property"
                              ? `/login?redirectTo=${"/property/" + paths[2]}`
                              : "/login"
                          }
                          title="Login"
                        >
                          Login
                        </Link>
                      </Button>
                      <Button asChild>
                        <Link href="/register" title="Register">
                          Get started
                        </Link>
                      </Button>
                      <ColorToggle />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      {layoutSegment == "properties" && (
                        <Button asChild>
                          <Link href="/properties/create">
                            <PlusIcon className="mr-2" />
                            Add property
                          </Link>
                        </Button>
                      )}
                      <NavDropdown />
                    </div>
                  )}
                </div>
                <div
                  onClick={() => setMobileNavActive(!mobileNavActive)}
                  className="flex h-full flex-1"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
