import Card from "@/components/Card";
import Footer from "@/components/Footer";
import Image from "next/image";
import Frame from "../assets/frame-1.png"
import AddArtwork from "@/components/AddArtwork";

export default function Home() {
  return (
    <div className="flex justify-center items-center">
      <AddArtwork/>
    </div>
  );
}
