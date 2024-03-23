"use client";

import { Button } from "@fenamnow/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@fenamnow/ui/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@fenamnow/ui/components/ui/scroll-area";
import { CheckIcon, CopyIcon, Share1Icon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  XIcon
} from "react-share";
import { toast } from "sonner";

export default function ShareButton({
  id,
  slug
}: {
  id?: number;
  slug?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  }, [copied]);

  const propertyShareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/property/${id}`;
  const blogShareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/blog/${slug}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Share1Icon className="mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {id ? "Share this property" : "Share this post"}
          </DialogTitle>
          <p>Copy the link below to share</p>
          <div className="bg-accent flex w-full items-center justify-between rounded-lg p-3">
            <p className="font-semibold">
              {id ? propertyShareUrl : blogShareUrl}
            </p>
            {copied ? (
              <Button variant="ghost" size="icon">
                <CheckIcon />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  navigator.clipboard
                    .writeText(id ? propertyShareUrl : blogShareUrl)
                    .then(() => {
                      setCopied(true);
                      toast("Link copied");
                    })
                }
              >
                <CopyIcon />
              </Button>
            )}
          </div>

          <p>Or share on</p>
          <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
            <div className="flex w-max space-x-4 p-4">
              {/* Facebook */}
              <FacebookShareButton
                url={id ? propertyShareUrl : blogShareUrl}
                className=""
              >
                <FacebookIcon size={32} round />
              </FacebookShareButton>

              {/* Twitter */}
              <TwitterShareButton
                url={id ? propertyShareUrl : blogShareUrl}
                title="Check out this property on Fenamnow"
              >
                <XIcon size={32} round />
              </TwitterShareButton>

              {/* Telegram */}
              <TelegramShareButton
                url={id ? propertyShareUrl : blogShareUrl}
                title="Check out this property on Fenamnow"
              >
                <TelegramIcon size={32} round />
              </TelegramShareButton>

              {/* WhatsApp */}
              <WhatsappShareButton
                url={id ? propertyShareUrl : blogShareUrl}
                title="Check out this property on Fenamnow"
                separator=":: "
              >
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>

              {/* Linkedin */}
              <LinkedinShareButton url={id ? propertyShareUrl : blogShareUrl}>
                <LinkedinIcon size={32} round />
              </LinkedinShareButton>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
