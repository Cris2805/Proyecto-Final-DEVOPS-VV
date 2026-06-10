export default function Card({ children, className = '' }) {
  return (
    <section className={`glass-panel rounded-2xl p-5 ${className}`}>
      {children}
    </section>
  );
}
