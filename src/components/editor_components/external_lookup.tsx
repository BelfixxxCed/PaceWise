"use client";

import Image from "next/image";
import { useState } from "react";
import { X, Search, Volume2, ExternalLink, BookOpen } from "lucide-react";

interface WikiResult {
  extract: string;
  thumbnail?: { source: string };
  content_urls?: { desktop?: { page?: string } };
  title?: string;
}

interface DictMeaning {
  partOfSpeech: string;
  definitions: { definition: string; example?: string }[];
}

interface DictResult {
  word: string;
  phonetics: { audio?: string; text?: string }[];
  meanings: DictMeaning[];
}

interface Props {
  onClose: () => void;
}

export default function ExternalLookupPanel({ onClose }: Props) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [wiki, setWiki] = useState<WikiResult | null>(null);
  const [dict, setDict] = useState<DictResult[] | null>(null);

  const lookup = async () => {
    const term = query.trim();
    if (!term) return;

    setLoading(true);
    setError(null);
    setWiki(null);
    setDict(null);

    try {
      const [wikiRes, dictRes] = await Promise.all([
        fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`,
        ),
        fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term)}`,
        ),
      ]);

      // Wikipedia
      if (wikiRes.ok) {
        const wikiData = await wikiRes.json();
        setWiki(wikiData);
      } else if (wikiRes.status === 404) {
        // Fallback: search API
        const searchRes = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(term)}&format=json&origin=*`,
        );
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          const firstResult = searchData?.query?.search?.[0];
          if (firstResult) {
            setWiki({
              extract: firstResult.snippet.replace(/<[^>]+>/g, ""),
              title: firstResult.title,
              content_urls: {
                desktop: {
                  page: `https://en.wikipedia.org/wiki/${encodeURIComponent(firstResult.title)}`,
                },
              },
            });
          }
        }
      }

      // Dictionary
      if (dictRes.ok) {
        const dictData = await dictRes.json();
        setDict(dictData);
      }
      // 404 from dictionary is normal — just show nothing

      if (!wikiRes.ok && !dictRes.ok) {
        setError("No results found for this term.");
      }
    } catch {
      setError("Failed to fetch. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (url: string) => {
    const audio = new Audio(url);
    audio.play().catch(() => {});
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-[#e8f8ec]">
        <div className="flex items-center gap-2 text-[#3E6E48] font-semibold">
          <BookOpen size={18} />
          <span>Lookup Tool</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-[#d0f0d8] rounded-lg transition-colors"
        >
          <X size={16} className="text-[#71D285]" />
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && lookup()}
            placeholder="Search a term..."
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#71D285]"
          />
          <button
            onClick={lookup}
            disabled={loading}
            className="px-3 py-2 bg-[#71D285] text-white rounded-lg hover:bg-[#5eae6e] transition-colors disabled:opacity-50"
          >
            <Search size={16} />
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#71D285]" />
          </div>
        )}

        {error && !loading && (
          <p className="text-sm text-red-500 text-center py-4">{error}</p>
        )}

        {!loading && !wiki && !dict && !error && (
          <p className="text-sm text-gray-400 text-center py-8">
            Enter a word or phrase and press Enter
          </p>
        )}

        {/* Wikipedia Result */}
        {wiki && !loading && (
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-3 py-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Wikipedia
              </span>
              {wiki.content_urls?.desktop?.page && (
                <a
                  href={wiki.content_urls.desktop.page}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#71D285] hover:text-[#3E6E48]"
                >
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
            {wiki.thumbnail?.source && (
              <Image
                src={wiki.thumbnail.source}
                alt={wiki.title ?? query}
                width={640}
                height={256}
                className="w-full h-32 object-cover"
              />
            )}
            <div className="p-3">
              {wiki.title && (
                <p className="font-semibold text-sm text-gray-800 mb-1">
                  {wiki.title}
                </p>
              )}
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-6">
                {wiki.extract}
              </p>
            </div>
          </div>
        )}

        {/* Dictionary Result */}
        {dict && dict.length > 0 && !loading && (
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-3 py-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Dictionary
              </span>
            </div>
            <div className="p-3 space-y-3">
              {/* Word + phonetics */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-base font-bold text-gray-800">
                  {dict[0].word}
                </span>
                {dict[0].phonetics.map((ph, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {ph.text && (
                      <span className="text-sm text-gray-500">{ph.text}</span>
                    )}
                    {ph.audio && (
                      <button
                        onClick={() => playAudio(ph.audio!)}
                        className="p-1 rounded-full hover:bg-gray-100 text-[#71D285]"
                        title="Play pronunciation"
                      >
                        <Volume2 size={14} />
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {/* Meanings */}
              {dict[0].meanings.slice(0, 3).map((meaning, mi) => (
                <div key={mi}>
                  <p className="text-xs font-semibold text-[#3E6E48] italic mb-1">
                    {meaning.partOfSpeech}
                  </p>
                  {meaning.definitions.slice(0, 2).map((def, di) => (
                    <div key={di} className="mb-1">
                      <p className="text-sm text-gray-700">{def.definition}</p>
                      {def.example && (
                        <p className="text-xs text-gray-400 italic mt-0.5">
                          &ldquo;{def.example}&rdquo;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
