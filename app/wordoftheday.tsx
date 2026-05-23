import { useEffect, useState } from "react";

const WORDS = [
  "ephemeral",
  "serendipity",
  "luminous",
  "tenacious",
  "melancholy",
  "enigmatic",
  "resilient",
  "sublime",
];

function getDailyWord() {
  const day = Math.floor(Date.now() / 86400000); // changes every 24h
  return WORDS[day % WORDS.length];
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
    const word = getDailyWord();
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then((r) => r.json())
      .then((json) => setData(json[0]));
  }, []);

  const meaning = data?.meanings[0];
  const definition = meaning?.definitions[0]?.definition;

  return (
    <>
      <div className="font-semibold text-lg">{data?.word}</div>
      {data?.phonetic && (
        <div className="text-foreground/50 text-xs mb-1">{data.phonetic}</div>
      )}
      <div className="text-xs text-foreground/50 italic mb-1">
        {meaning?.partOfSpeech}
      </div>
      <div className="text-sm">{definition}</div>
    </>
  );
}
