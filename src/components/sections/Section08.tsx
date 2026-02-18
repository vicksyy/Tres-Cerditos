export default function Section08() {
  return (
    <section className="section section--08">
      <div
        className="section-bg"
        style={{
          backgroundImage: "url('/img/Section08/bg-section08.png')",
        }}
        aria-hidden="true"
      />
      <div className="section-content section--08-content" role="group" aria-label="Escena 8">
        <img
          className="section--08-house"
          src="/img/Section08/wood_house.png"
          alt="Casa de madera"
          draggable={false}
        />
      </div>
    </section>
  );
}
