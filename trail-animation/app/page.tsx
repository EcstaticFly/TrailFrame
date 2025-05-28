import TrailContainer from "@/components/TrailContainer";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-img">
          <img src="/hero.jpg" alt="" />
        </div>
        <p>[ Reality renders one frame at a time  ]</p>
        <p>Frames fade, I remain — Suyash</p>

        <TrailContainer/>
      </section>
    </>
  );
}
