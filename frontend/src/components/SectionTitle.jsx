export default function SectionTitle({ label, title }) {
  return (
    <div className="section-title">
      <span className="section-label">{label}</span>
      <h2 className="gradient-text">{title}</h2>
      <div className="title-line" />
    </div>
  );
}
