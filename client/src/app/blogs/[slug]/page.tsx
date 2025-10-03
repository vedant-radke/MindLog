import axios from "axios";
import Image from "next/image";
import Navbar from "../../componenets/Navbar";

// Next.js App Router expects this structure
interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  // If params is a promise (like in some build checks), await it
  const resolvedParams = await Promise.resolve(params);

  const res = await axios.get(
    `https://dev.to/api/articles/${resolvedParams.slug}`
  );
  const blog = res.data;

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-4 text-purple-800">
          {blog.title}
        </h1>
        <p className="text-sm text-gray-500 mb-4">
          By {blog.user.name} on{" "}
          {new Date(blog.published_at).toLocaleDateString()}
        </p>

        {blog.cover_image && (
          <div className="relative mb-6 h-72 w-full overflow-hidden rounded-2xl">
            <Image
              src={blog.cover_image}
              alt={blog.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        <article
          className="prose prose-lg"
          dangerouslySetInnerHTML={{ __html: blog.body_html }}
        />
      </div>
    </>
  );
}
