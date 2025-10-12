import Image from "next/image";
import HomeNavBar from "../components/HomeNavBar";
import Link from "next/link";

export default function Home() {
  return (
    <>
    <Image
      alt="Deep_Space"
      src="/home_page/vecteezy_concept-of-nebula-with-galaxies-in-deep-space-cosmos_29273064.jpg"
      fill   
      priority
    />
    <HomeNavBar />
    <Link href={'http://localhost:3000/world_map'}>
    <Image className="relative flex place-self-center" width={600} height={600} src="/world_map/earth-ball-planet-isolated.png" alt="World-Image"/>
     </Link>
    </>
  );
}
