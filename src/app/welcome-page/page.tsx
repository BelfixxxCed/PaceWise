import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Top Section - White Background */}
      <div className="relative min-h-[60vh] px-8 py-16">
        {/* Decorative Geometric Shapes - Top Left */}
        <div className="absolute left-0 top-0">
          <div className="relative">
            {/* Square */}
            <div className="absolute left-[115px] top-[45px] h-[130px] w-[130px] bg-[#2d4a3e]" />
            {/* Triangle */}
            <div className="absolute left-0 top-[175px] h-0 w-0 border-b-[125px] border-l-[110px] border-r-0 border-t-0 border-b-transparent border-l-[#2d4a3e]" />
            <div className="absolute left-[115px] top-[175px] h-0 w-0 border-b-[125px] border-l-0 border-r-[130px] border-t-0 border-b-white border-r-transparent" />
            {/* Circle */}
            <div className="absolute left-[8px] top-[315px] h-[130px] w-[130px] rounded-full bg-[#2d4a3e]" />
            {/* Small Circle */}
            <div className="absolute left-[340px] top-[145px] h-[25px] w-[25px] rounded-full bg-[#2d4a3e]" />
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 mx-auto max-w-2xl pt-12 text-center">
          <h1 className="mb-6 font-sans text-7xl font-black tracking-tight text-black">ByteBack</h1>
          <p className="mb-8 text-xl font-semibold text-black">Forget Forgetting.</p>
          <div className="mx-auto max-w-lg space-y-4 text-base leading-relaxed text-black">
            <p>
              ByteBack is a spaced learning app that helps you study smarter by reminding you when to review—not just
              what to study. No more cramming. Just consistent, effective learning.
            </p>
            <p className="font-medium">Built by students, for students.</p>
          </div>
        </div>
      </div>

      {/* Bottom Section - Dark Green Background */}
      <div className="relative bg-gradient-to-br from-[#2d4a3e] via-[#4a6456] to-[#5a7464] px-8 py-24">
        {/* Decorative Geometric Shapes - Bottom Right */}
        <div className="absolute bottom-0 right-0">
          <div className="relative">
            {/* Half Circle Top */}
            <div className="absolute right-[165px] top-[60px] h-[100px] w-[100px] overflow-hidden rounded-full border-2 border-black">
              <div className="h-1/2 w-full bg-white" />
            </div>
            {/* Rectangle */}
            <div className="absolute right-[70px] top-[185px] h-[140px] w-[95px] border-2 border-black bg-[#6b7f6b]" />
            {/* Triangle */}
            <div className="absolute right-0 top-[185px] h-0 w-0 border-b-[140px] border-l-0 border-r-[70px] border-t-0 border-b-transparent border-r-[#6b7f6b]" />
            <div
              className="absolute right-0 top-[185px] h-0 w-0 border-b-[140px] border-l-0 border-r-[70px] border-t-0 border-b-transparent border-r-black"
              style={{ borderRightWidth: "2px" }}
            />
            {/* White Rectangle */}
            <div className="absolute right-[165px] top-[325px] h-[100px] w-[95px] border-2 border-black bg-white" />
            {/* White Triangle */}
            <div className="absolute right-[70px] top-[325px] h-0 w-0 border-b-[100px] border-l-0 border-r-[95px] border-t-0 border-b-transparent border-r-white" />
            <div
              className="absolute right-[70px] top-[325px] h-0 w-0 border-b-[100px] border-l-0 border-r-[95px] border-t-0 border-b-transparent border-r-black"
              style={{ borderRightWidth: "2px" }}
            />
            {/* Half Circle Bottom */}
            <div className="absolute bottom-[50px] right-[70px] h-[90px] w-[90px] overflow-hidden rounded-full border-2 border-black">
              <div className="h-full w-full bg-[#6b7f6b]" />
            </div>
            {/* Small White Circle */}
            <div className="absolute bottom-[150px] right-[280px] h-[30px] w-[30px] rounded-full border-2 border-black bg-white" />
          </div>
        </div>

        {/* CTA Content */}
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-center gap-12 md:flex-row md:items-center">
          <div className="text-center md:text-left md:flex-1 md:-ml-45">
            <h2 className="font-sans text-8xl font-black leading-tight text-white">
              Get
              <br />
              Started
            </h2>
          </div>
          <div className="flex gap-6 justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
            <Link href="/login">
              <Button
                variant="secondary"
                size="lg"
                className="h-10 rounded-none bg-[#e8e8e8] px-12 text-lg font-semibold text-[#5a5a5a] hover:bg-[#d8d8d8]"
                style={{
                  clipPath: "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)",
                }}
              >
                Sign up
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="secondary"
                size="lg"
                className="h-10 rounded-none bg-[#e8e8e8] px-12 text-lg font-semibold text-[#5a5a5a] hover:bg-[#d8d8d8]"
                style={{
                  clipPath: "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)",
                }}
              >
                Log in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
