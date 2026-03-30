interface MnemonicGridProps {
  words: string[];
}

export function MnemonicGrid({ words }: MnemonicGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {words.map((word, i) => (
        <div
          key={i}
          className="bg-surface-container-lowest p-4 rounded-xl flex items-center gap-3 hover:bg-surface-container-high transition-colors duration-200"
        >
          <span className="text-[10px] font-bold text-outline font-label w-5">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="font-headline font-semibold text-primary">{word}</span>
        </div>
      ))}
    </div>
  );
}
