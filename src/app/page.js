import Image from "next/image";
import MainPage from "./mainpage";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="flex bg-custom-radial dark min-h-screen flex-col items-center justify-between p-24">
      <MainPage />
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
      <Footer/>
    </main>
  );
}
