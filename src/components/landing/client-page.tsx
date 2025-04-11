"use client";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";

export default function ClientLandingPage() {
  const { status } = useSession();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/images/palboti.png"
              alt="PalBoti Logo"
              width={40}
              height={40}
              className="animate-float"
            />
            <span className="font-bold text-xl text-primary">PalBoti</span>
          </div>
          {status === "authenticated" ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button className="bg-primary hover:bg-primary/90">
                  Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/auth/sign-in">
                <Button className="bg-primary hover:bg-primary/90">
                  sign in
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button variant="outline">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 md:py-28 animate-pulse-shadow">
          <div className="container flex flex-col items-center text-center">
            <div className="mb-10 flex items-center justify-center">
              <Image
                src="/images/nest.png"
                alt="NEST Hackathon"
                width={200}
                height={100}
                className="mr-4"
              />
              <Image
                src="/images/palboti.png"
                alt="PalBoti Logo"
                width={100}
                height={100}
                className="animate-float"
              />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-primary mb-4">
              Smart Warehouse Manager
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl mb-8">
              An end-to-end web application that interfaces with an autonomous
              robot to manage product classification, storage, and retrieval in
              a warehouse setting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  View Dashboard
                </Button>
              </Link>
              <Link href="#about">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="about" className="py-16 bg-secondary/50">
          <div className="container">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
              Our <span className="text-primary">Mission</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-lg mb-4">
                  Develop an end-to-end web application that interfaces with an
                  autonomous robot to manage product classification, storage,
                  and retrieval in a warehouse setting.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="mr-2 text-primary">✓</span>
                    <span>Real-time MQTT communication with robots</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-primary">✓</span>
                    <span>Robust Next.js frontend with responsive design</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-primary">✓</span>
                    <span>API routes with Next.js and Prisma</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-primary">✓</span>
                    <span>MongoDB for data persistence</span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-md h-64 bg-background rounded-lg overflow-hidden animate-pulse-shadow">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src="/images/palboti.png"
                      alt="PalBoti Robot"
                      width={150}
                      height={150}
                      className="animate-float"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
              Our <span className="text-primary">Team</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-xl mb-2">
                  Mechatronics Engineers
                </h3>
                <p className="text-muted-foreground">
                  Designing and implementing the robotic hardware and control
                  systems for warehouse automation.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-xl mb-2">
                  Embedded Systems Engineer
                </h3>
                <p className="text-muted-foreground">
                  Developing the firmware and communication protocols for the
                  robot's real-time operations.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-xl mb-2">AI Engineer</h3>
                <p className="text-muted-foreground">
                  Creating intelligent algorithms for product classification and
                  optimal warehouse navigation.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-secondary/50">
          <div className="container">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12 text-center">
              Our <span className="text-primary">Sponsors</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-items-center">
              <div className="bg-white p-6 rounded-lg shadow-md sponsor-logo">
                <Image
                  src="/images/mobilis.png"
                  alt="Mobilis"
                  width={200}
                  height={100}
                  className="h-16 w-auto object-contain"
                />
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md sponsor-logo">
                <Image
                  src="/images/deepminds.png"
                  alt="DeepMinds"
                  width={200}
                  height={100}
                  className="h-16 w-auto object-contain"
                />
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md sponsor-logo">
                <Image
                  src="/images/sonatrach.png"
                  alt="Sonatrach"
                  width={200}
                  height={100}
                  className="h-16 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
          <p className="text-sm text-muted-foreground">
            © 2025 PalBoti Team. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              href="#about"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              About
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
