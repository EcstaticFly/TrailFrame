import TrailContainer from "@/components/TrailContainer";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-img">
          <img src="/hero.jpg" alt="" />
        </div>
        <p>[ The future moves in frames ]</p>
        <p>Hello World! ~Suyash</p>

        <TrailContainer/>
      </section>
    </>
  );
}
