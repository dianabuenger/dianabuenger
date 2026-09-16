import { Artist } from "./_components/Artist";
import { thumbnails } from "./_lib/projects";

export default function Home() {
  return <Artist thumbnails={thumbnails} />;
}
