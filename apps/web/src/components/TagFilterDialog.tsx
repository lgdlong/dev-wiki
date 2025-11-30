import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface Tag {
  id: number;
  name: string;
}

interface TagFilterDialogProps {
  tags: Tag[];
  isLoading: boolean;
  selectedTag?: string;
  onSelect: (tagName: string) => void;
  buttonLabel?: string;
}

export default function TagFilterDialog({
  tags,
  isLoading,
  selectedTag = "",
  onSelect,
  buttonLabel = "Lọc theo Tag",
}: TagFilterDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-9 gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          {buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl p-0 top-1/3">
        <div className="flex justify-end p-2"></div>
        <div className="p-4 pt-2 flex flex-col gap-2">
          <Input
            placeholder="Tìm tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2"
          />
          <div className="overflow-y-auto max-h-100">
            {isLoading ? (
              <div className="text-center text-muted-foreground py-8">
                Loading tags...
              </div>
            ) : tags.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No tags found.
              </div>
            ) : (
              <ul className="space-y-1">
                {[...tags]
                  .filter((tag) =>
                    tag.name.toLowerCase().includes(search.toLowerCase()),
                  )
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((tag) => (
                    <li key={tag.id}>
                      <button
                        className={`block px-4 py-2 rounded w-full text-left hover:bg-zinc-100 transition ${selectedTag === tag.name ? "bg-zinc-200 font-bold" : ""}`}
                        onClick={() => {
                          onSelect(tag.name);
                          setOpen(false);
                        }}
                      >
                        {tag.name}
                      </button>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
