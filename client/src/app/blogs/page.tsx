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
      <main className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/40 pb-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_65%)]" />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16">
          <section className="flex flex-col items-center gap-6 text-center">
            <Badge
              variant="outline"
              className="border-emerald-200 bg-white/80 text-emerald-700"
            >
              <Sparkles className="mr-2 h-4 w-4" /> Curated reads for calm minds
            </Badge>
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Explore mindful perspectives from trusted writers
              </h1>
              <p className="mx-auto max-w-2xl text-base text-slate-600">
                Browse a rotating library of DEV community essays about
                emotional wellbeing, focus, and daily rituals. Tailor your feed
                with tags or search for specific themes.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-500">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-1">
                <Compass className="h-3.5 w-3.5 text-emerald-600" />
                Top tag:{" "}
                <span className="font-medium text-emerald-600">
                  #{selectedTag}
                </span>
              </div>
              <span className="hidden h-1.5 w-1.5 rounded-full bg-emerald-200 md:inline-block" />
              <span>
                {filteredBlogs.length}{" "}
                {filteredBlogs.length === 1 ? "article" : "articles"} available
              </span>
            </div>
          </section>

          <section className="space-y-6 rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-lg shadow-emerald-100/30 backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="w-full md:max-w-md">
                <Input
                  placeholder="Search for breathing exercises, focus, compassion..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="h-11 rounded-2xl border-emerald-100 bg-white/80 focus:border-emerald-300 focus:ring-emerald-200"
                  aria-label="Search blog posts"
                />
              </div>

              <Select onValueChange={setSelectedTag} defaultValue={selectedTag}>
                <SelectTrigger className="w-full rounded-2xl border-emerald-100 bg-white/80 focus:border-emerald-300 focus:ring-emerald-200 md:w-60">
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
                    "rounded-full border px-3 py-1 text-xs font-medium transition",
                    selectedTag === tag
                      ? "border-emerald-400 bg-emerald-100 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-600"
                  )}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </section>

          <Separator className="border-emerald-100/70" />

          <section>
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {skeletonCards.map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="animate-pulse rounded-3xl border border-emerald-100 bg-white/70 p-5 shadow-sm"
                  >
                    <div className="mb-4 h-44 w-full rounded-2xl bg-emerald-50" />
                    <div className="mb-2 h-5 rounded-full bg-emerald-100" />
                    <div className="mb-2 h-4 rounded-full bg-emerald-100" />
                    <div className="h-4 w-2/3 rounded-full bg-emerald-100" />
                  </div>
                ))}
              </div>
            ) : filteredBlogs.length === 0 ? (
              <Card className="border-dashed border-emerald-200 bg-white/80 text-center">
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
                        className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
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
                    className="group flex h-full flex-col overflow-hidden border border-emerald-100/70 bg-white/85 shadow-sm shadow-emerald-100/30 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
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
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100 text-sm font-medium text-emerald-600">
                          Mindful reading awaits
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-slate-900/10 to-transparent" />
                      <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={`${blog.id}-${tag}`}
                            className="border border-white/40 bg-white/90 text-xs text-slate-800"
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
                              className="border-emerald-200 text-emerald-700"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        <Link href={`/blogs/${blog.slug}`} className="shrink-0">
                          <Button
                            variant="ghost"
                            className="gap-1 text-emerald-700 hover:text-emerald-600"
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
