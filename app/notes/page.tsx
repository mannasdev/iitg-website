"use client";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { lineSpinner } from "ldrs"
import { useRouter } from "next/navigation";

interface Note {
  id: string;
  title: string;
  content: string;

}


export default function Component() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);

  const fetchAllNotes = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/get-all-notes");
      console.log(res);
      setNotes(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNotes();
  }, [session]);

  if (status === "loading") {
    return (
      <div>
        <Navbar />
        <h1 className="text-6xl mt-36">Loading...
        </h1>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div>
        <Navbar />
        <h1 className="text-6xl m-36">Log in to view this page</h1>
      </div>
    );
  }



  return (
    <main>
      <Navbar />
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-12 mt-10 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl flex flex-col gap-3 font-bold text-gray-900 dark:text-gray-100">
              Notes
              {/* <Button onClick={() => router.push("/create-note")}>
                Create new note
              </Button> */}
            </h1>

            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                placeholder="Search notes"
                type="text"
              />
            </div>
          </div>
          {loading ? (
            <div className="text-gray-900 dark:text-gray-100 text-xl font-semibold">
              just a sec..
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {notes.map((note) => (
                <div key={note.title} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <img
                    alt="Blog Post Image"
                    className="w-full h-48 object-cover"
                    height={225}
                    src="/placeholder.png"
                    style={{
                      aspectRatio: "400/225",
                      objectFit: "cover",
                    }}
                    width={400}
                  />
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {note.title}
                    </h2>


                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        "today "
                      </span>
                      <Link
                        className="text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-500 font-medium"
                        href={`/note/${note.id}`}
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
