const PHOTOS = [
  { src: "/gallery/photo1.jpg", alt: "Coach guiding students during morning training" },
  { src: "/gallery/photo2.jpg", alt: "Group photo at Momentum 2K26 event" },
  { src: "/gallery/photo3.jpg", alt: "Athlete qualified for Asian Games 2026 achievement poster" },
];

export default function Gallery() {
  return (
    <section className="section dark" id="gallery">
      <h2>Academy Gallery</h2>
      <div className="gallery">
        {PHOTOS.map((p) => (
          <figure key={p.src}><img src={p.src} alt={p.alt} loading="lazy" /></figure>
        ))}
      </div>
    </section>
  );
}
