import {
  addToWatchList,
  isInWatchList,
  removeFromWatchList,
} from "@/lib/localstorage";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";

export const BookmarkButton = ({ coinId }: { coinId: string }) => {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(isInWatchList(coinId));
  }, [coinId]);

  const toggleBookmark = () => {
    if (bookmarked) {
      removeFromWatchList(coinId);
    } else {
      addToWatchList(coinId);
    }
    setBookmarked(!bookmarked);
  };

  return (
    <Button
      variant="ghost"
      onClick={toggleBookmark}
      className="p-2 rounded-full"
    >
      {bookmarked ? (
        <BookmarkCheck className="w-5 h-5 text-yellow-400" />
      ) : (
        <Bookmark className="w-5 h-5 text-muted-foreground" />
      )}
    </Button>
  );
};
