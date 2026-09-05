import BottomNav from "@/features/navigation/components/bottom-nav";
import Header from "@/component/dashboard/Header";

export default function Home() {
  return (
    <div className="container min-h-screen flex flex-col justify-between">
      <div className="flex-1 px-5 pt-6"> 
        <Header />
      </div>
      <div> <BottomNav/> </div>
    </div>
  );
}
