"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Input } from "../../components/ui/input";
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

type Blog = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  url: string;
  slug: string; // ✅ new
};

const TAGS = ["mentalhealth", "yoga", "habits", "gym", "meditation", "productivity"];

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
      const res = await axios.get(`https://dev.to/api/articles?tag=${tag}&per_page=20`);
      const data = res.data.map((item: any) => ({
        id: item.id,
        title: item.title,
        description:
          item.description || item.description_html || item.body_markdown?.slice(0, 100),
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

  const filteredBlogs = blogs.filter((b) =>
    [b.title, b.description, ...b.tags]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
    <Navbar/>
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-800">
        🧘 Self-Help & Wellness Blogs
      </h1>

      <div className="max-w-xl mx-auto mb-6 flex flex-col sm:flex-row items-center gap-4">
        <Input
          placeholder="🔍 Search blogs e.g., anxiety, mindset, relaxation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl shadow w-full"
        />

        <Select onValueChange={setSelectedTag} defaultValue={selectedTag}>
          <SelectTrigger className="w-full sm:w-56 rounded-xl shadow">
            <SelectValue placeholder="Choose category" />
          </SelectTrigger>
          <SelectContent>
            {TAGS.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading blogs...</p>
      ) : filteredBlogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found for this filter.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <Card
              key={blog.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {blog.imageUrl && (
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-44 object-cover"
                />
              )}
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-2">{blog.title}</h2>
                <p className="text-sm text-gray-700 mb-3 line-clamp-3">{blog.description}</p>

                <div className="flex flex-wrap gap-2 mb-3">
                  {blog.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <Link
                  href={`/blogs/${blog.slug}`}
                  className="text-blue-600 underline text-sm"
                >
                  Read full article →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
    </>
  );
}
