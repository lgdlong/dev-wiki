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
import {
  PostVideoFormValues,
  postVideoSchema,
} from "@/validations/post-video-schema";

// Regex cho nhiều dạng URL Youtube
const YOUTUBE_ID_REGEX =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

function extractYouTubeId(url: string) {
  const match = url.match(YOUTUBE_ID_REGEX);
  return match ? match[1] : "";
}

export function PostVideoForm() {
  const [youtubeId, setYoutubeId] = useState("");

  const form = useForm<PostVideoFormValues>({
    resolver: zodResolver(postVideoSchema),
    defaultValues: {
      youtubeUrl: "",
    },
  });

  async function onSubmit(data: PostVideoFormValues) {
    const youtubeId = extractYouTubeId(data.youtubeUrl);
    if (!youtubeId) {
      toast("Không tìm thấy Youtube ID từ URL.", {
        description: "Vui lòng kiểm tra lại đường dẫn.",
        // Sonner tự nhận diện lỗi = màu đỏ
      });
      return;
    }
    try {
      const video = await createVideo({ youtubeId });
      console.log("[DEBUG] Video created:", video);
      toast("Video đã được thêm thành công!", {
        description: (
          <div>
            <div>
              <b>Tên video:</b> {video.title || "(Không có tiêu đề)"}
            </div>
            <div>
              <b>YouTube ID:</b> {video.youtubeId}
            </div>
          </div>
        )
      });
      // Optionally: form.reset();
    } catch (err: any) {
      toast("Lỗi khi thêm video", {
        description: err.message || "Đã xảy ra lỗi.",
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
              <FormDescription>Nhập link video Youtube bất kỳ.</FormDescription>
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
            Youtube video ID sẽ tự động hiển thị ở đây sau khi bạn nhập URL.
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
