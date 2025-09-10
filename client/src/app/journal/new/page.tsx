"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { Button } from "../../../components/ui/button";
import { getToken } from "../../../lib/auth";
import Navbar from "../../componenets/Navbar";

export default function NewJournalPage() {
  const router = useRouter();

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

  const handleSave = async () => {
    if (!editor || editor.isEmpty) {
      toast.error("Please write something in your journal.");
      return;
    }

    try {
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
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto mt-6 px-4">
        <h1 className="text-2xl font-bold mb-4">Write a New Journal ✍️</h1>

        <div className="bg-white p-4 rounded-xl shadow border mb-4 min-h-[200px]">
          {editor && (
            <EditorContent
              editor={editor}
              className="prose max-w-full focus:outline-none"
            />
          )}
        </div>

        <Button onClick={handleSave} className="rounded-xl">
          Save Journal
        </Button>
      </div>
    </>
  );
}
