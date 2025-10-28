import Image from "next/image";
import HomeNavBar from "../components/HomeNavBar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative overflow-hidden h-screen">
      {/* Background Image — put this BELOW everything else */}
      <Image
        alt="Deep_Space"
        src="/home_page/vecteezy_concept-of-nebula-with-galaxies-in-deep-space-cosmos_29273064.jpg"
        fill
        priority
        className="object-cover z-0"
      />

      {/* Navbar — ABOVE image */}
      <div className="relative z-10">
        <HomeNavBar />
      </div>

      {/* Earth Image at Bottom */}
      <Link href="http://localhost:3000/world_map">
        <Image
          className="
            absolute
            left-1/2 -translate-x-1/2
            top-[30%] md:top-auto md:bottom-[-60%]
            h-[400px] w-[400px] md:h-[1000px] md:w-[1000px]
            z-10
          "
          width={600}
          height={600}
          src="/world_map/earth-ball-planet-isolated.png"
          alt="World Image"
        />
      </Link>
    </div>
  );
}
