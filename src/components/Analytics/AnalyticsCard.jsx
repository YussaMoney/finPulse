export default function AnalyticsCard({ title, description, children }) {
  return (
    <section className="analytics">
      <div className="analytics-header">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>

      {children}
    </section>
  );
}
