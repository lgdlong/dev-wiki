"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createVideo } from "@/utils/api/video";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  PostVideoFormValues,
  postVideoSchema,
} from "@/validations/post-video-schema";
import { YOUTUBE_URL_REGEX, YOUTUBE_ID_REGEX } from "../constant";

function isValidYoutubeUrl(url: string) {
  return YOUTUBE_URL_REGEX.test(url);
}

function extractYouTubeId(url: string) {
  const match = url.match(YOUTUBE_ID_REGEX);
  return match ? match[1] : "";
}

export function PostVideoForm() {
  const [youtubeId, setYoutubeId] = useState("");
  const { data: currentUser } = useCurrentUser();

  const form = useForm<PostVideoFormValues>({
    resolver: zodResolver(postVideoSchema),
    defaultValues: {
      youtubeUrl: "",
    },
  });

  async function onSubmit(formValues: PostVideoFormValues) {
    // Check validity of YouTube URL
    if (!isValidYoutubeUrl(formValues.youtubeUrl)) {
      toast("Invalid URL", {
        description: "Please enter a valid YouTube link.",
      });
      return;
    }

    // Extract YouTube ID from URL
    const extractedYoutubeId = extractYouTubeId(formValues.youtubeUrl);
    if (!extractedYoutubeId) {
      toast("Could not extract YouTube ID from URL.", {
        description: "Please check the link again.",
      });
      return;
    }

    try {
      // Call API to create videos
      console.log("[DEBUG] Uploader:", currentUser);
      const uploaderId = currentUser?.id || 0;
      console.log("[DEBUG] ID: ", uploaderId);
      const video = await createVideo({
        youtubeId: extractedYoutubeId,
        uploaderId,
      });

      // Show success toast with videos details
      toast("Video added successfully!", {
        description: (
          <div>
            <div>
              <b>Title:</b> {video.title || "(No title)"}
            </div>
            <div>
              <b>Uploader ID:</b> {video.uploaderId ?? "(Unknown)"}
            </div>
            <div>
              <b>Channel Title:</b> {video.channelTitle || "(Unknown)"}
            </div>
            <div>
              <b>Duration:</b> {video.duration || "(Unknown duration)"}
            </div>
            <div>
              <b>YouTube ID:</b> {video.youtubeId}
            </div>
          </div>
        ),
      });
      // Optionally: form.reset();
    } catch (error: any) {
      toast("Error adding videos", {
        description: error.message || "An error occurred.",
      });
    }
  }

  // Khi người dùng nhập URL, extract Youtube ID luôn
  function handleUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    form.setValue("youtubeUrl", e.target.value);
    const id = extractYouTubeId(e.target.value);
    setYoutubeId(id);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="youtubeUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Youtube URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="Paste Youtube URL here"
                  {...field}
                  onChange={handleUrlChange}
                />
              </FormControl>
              <FormDescription>Enter any Youtube video link.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Input chỉ hiển thị, không nhập */}
        <FormItem>
          <FormLabel>Youtube ID</FormLabel>
          <FormControl>
            <Input
              value={extractYouTubeId(form.watch("youtubeUrl"))}
              readOnly
              tabIndex={-1}
            />
          </FormControl>
          <FormDescription>
            The YouTube video ID will automatically appear here after you enter
            the URL.
          </FormDescription>
        </FormItem>
        {/* Button submit form */}
        <Button
          type="submit"
          className="cursor-pointer"
          disabled={!extractYouTubeId(form.watch("youtubeUrl"))}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
