export default function Maintenance() {
  return (
    <div className="min-h-screen bg-[#f9f6ef] flex items-center justify-center px-6">
      <div className="text-center max-w-xl">
        <h1 className="text-5xl tracking-[0.2em] text-[#737144] font-light">
          HERITAGE SPARROW
        </h1>

        <div className="w-24 h-px bg-[#737144]/40 mx-auto my-8"></div>

        <h2 className="text-2xl text-[#737144] mb-4">
          We'll Be Back Soon
        </h2>

        <p className="text-[#737144]/70 leading-8">
          Our website is temporarily unavailable while we prepare
          something beautiful for you.
          <br />
          Thank you for your patience.
        </p>

        <div className="mt-12 text-sm tracking-[0.3em] uppercase text-[#737144]/60">
          Heritage Sparrow
        </div>
      </div>
    </div>
  );
}