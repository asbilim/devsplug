import BioEdit from "@/components/pages/dashboard/bio";
import Header from "@/components/layout/header";
export default function Bio() {
  return (
    <div className="flex flex-col">
      <Header />
      <BioEdit />;
    </div>
  );
}
