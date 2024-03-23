import { Bucket } from "@fenamnow/types/files";
import { Badge } from "@fenamnow/ui/components/ui/badge";
import { Button } from "@fenamnow/ui/components/ui/button";
import { Card, CardContent } from "@fenamnow/ui/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@fenamnow/ui/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@fenamnow/ui/components/ui/dialog";
import { useClientPublicUrls } from "@web/lib/hooks/use-client-public-url";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

export const PublicImage = ({
  path,
  alt,
  bucket,
  ...props
}: {
  path: string;
  alt?: string;
  bucket?: Bucket;
  [key: string]: any;
}) => {
  const publicUrl = useClientPublicUrls(path, bucket);
  return (
    publicUrl && <Image src={publicUrl as string} alt={alt || ""} {...props} />
  );
};
export default function PropertyImages({ property }: { property: any }) {
  return (
    <div className="flex h-[280px] w-full items-center justify-between space-x-6 md:h-[400px]">
      <div className="relative h-full flex-1 rounded-lg">
        <PublicImage
          priority
          className="rounded-lg object-cover"
          path={property.images[0].uri || property.images[0]}
          bucket="properties"
          alt=""
          fill
        />
        {(property?.images?.length ?? 0) > 1 && (
          <Dialog>
            <DialogTrigger>
              <Button className="bg-foreground hover:bg-foreground/70 absolute bottom-6 left-6">
                <ImageIcon className="mr-2" /> View all photos
              </Button>
            </DialogTrigger>
            <DialogContent className="min-w-max">
              <DialogHeader>
                <DialogTitle>Photos</DialogTitle>
              </DialogHeader>
              <div className="flex h-max w-full justify-center">
                <Carousel
                  className="w-[85%]"
                  opts={{
                    loop: true
                  }}
                >
                  <CarouselContent>
                    {property.images.map((image: any, index: number) => (
                      <CarouselItem key={index}>
                        <div>
                          <Card>
                            <CardContent className="relative flex aspect-square items-center justify-center p-6">
                              <PublicImage
                                path={image.uri || image}
                                bucket="properties"
                                className="size-full rounded-lg object-cover"
                                layout="fill"
                                alt={image.alt || ""}
                              />
                              {image.alt && (
                                <Badge className="bg-background text-foreground absolute bottom-6 left-6">
                                  {image.alt}
                                </Badge>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="flex h-full w-1/3 flex-col justify-between space-y-4">
        {property?.images[1] && (
          <div className="relative h-1/2 w-full">
            <PublicImage
              priority
              className="rounded-lg object-cover"
              path={(property?.images[1].uri as string) || property?.images[1]}
              bucket="properties"
              alt={`${property?.community}, ${property?.address}` || ""}
              fill
            />
          </div>
        )}

        {property?.images[2] && (
          <div className="relative h-1/2 w-full">
            <PublicImage
              priority
              className="rounded-lg object-cover"
              path={property.images[2].uri || property.images[2]}
              bucket="properties"
              alt={`${property?.community}, ${property?.address}` || ""}
              fill
            />
          </div>
        )}
      </div>
    </div>
  );
}
