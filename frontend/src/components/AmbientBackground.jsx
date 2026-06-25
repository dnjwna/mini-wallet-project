export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-base">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(52,211,153,0.05),_transparent_45%)]" />
    </div>
  );
}