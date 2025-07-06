import axios from "axios";
import Navbar from "../../componenets/Navbar";

interface BlogPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const res = await axios.get(`https://dev.to/api/articles/${params.slug}`);
  const blog = res.data;

  return (
    <>
    <Navbar/>
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4 text-purple-800">{blog.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        By {blog.user.name} on {new Date(blog.published_at).toLocaleDateString()}
      </p>

      {blog.cover_image && (
        <img src={blog.cover_image} alt={blog.title} className="w-full rounded-xl mb-6" />
      )}

      <article
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: blog.body_html }}
      />
    </div>
    </>
  );
}
