"use client";
import { useRouter } from "next/navigation";

import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";

function Link({ href, children, className, ...props }: { href: string; children: React.ReactNode; className?: string; [key: string]: any }) {
  const router = useRouter();
  return (
    <a href={href} className={className} onClick={(e) => { e.preventDefault(); router.push(href as any); }} {...props}>
      {children}
    </a>
  );
}

function Footer() {
  const router = useRouter()

  const handleLinkClick = (href: string) => {
    router.push(href as any)
  }

  return (
    <footer className=" py-12 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="text-center">
            <Link href="/" className="flex items-center justify-center gap-2 mb-4">
              <Icons.logo className="icon-class w-8" />
              <h2 className="text-lg font-bold">La cocina del patito</h2>
            </Link>

            <h1 className="dark:text-gray-300 mt-4">
              Build by{" "}
              <span className="dark:text-[#039ee4]">
                <Link href="https://x.com/miltivik">@miltivik</Link>
              </span>
            </h1>

            <p className="text-sm dark:text-gray-400 mt-5">
              © {new Date().getFullYear()} La cocina del patito. All rights reserved.
            </p>
          </div>
        </div>
        <div className=" w-full flex mt-4 items-center justify-center   ">
          <h1 className="text-center text-3xl md:text-5xl lg:text-[10rem] font-bold bg-clip-text text-transparent bg-gradient-to-b from-white-700 to-rose-900 select-none">
            iloveyou
          </h1>
        </div>

      </div>
    </footer>
  );
}

export { Footer };
