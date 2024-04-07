import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <div className="bg-accent min-h-[400px] w-full py-6 md:h-[400px]">
      <div className="container flex size-full flex-col justify-between space-y-2">
        {/* Top section */}
        <div className="flex w-full justify-between">
          <div className="flex h-full w-1/2 flex-wrap justify-between">
            {/* Logo */}
            <div className="min-h-max">
              <Link
                href="/"
                className="flex items-center space-x-4"
                title="Fenamnow home"
              >
                <Image src="/logo.png" width={50} height={50} alt="Fenamnow" />
                <p className="mt-2 text-lg font-semibold">Fenamnow</p>
              </Link>
            </div>
            {/* About */}
            <div className="mt-4 flex flex-col space-y-6">
              <p className="font-bold">About us</p>
              <Link href="/company">Company</Link>
              <Link href="/#features">Features</Link>
            </div>
            <div className="mt-4 flex flex-col space-y-6">
              <p className="font-bold">Legal</p>
              <Link href="/legal/terms-of-service">Terms of service</Link>
              <Link href="/legal/privacy-policy">Privacy policy</Link>
            </div>
            <div className="mt-4 flex flex-col space-y-6">
              <p className="font-bold">Resources</p>
              <Link href="/blog">Blog</Link>
              {/* <Link href="/press">Press</Link> */}
            </div>
          </div>
          <div className="mt-16 space-y-6 md:mt-4">
            {/* Socal media links */}
            <div>
              <p className="text-lg font-semibold">Follow us on</p>
              <div className="flex space-x-6">
                <Link href="https://instagram.com/">
                  <FaInstagram className="size-8" />
                </Link>
                <Link href="/">
                  <FaFacebook className="size-8" />
                </Link>
              </div>
            </div>
            {/* App Download links */}
            <div>
              <p className="text-lg font-semibold">Download the mobile app</p>
              <div className="flex items-center gap-x-4">
                <Link href="https://play.google.com/store/apps/details?id=com.fenamnow.android&pcampaignid=web_share&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1">
                  <Image
                    alt="Get it on Google Play"
                    src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                    width={200}
                    height={200}
                  />
                </Link>

                <a href="https://apps.apple.com/pl/app/fenamnow-mobile/id6472881076">
                  <Image
                    alt="Download on the App Store"
                    src="/app-store-download.svg"
                    width={200}
                    height={200}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-6">
          <div className="bg-secondary-foreground h-[1px] w-full" />
          <p className="font-medium">
            &copy; Fenamnow {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
