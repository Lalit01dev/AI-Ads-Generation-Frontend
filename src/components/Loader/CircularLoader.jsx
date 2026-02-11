// export default function CircularLoader({ text = "LOADING" }) {
//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
//       <div className="relative w-32 h-32">
//         <div className="absolute inset-0 rounded-full bg-blue-500/30 blur-2xl" />
//         <div
//           className="absolute inset-0 rounded-full animate-spin
//           bg-[conic-gradient(from_0deg,#3b82f6,#60a5fa,#3b82f6)]
//           mask-[radial-gradient(farthest-side,transparent_90%,black_91%)]
//           [-webkit-mask:radial-gradient(farthest-side,transparent_90%,black_91%)]
//         "
//         />
//         <div className="absolute inset-0 animate-spin">
//           <span className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_12px_#60a5fa]" />
//         </div>
//         <div className="absolute inset-0 flex items-center justify-center">
//           <span className="text-blue-400 text-xs font-semibold tracking-[0.3em]">
//             {text}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function CircularLoader({ text = "LOADING", status = "" }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        {/* Circle Loader */}
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 rounded-full bg-blue-500/30 blur-2xl" />

          <div
            className="absolute inset-0 rounded-full animate-spin
            bg-[conic-gradient(from_0deg,#3b82f6,#60a5fa,#3b82f6)] 
            mask-[radial-gradient(farthest-side,transparent_90%,black_91%)]
            [-webkit-mask:radial-gradient(farthest-side,transparent_90%,black_91%)]
          "
          />

          <div className="absolute inset-0 animate-spin">
            <span className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_12px_#60a5fa]" />
          </div>

          {/* Inside Label (Small + Clean) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-blue-400 text-[10px] font-semibold tracking-[0.4em]">
              {text}
            </span>
          </div>
        </div>

        {/* Dynamic Status Outside Circle */}
        {status && (
          <p className="text-sm text-slate-200 text-center max-w-xs leading-relaxed animate-pulse">
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
