"use client";

import { useEffect, useMemo, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { getToken } from "../../../lib/auth";
import Navbar from "../../componenets/Navbar";
import { Feather, Sparkles, HeartPulse, Sun, Loader2 } from "lucide-react";

export default function NewJournalPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable bold and italic
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "Start writing your thoughts...",
      }),
    ],
    content: "",
  });

  const prompts = useMemo(
    () => [
      "Today I'm grateful for...",
      "Something that challenged me was...",
      "A small win I'd like to celebrate is...",
      "Right now, I feel...",
    ],
    []
  );

  useEffect(() => {
    if (!editor) return;

    const updateCount = () => {
      const text = editor.getText().trim();
      if (!text) {
        setWordCount(0);
        return;
      }
      setWordCount(text.split(/\s+/).length);
    };

    updateCount();
    editor.on("update", updateCount);

    return () => {
      editor.off("update", updateCount);
    };
  }, [editor]);

  const handleSave = async () => {
    if (!editor || editor.isEmpty) {
      toast.error("Please write something in your journal.");
      return;
    }

    try {
      setIsSaving(true);
      const content = editor.getHTML();
      const token = getToken();
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/journals`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Journal saved!");
      router.push("/journal");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Error saving journal");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePromptInsert = (prompt: string) => {
    if (!editor) return;
    editor.chain().focus().insertContent(`${prompt} `).run();
  };

  return (
    <>
      <Navbar />
      <main className="relative min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#eef2f8] via-white to-[#f5f7fb] pb-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(143,174,206,0.18),transparent_70%)]" />

        <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
          <section className="space-y-4 text-center">
            <Badge
              variant="outline"
              className="mx-auto flex w-fit items-center gap-2 border-[#bcd1e6] bg-white/80 text-[#4f6f8f]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Daily reflection
            </Badge>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl [font-family:var(--font-newsreader)]">
                Anchor your thoughts for today
              </h1>
              <p className="mx-auto max-w-2xl text-sm text-slate-600">
                Capture what’s on your mind, notice the emotions beneath it, and
                let MindLog help you stay grounded. Use the quick prompts or the
                toolbar to shape your story.
              </p>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-6">
              <div className="flex justify-end border border-[#d6e1f1] bg-white/80 p-3 shadow-sm">
                <div className="text-xs text-slate-500">
                  {wordCount} {wordCount === 1 ? "word" : "words"}
                </div>
              </div>

              <div className="border border-[#d6e1f1] bg-white/85 p-6 shadow-lg shadow-[#cbd9ed]/40 min-h-[400px]">
                {editor ? (
                  <EditorContent
                    editor={editor}
                    className="prose max-w-full text-slate-800 focus:outline-none prose-lg prose-headings:font-semibold prose-headings:text-slate-900 [&_.ProseMirror]:min-h-[300px] [&_.ProseMirror]:text-lg [&_.ProseMirror]:leading-relaxed [&_.ProseMirror]:focus:outline-none"
                  />
                ) : null}
              </div>

              <div className="space-y-3">
                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  <Feather className="h-4 w-4 text-[#4f6f8f]" />
                  Need a spark?
                </h2>
                <div className="flex flex-wrap gap-2">
                  {prompts.map((prompt) => (
                    <Button
                      key={prompt}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-none border-[#bcd1e6] bg-white/80 text-xs text-[#4f6f8f] hover:border-[#9ab7d3] hover:bg-[#eef4fb]"
                      onClick={() => handlePromptInsert(prompt)}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 rounded-none bg-[#4f6f8f] px-6 text-white hover:bg-[#456380]"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <HeartPulse className="h-4 w-4" /> Save journal
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-none border-[#bcd1e6] text-[#2f4c63] hover:bg-[#eef4fb]"
                  onClick={() => router.push("/journal")}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            </div>

            <aside className="hidden h-fit flex-col gap-5 border border-[#d6e1f1] bg-white/85 p-6 shadow-md shadow-[#cbd9ed]/30 lg:flex">
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                  <Sun className="h-5 w-5 text-[#4f6f8f]" />
                  Gentle prompts
                </h3>
                <p className="text-sm text-slate-600">
                  Try exploring these directions if you feel stuck. Your words
                  stay private and help MindLog understand your emotional
                  patterns.
                </p>
              </div>
              <Separator className="border-[#d6e1f1]" />
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="border border-[#d6e1f1] bg-[#e7eff7] p-3">
                  Notice one emotion that surfaced today. What sparked it?
                </li>
                <li className="border border-[#d6e1f1] bg-[#e7eff7] p-3">
                  Describe a moment you appreciated—even if it was fleeting.
                </li>
                <li className="border border-[#d6e1f1] bg-[#e7eff7] p-3">
                  What support would feel nourishing tomorrow?
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
