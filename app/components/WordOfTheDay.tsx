import { useEffect, useState } from "react";
import { getCached, setCached } from "../utility/cache";
import { WORDS } from "../utility/words";

function getDailyWord() {
  const day = Math.floor(Date.now() / 86400000);
  return WORDS[(day % WORDS.length) + 2];
}

function getMsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

type Definition = {
  word: string;
  phonetic?: string;
  meanings: {
    partOfSpeech: string;
    definitions: { definition: string }[];
  }[];
};

export default function WordOfTheDayElement() {
  const [data, setData] = useState<Definition | null>(null);

  useEffect(() => {
    const ttl = getMsUntilMidnight();
    const cached = getCached<Definition>("wordoftheday", ttl);
    if (cached !== null) {
      setData(cached);
      return;
    }

    const word = getDailyWord();
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then((r) => r.json())
      .then((json) => {
        const definition = json[0];
        setCached("wordoftheday", definition);
        setData(definition);
      });
  }, []);

  const meaning = data?.meanings[0];

  return (
    <>
      <div className="font-semibold text-lg tracking-wide">{data?.word}</div>
      {data?.phonetic && (
        <div className="text-foreground/50 text-xs mb-1">{data.phonetic}</div>
      )}
      <div className="text-xs text-foreground/50 italic mb-1">
        {meaning?.partOfSpeech}
      </div>
      <div className="flex flex-col gap-2">
        {meaning?.definitions.map((d, index) => (
          <div className="text-sm tracking-tight" key={d.definition}>
            {index + 1}
            {" ~  "}
            {d.definition}
          </div>
        ))}
      </div>
    </>
  );
}
