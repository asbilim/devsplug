"use client";
import { useState } from "react";
import { Star, StarHalf, CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ActionButton from "@/components/buttons/action-button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
export default function RateChallenge() {
  return (
    <div className="flex w-full max-w-6xl  flex-col gap-12">
      <div className="flex items-center justify-between w-full">
        <h2 className="font-medium">You like this challenge? Rate it</h2>
        <SmartRating />
      </div>
      <div className="comment-section">
        <Button variant="">
          Add a comment <CirclePlus className="mx-2" />{" "}
        </Button>
      </div>
      <CommentAdd />
      <CommentSections />
    </div>
  );
}

const SmartRating = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(undefined);

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleStarMouseOver = (value) => {
    setHoverRating(value);
  };

  const handleStarMouseLeave = () => {
    setHoverRating(undefined);
  };

  const calculateStarValue = (index, event) => {
    const star = event.currentTarget;
    const { left } = star.getBoundingClientRect();
    const starWidth = star.offsetWidth;
    const hoverPosition = event.pageX - left;
    return index + (hoverPosition < starWidth / 2 ? 0.5 : 1);
  };

  const renderStarIcon = (index) => {
    const effectiveRating = hoverRating || rating;
    let isFullStar = index <= Math.floor(effectiveRating);
    let isHalfStar =
      index === Math.ceil(effectiveRating) && effectiveRating % 1 >= 0.5;

    return (
      <div
        style={{
          display: "inline-flex",
          position: "relative",
          fontSize: "24px",
        }}
      >
        <Star
          style={{ color: isFullStar ? "var(--ternary)" : "var(--primary)" }}
        />
        {isHalfStar && (
          <StarHalf style={{ color: "var(--ternary)", marginLeft: "-1em" }} />
        )}
      </div>
    );
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        onMouseMove={(e) => handleStarMouseOver(calculateStarValue(index, e))}
        onMouseLeave={handleStarMouseLeave}
        onClick={(e) => handleStarClick(calculateStarValue(index, e))}
        style={{
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        {renderStarIcon(index + 1)}
      </span>
    ));
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {renderStars()}
      <p style={{ marginLeft: "10px" }}>Rating: {rating.toFixed(1)}</p>
    </div>
  );
};

function CommentAdd() {
  return (
    <div className="shadow-lg h-auto">
      <div className="grid w-full gap-2">
        <Textarea placeholder="Type your message here." />
        <ActionButton variant="">Send message</ActionButton>
      </div>
    </div>
  );
}

const CommentChild = ({ children }) => (
  <div className="ml-12">
    <div className="flex items-start space-x-4">
      <Avatar>
        <AvatarImage
          src="https://github.com/child-avatar.png"
          alt="Child Comment"
        />
        <AvatarFallback>CA</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">{children}</div>
    </div>
  </div>
);

const CommentSections = () => {
  return (
    <div className="flex w-full flex-col gap-4">
      <SingleComment />
      <SingleComment />
    </div>
  );
};

const SingleComment = () => {
  return (
    <>
      <div className="flex items-start space-x-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="User Profile" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <h3 className="text-lg font-medium tracking-tight">Alex Johnson</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Posted on August 25, 2023
          </p>
          <p>
            {"I'm"} not sure what the moral of this story is, but I do know that
            it made me laugh! And in these troubled times, a good laugh is hard
            to come by. So, thank you, Jokester, whoever you are, for
            brightening my day with your jokes!
          </p>
          <Button variant="link" className="underline">
            Reply
          </Button>
          <CommentChild>
            <h3 className="text-lg font-medium tracking-tight">
              Reply by Jane Doe
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Posted on August 26, 2023
            </p>
            <p>
              {"It's"} always a pleasure to share a good laugh. Glad you enjoyed
              it!
            </p>
          </CommentChild>
          <CommentChild>
            <h3 className="text-lg font-medium tracking-tight">
              Reply by Jane Doe
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Posted on August 26, 2023
            </p>
            <p>
              {"It's"} always a pleasure to share a good laugh. Glad you enjoyed
              it!
            </p>
          </CommentChild>
        </div>
      </div>
      <hr />
    </>
  );
};
