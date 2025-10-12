"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import Navbar from "../componenets/Navbar";
import { Separator } from "../../components/ui/separator";
import { cn } from "../../lib/utils";
import { Compass, Sparkles } from "lucide-react";

type Blog = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  url: string;
  slug: string; // ✅ new
};

const TAGS = [
  "mentalhealth",
  "yoga",
  "habits",
  "gym",
  "meditation",
  "productivity",
];

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("mentalhealth");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs(selectedTag);
  }, [selectedTag]);

  const fetchBlogs = async (tag: string) => {
    try {
      setLoading(true);
      type Journal = {
        id: string;
        title: string;
        description: string;
        imageUrl: string;
        tag_list: string[];
        url: string;
        slug: string;
        description_html: string;
        body_markdown: string;
        cover_image: string;
      };
      const res = await axios.get(
        `https://dev.to/api/articles?tag=${tag}&per_page=20`
      );
      const data = res.data.map((item: Journal) => ({
        id: item.id,
        title: item.title,
        description:
          item.description ||
          item.description_html ||
          item.body_markdown?.slice(0, 100),
        imageUrl: item.cover_image,
        tags: item.tag_list || [],
        url: item.url,
        slug: item.id.toString(), // ✅ use `id` as slug (since dev.to doesn't provide a slug)
      }));
      setBlogs(data);
    } catch (error) {
      console.error("❌ Error fetching blogs:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = useMemo(
    () =>
      blogs.filter((blog) =>
        [blog.title, blog.description, ...blog.tags]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [blogs, search]
  );

  const skeletonCards = Array.from({ length: 6 });

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen bg-gradient-to-b from-[#eef2f8] via-white to-[#f5f7fb] pb-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(143,174,206,0.18),transparent_65%)]" />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16">
          <section className="grid gap-8 text-center lg:grid-cols-[1.2fr_1fr] lg:items-center lg:text-left">
            <div className="flex flex-col items-center gap-6 lg:items-start">
              <Badge
                variant="outline"
                className="border-[#bcd1e6] bg-white/80 text-[#4f6f8f]"
              >
                <Sparkles className="mr-2 h-4 w-4" /> Curated reads for calm
                minds
              </Badge>
              <div className="space-y-4">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl [font-family:var(--font-newsreader)]">
                  Explore mindful perspectives from trusted writers
                </h1>
                <p className="mx-auto max-w-2xl text-base text-slate-600 lg:mx-0">
                  Browse a rotating library of DEV community essays about
                  emotional wellbeing, focus, and daily rituals. Tailor your
                  feed with tags or search for specific themes.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-500 lg:justify-start">
                <div className="inline-flex items-center gap-2 border border-[#d6e1f1] bg-white px-4 py-1">
                  <Compass className="h-3.5 w-3.5 text-[#4f6f8f]" />
                  Top tag:{" "}
                  <span className="font-medium text-[#4f6f8f]">
                    #{selectedTag}
                  </span>
                </div>
                <span className="hidden h-1.5 w-1.5 bg-[#d6e1f1] md:inline-block" />
                <span>
                  {filteredBlogs.length}{" "}
                  {filteredBlogs.length === 1 ? "article" : "articles"}{" "}
                  available
                </span>
              </div>
            </div>

            <div className="flex h-full flex-col gap-4 border border-[#d6e1f1] bg-white/85 p-6 text-left text-sm text-slate-600 shadow-md shadow-[#9ab7d3]/30">
              <h3 className="text-base font-semibold text-slate-900">
                Reading rituals
              </h3>
              <p>
                Save your favorite tags, scan summaries first, or dive deep when
                you find a piece that resonates. The DEV community keeps fresh
                perspectives flowing.
              </p>
              <Separator className="border-[#d6e1f1]" />
              <ul className="space-y-2 text-[#2f4c63]">
                <li className="border border-[#d6e1f1] bg-[#eef2f9] p-3">
                  Explore multiple tags to balance inspiration and practical
                  guidance.
                </li>
                <li className="border border-[#d6e1f1] bg-[#eef2f9] p-3">
                  Skim first paragraphs to see if an article aligns with your
                  current mood.
                </li>
                <li className="border border-[#d6e1f1] bg-[#eef2f9] p-3">
                  Share meaningful finds with a friend—reflection is easier
                  together.
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-6 border border-[#d6e1f1] bg-white/85 p-6 shadow-lg shadow-[#9ab7d3]/25 backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="w-full md:max-w-md">
                <Input
                  placeholder="Search for breathing exercises, focus, compassion..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="h-11 border border-[#d6e1f1] bg-white/80 focus:border-[#4f6f8f] focus:ring-[#c2d0e5]"
                  aria-label="Search blog posts"
                />
              </div>

              <Select onValueChange={setSelectedTag} defaultValue={selectedTag}>
                <SelectTrigger className="w-full border border-[#d6e1f1] bg-white/80 focus:border-[#4f6f8f] focus:ring-[#c2d0e5] md:w-60">
                  <SelectValue placeholder="Choose category" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {TAGS.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      #{tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <button
                  key={`${tag}-chip`}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={cn(
                    "border px-3 py-1 text-xs font-medium transition",
                    selectedTag === tag
                      ? "border-[#4f6f8f] bg-[#d6e1f1] text-[#2f4864]"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[#4f6f8f]/60 hover:text-[#4f6f8f]"
                  )}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </section>

          <Separator className="border-[#d6e1f1]" />

          <section>
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {skeletonCards.map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="animate-pulse border border-[#d6e1f1] bg-white/70 p-5 shadow-sm shadow-[#9ab7d3]/20"
                  >
                    <div className="mb-4 h-44 w-full bg-[#e4ebf6]" />
                    <div className="mb-2 h-5 bg-[#d6e1f1]" />
                    <div className="mb-2 h-4 bg-[#d6e1f1]" />
                    <div className="h-4 w-2/3 bg-[#d6e1f1]" />
                  </div>
                ))}
              </div>
            ) : filteredBlogs.length === 0 ? (
              <Card className="border border-dashed border-[#bcd1e6] bg-white/80 text-center">
                <CardContent className="space-y-4 p-8">
                  <h2 className="text-lg font-semibold text-slate-900">
                    No articles match your search yet
                  </h2>
                  <p className="text-sm text-slate-600">
                    Try a different phrase or explore another tag to surface new
                    perspectives.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {TAGS.slice(0, 4).map((tag) => (
                      <button
                        key={`empty-${tag}`}
                        className="border border-[#d6e1f1] bg-[#eef2f8] px-3 py-1 text-xs font-medium text-[#2f4864]"
                        onClick={() => setSelectedTag(tag)}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredBlogs.map((blog) => (
                  <Card
                    key={blog.id}
                    className="group flex h-full flex-col border border-[#d6e1f1] bg-white/90 shadow-sm shadow-[#9ab7d3]/25 transition-all duration-300 hover:-translate-y-1 hover:border-[#4f6f8f] hover:shadow-xl"
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      {blog.imageUrl ? (
                        <Image
                          src={blog.imageUrl}
                          alt={blog.title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#eef2f8] via-white to-[#d6e1f1] text-sm font-medium text-[#4f6f8f]">
                          Mindful reading awaits
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-slate-900/10 to-transparent" />
                      <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={`${blog.id}-${tag}`}
                            className="border border-white/40 bg-white/90 text-xs text-[#2f4864]"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <CardContent className="flex flex-1 flex-col gap-4 px-6 py-5">
                      <div className="space-y-2">
                        <h2 className="text-lg font-semibold text-slate-900 line-clamp-2">
                          {blog.title}
                        </h2>
                        <p className="text-sm leading-relaxed text-slate-600 line-clamp-3">
                          {blog.description}
                        </p>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {blog.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={`${blog.id}-footer-${tag}`}
                              variant="outline"
                              className="border-[#bcd1e6] text-[#4f6f8f]"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        <Link href={`/blogs/${blog.slug}`} className="shrink-0">
                          <Button
                            variant="ghost"
                            className="gap-1 text-[#4f6f8f] hover:text-[#2f4864]"
                          >
                            Read more
                            <span aria-hidden="true">→</span>
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
