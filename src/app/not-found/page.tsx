"use client"

import Link from "next/link"
import Image from "next/image"

export default function NotFound() {
  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-white p-4">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 max-w-7xl w-full">
        {/* Illustration */}
          <div className="flex-shrink-0 w-64 h-[33rem] md:w-[32rem] md:h-[41rem] lg:w-[40rem] lg:h-[46rem] overflow-hidden flex items-start justify-center mt-14 md:mt-18">
            <Image
              src="/new_404-avatar.png"
              alt="404 illustration"
              width={400}
              height={400}
              priority
              className="w-full h-auto object-cover object-top"
            />
          </div>

        {/* Content Box */}
        <div
          className="flex flex-col items-center gap-6 p-8 md:p-12 rounded-3xl border flex-1 max-w-xl -ml-6 md:-ml-10"
          style={{
            borderColor: "#4E935D",
            backgroundColor: "#f9fdf8",
            boxShadow: "25px 28px 30px -20px rgba(113, 210, 133, 0.2)",
          }}
        >
          {/* 404 Number */}
          <h1
            className="text-7xl md:text-9xl font-bold text-center"
            style={{
              color: "#4E935D",
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 700,
            }}
          >
            404
          </h1>

          {/* Oops Message */}
            <h2
              className="text-xl md:text-xl text-center -mt-7"
              style={{
                color: "#4E935D",
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 600,
              }}
            >
              Oops! Page not Found.
            </h2>

          {/* Description Text */}
          <p
            className="text-center text-xs md:text-sm leading-snug mt-2 mb-2"
            style={{
              color: "rgba(0, 0, 0, 0.6)",
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 300,
            }}
          >
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been moved or no longer
            exists—please return to the homepage to continue.
          </p>

          {/* Return Button */}
          <Link href="/" className="w-full flex justify-center">
            <button
              className="px-8 py-3 md:px-10 md:py-3 rounded-lg font-semibold text-white border border-[#007C1A] focus:outline-none focus:ring-2 focus:ring-[#007C1A]/40 transition-colors bg-[#71D285] hover:bg-[#4E935D] focus:bg-[#4E935D]"
              style={{ fontFamily: '"Poppins", sans-serif', fontSize: '1rem' }}
            >
              Return homepage
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
