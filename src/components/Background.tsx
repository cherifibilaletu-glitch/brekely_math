const blob2 = { animationDelay: "2s" }
const blob3 = { animationDelay: "4s" }
const gridStyle = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
  backgroundSize: "44px 44px",
}

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#06070d]" />
      <div className="absolute -top-40 -start-32 w-[40rem] h-[40rem] rounded-full bg-indigo-600/30 blur-[120px] animate-float" />
      <div className="absolute top-1/3 -end-40 w-[36rem] h-[36rem] rounded-full bg-cyan-500/20 blur-[120px] animate-float" style={blob2} />
      <div className="absolute -bottom-40 start-1/3 w-[34rem] h-[34rem] rounded-full bg-fuchsia-600/20 blur-[120px] animate-float" style={blob3} />
      <div className="absolute inset-0 opacity-[0.05]" style={gridStyle} />
    </div>
  )
}
