export function TestnetHeader({ text = 'TESTNET' }: { text?: string }) {
  return (
    <div className="bg-tertiary-container text-white py-1.5 text-center text-[10px] font-label font-bold tracking-[0.1em] uppercase animate-pulse-slow">
      {text}
    </div>
  );
}
