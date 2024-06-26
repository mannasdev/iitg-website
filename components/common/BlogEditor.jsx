"use client";

import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function BlogEditor() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const { data: session, status } = useSession();

  const authorEmail = session?.user?.email || "";
  const authorId = session?.user?.id || "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await axios.post("/api/s3-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = await response.data;

      const res = await axios.post("/api/create-blog", {
        title,
        content,
        imageUrl: "d2tiq8xmlq55pn.cloudfront.net/" + data.fileName,
        authorEmail,
        authorId,
      });
      console.log(res);
      alert("Blog created successfully");
      router.push("my-blogs");
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (e) => {
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
  };

  return (
    <div className="mt-10 w-3/4 flex flex-col gap-10">
      <div>
        <h2 className="mb-2">Title</h2>
        <Input
          className="border border-black"
          onChange={(e) => setTitle(e.target.value)}
        />
        <h2 className="mb-2">Add cover image</h2>
        <Input type="file" onChange={handleFileChange} />
      </div>
      <Editor
        apiKey="xdpdl88dpvddewkbah9uin6yzndrpugmhg8dpy2javcw86yl"
        init={{
          
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough emoveformat",
          tinycomments_mode: "embedded",
          tinycomments_author: "Author name",
          mergetags_list: [
            { value: "First.Name", title: "First Name" },
            { value: "Email", title: "Email" },
          ],
          ai_request: (request, respondWith) =>
            respondWith.string(() =>
              Promise.reject("See docs to implement AI Assistant")
            ),
        }}
        initialValue="Write your blog here"
        onEditorChange={(content) => setContent(content)}
      />
      <Button onClick={handleSubmit} disabled={loading}>Submit</Button>
    </div>
  );
}
