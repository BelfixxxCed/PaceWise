"use client"

import Image from "next/image"
import Stack from "@mui/material/Stack"
import CircularProgress from "@mui/material/CircularProgress"

export default function LoadingPage() {
  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-white p-4">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 max-w-7xl w-full">
        {/* Illustration Placeholder */}
          <div className="flex-shrink-0 w-20 h-[30rem] md:w-[14rem] md:h-[38rem] lg:w-[18rem] lg:h-[42rem] overflow-hidden flex items-start justify-center mt-30 md:mt-34">
          <Image
            src="/loading-avatar.png"
            alt="Loading illustration"
            width={400}
            height={400}
            priority
            className="w-full h-auto object-cover object-top"
          />
        </div>

        {/* Content Box */}
        <div
          className="flex flex-col items-center gap-6 p-8 md:p-12 rounded-3xl border flex-1 max-w-lg "
          style={{
            borderColor: "#71D285",
            backgroundColor: "#f9fdf8",
            boxShadow: "25px 28px 30px -20px rgba(113, 210, 133, 0.2)",
          }}
        >
          <Stack sx={{ color: "#71D285" }} direction="row" justifyContent="center">
            <CircularProgress size={64} thickness={4} sx={{ color: "#71D285" }} />
          </Stack>

          {/* Loading Text */}
          <h2
            className="text-2xl md:text-3xl font-bold text-center"
            style={{
              color: "#71D285",
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 600,
            }}
          >
            Loading...
          </h2>

          {/* Description Text */}
          <p
            className="text-center text-xs md:text-sm leading-snug"
            style={{
              color: "rgba(0, 0, 0, 0.6)",
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 300,
            }}
          >
            Hang tight! We&apos;re preparing your content. This shouldn&apos;t take long.
          </p>
        </div>
      </div>
    </div>
  )
}
