export default function StatCard({ label, value, suffix }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>
        {value.toLocaleString()}
        {suffix}
      </strong>
    </div>
  );
}
