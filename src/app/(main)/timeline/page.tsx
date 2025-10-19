
import { loadTimelinesServer } from "import/app/utils/loadTimelinesServer";
import TimelineCountry from "./_components/TimelineCountry";
import Footer from "./_components/Footer";

export default async function TimelinePage() {
  const timelines = await loadTimelinesServer(); // server-side file scan

  return (
    <div>
      <TimelineCountry timelines={timelines} />
      <Footer />
    </div>
  )
}
