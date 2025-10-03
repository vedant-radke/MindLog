"use client";

import { useEffect, useMemo, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";

import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { getToken } from "../../../lib/auth";
import { cn } from "../../../lib/utils";
import Navbar from "../../componenets/Navbar";
import { Feather, Sparkles, HeartPulse, Sun, Loader2 } from "lucide-react";

export default function NewJournalPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
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

  const ToolbarButton = ({
    onClick,
    isActive,
    label,
  }: {
    onClick: () => void;
    isActive?: boolean;
    label: string;
  }) => (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      className={cn(
        "h-8 rounded-full border border-transparent px-3 text-xs font-medium text-slate-600",
        isActive && "border-emerald-300 bg-emerald-50 text-emerald-700"
      )}
      onClick={onClick}
    >
      {label}
    </Button>
  );

  return (
    <>
      <Navbar />
      <main className="relative min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 pb-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.16),transparent_70%)]" />

        <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
          <section className="space-y-4 text-center">
            <Badge
              variant="outline"
              className="mx-auto flex w-fit items-center gap-2 border-emerald-200 bg-white/80 text-emerald-700"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Daily reflection
            </Badge>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
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
              <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-emerald-100 bg-white/70 p-3 shadow-sm">
                <ToolbarButton
                  label="Bold"
                  isActive={editor?.isActive("bold")}
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                />
                <ToolbarButton
                  label="Italic"
                  isActive={editor?.isActive("italic")}
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                />
                <ToolbarButton
                  label="Bullet list"
                  isActive={editor?.isActive("bulletList")}
                  onClick={() =>
                    editor?.chain().focus().toggleBulletList().run()
                  }
                />
                <ToolbarButton
                  label="Numbered list"
                  isActive={editor?.isActive("orderedList")}
                  onClick={() =>
                    editor?.chain().focus().toggleOrderedList().run()
                  }
                />
                <ToolbarButton
                  label="Highlight"
                  isActive={editor?.isActive("textStyle", { color: "#047857" })}
                  onClick={() => {
                    if (!editor) return;
                    const active = editor.isActive("textStyle", {
                      color: "#047857",
                    });
                    editor
                      .chain()
                      .focus()
                      .setColor(active ? "inherit" : "#047857")
                      .run();
                  }}
                />
                <div className="ml-auto text-xs text-slate-500">
                  {wordCount} {wordCount === 1 ? "word" : "words"}
                </div>
              </div>

              <div className="rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-lg shadow-emerald-100/40">
                {editor ? (
                  <EditorContent
                    editor={editor}
                    className="prose max-w-full text-slate-800 focus:outline-none prose-headings:font-semibold prose-headings:text-slate-900"
                  />
                ) : null}
              </div>

              <div className="space-y-3">
                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  <Feather className="h-4 w-4 text-emerald-500" />
                  Need a spark?
                </h2>
                <div className="flex flex-wrap gap-2">
                  {prompts.map((prompt) => (
                    <Button
                      key={prompt}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-full border-emerald-200 bg-white/70 text-xs text-emerald-700 hover:bg-emerald-50"
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
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 text-white hover:bg-emerald-500"
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
                  className="rounded-full"
                  onClick={() => router.push("/journal")}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            </div>

            <aside className="hidden h-fit flex-col gap-4 rounded-3xl border border-emerald-100 bg-white/70 p-6 shadow-md shadow-emerald-100/30 lg:flex">
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                  <Sun className="h-5 w-5 text-emerald-500" />
                  Gentle prompts
                </h3>
                <p className="text-sm text-slate-600">
                  Try exploring these directions if you feel stuck. Your words
                  stay private and help MindLog understand your emotional
                  patterns.
                </p>
              </div>
              <Separator className="border-emerald-100" />
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="rounded-2xl bg-emerald-50/80 p-3">
                  Notice one emotion that surfaced today. What sparked it?
                </li>
                <li className="rounded-2xl bg-emerald-50/80 p-3">
                  Describe a moment you appreciated—even if it was fleeting.
                </li>
                <li className="rounded-2xl bg-emerald-50/80 p-3">
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
