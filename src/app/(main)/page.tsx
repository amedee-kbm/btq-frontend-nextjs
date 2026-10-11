"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { ChevronRight, CreditCard, Motorbike, Store } from "lucide-react";
import { NavigationArrowIcon, KeyReturnIcon } from "@phosphor-icons/react";
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import Hero from "@/components/ui/hero";
import { VscTwitter } from "react-icons/vsc";

const new_arrivals = [
  {
    src: "/dresses/1.jpg",
    alt: "Dress 1",
    name: "Dress 1",
    price: "RWF 19,000",
  },
  {
    src: "/dresses/4.jpg",
    alt: "Dress 4",
    name: "Dress 4",
    price: "RWF 20,000",
  },
  {
    src: "/dresses/5.jpg",
    alt: "Dress 5",
    name: "Dress 5",
    price: "RWF 22,000",
  },
  {
    src: "/completes/2.jpg",
    alt: "Complete 2",
    name: "Complete 2",
    price: "RWF 30,000",
  },
  {
    src: "/completes/3.jpg",
    alt: "Complete 3",
    name: "Complete 3",
    price: "RWF 28,000",
  },
  {
    src: "/dresses/4.jpg",
    alt: "Dress 4",
    name: "Dress 4",
    price: "RWF 20,000",
  },
];

const images = [
  { src: "/hero/2.jpg", alt: "Photo 1", title: "casual" },
  { src: "/hero/3.jpg", alt: "Photo 2", title: "party" },
  { src: "/hero/6.jpg", alt: "Photo 3", title: "maxis" },
  { src: "/hero/9.jpg", alt: "Photo 4", title: "minis" },
  { src: "/hero/24.jpg", alt: "Photo 5", title: "boubous" },
  { src: "/hero/31.jpg", alt: "Photo 6", title: "jeans" },
  { src: "/hero/35.jpg", alt: "Photo 5", title: "top dresses" },
  { src: "/hero/49.jpg", alt: "Photo 6", title: "completes" },
];
const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

export default function Home() {
  return (
    <div className="flex w-full flex-col items-center gap-12 pb-2">
      <ul className="grid w-full grid-cols-2 lg:grid-cols-4">
        {images.map((img) => {
          return (
            <li key={img.title} className="overflow-hidden">
              <Link
                className="group relative block"
                href={`/categories/${img.title}`}
              >
                <div
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: "479 / 565" }}
                >
                  <Image
                    src={img.src}
                    fill
                    alt={img.alt}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <h3 className="text-xl font-extrabold text-amber-50">
                    {img.title}
                  </h3>
                  {/* <ChevronRight
                    size={24}
                    className="text-[#eabd63] transition-colors group-hover:text-[#efa105]"
                  /> */}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <section className="flex flex-col items-center justify-center prose py-12 px-6  text-center">
        <h1 className="text-3xl md:text-5xl font-bold">
          Ready to bag your favourites?
        </h1>
        <p className="text-center">
          Shop hot trends and looks from anywhere, anytime. Enjoy safe, secure
          payment options and delivery choices to fit any budget — with all the
          convenience you deserve. Not sure about the fit? Order online and
          return in-store or by courier, whenever it suits you.
        </p>
      </section>

      <section className="grid w-full grid-cols-1 gap-12 pb-12 md:grid-cols-2 md:px-12 lg:grid-cols-5 lg:gap-3 lg:items-center ">
        <div className="flex flex-col items-center justify-center gap-3">
          <CreditCard size={48} />
          <span className="font-bold">Safe Payment</span>
          <span>MoMo, Card payment coming soon</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-3">
          <Motorbike size={48} />
          <span className="font-bold">DELIVERY INFO</span>
          <span>Motard, Courier</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-3">
          <Store size={48} />
          <span className="font-bold">STORE LOCATION</span>
          <span>CHIC Building B30A</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-3">
          <NavigationArrowIcon size={48} />
          <span className="font-bold">TRACK MY ORDER</span>
          <span>Can't wait? Nor can we!</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-3">
          <KeyReturnIcon size={48} />
          <span className="font-bold">HOW TO DO A RETURN</span>
          <span>Free in-store returns</span>
        </div>
      </section>

      <section>
        <span>Got more questions? </span>
        <span className="underline">
          <Link href="faq">Visit our FAQ page</Link>
        </span>
      </section>

      {/* <section className="flex flex-col gap-6">
        <h1 className="font-medium">FOLLOW US</h1>
        <div className="flex gap-4">
          <FaInstagram size={32}/>
          <FaTiktok size={32}/>
          <VscTwitter size={32}/>
          <FaWhatsapp size={32}/>
          <FaFacebook size={32}/>
          <FaYoutube size={32}/>
        </div>
      </section> */}

      <section className="w-full">
        <div className="px-4 pb-4 text-center text-2xl font-bold">
          Welcome back... Let's get shopping!
        </div>

        <ul className="mt-4 px-4 grid grid-cols-2 gap-0.5 md:grid-cols-4 lg:grid-cols-6">
          {new_arrivals.map((item, index) => (
            <li key={index} className="flex flex-col">
              <div className="relative aspect-2/3 w-full overflow-hidden bg-bone">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 17vw, (min-width: 768px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col px-2 pt-4 pb-6">
                <div className="text-base tracking-wide">{item.name}</div>
                <div className="mt-1text-base font-bold">{item.price}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
