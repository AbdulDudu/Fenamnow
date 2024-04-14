"use client";

import { motion } from "framer-motion";
import SearchBox from "./search-box";

export default function HeroSection() {
  return (
    <section className="relative flex h-[70vh] w-full items-center">
      <div className="container relative flex h-full w-full flex-col-reverse items-center justify-center gap-y-8 rounded-lg bg-[url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=3396&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover md:flex-row md:justify-between md:gap-0">
        {/* <Button>Get Started</Button> */}

        <SearchBox />
        <div className="absolute left-0 h-full w-full rounded-lg backdrop-brightness-50" />
        {/* Tagline */}
        <motion.div
          className="z-10 w-full md:w-1/3"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0, dur: 400 }}
          transition={{ delay: 1 }}
        >
          <h1 className="text-white">
            Easy Search, Easy Find, with{" "}
            <span className="text-primary">Fenamnow</span>
          </h1>
        </motion.div>
      </div>
    </section>
  );
}
