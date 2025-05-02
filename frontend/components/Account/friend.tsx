import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function Friend() {
  return (
    <Carousel className="w-full max-w-240">
      <CarouselContent className="mx-auto ">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem
            key={index}
            className=" sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
          >
            <div className="rounded-sm grid grid-rows-4 w-50 h-50 bg-gray-100 gap-2 p-1 border-2 border-gray-500">
              <div className="rounded-sm row-span-3 bg-[url(https://github.com/shadcn.png)] bg-cover bg-center"></div>
              <div className="row-span-1 flex items-center justify-evenly">
                <div className="font-bold">Gia Huy Idol</div>
                <button
                  type="submit"
                  className="bg-black text-white px-3 py-1 rounded"
                >
                  Add
                </button>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
