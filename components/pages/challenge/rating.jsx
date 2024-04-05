"use client";
import { useState } from "react";
import { Star, StarHalf, CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ActionButton from "@/components/buttons/action-button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow, parseISO } from "date-fns";
import { MessageSquare, MessageSquarePlus } from "lucide-react";
import { addProblemRating } from "@/data/get-problems";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
export default function RateChallenge({ initialRatings, slug }) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [ratings, setRatings] = useState(initialRatings);

  const addRatingToState = (newRating) => {
    setRatings([newRating, ...ratings]);
  };

  return (
    <div className="flex w-full max-w-6xl  flex-col gap-12">
      <div className="flex items-center justify-between w-full">
        <h2 className="font-medium hidden md:block">
          You like this challenge? Rate it
        </h2>
        <SmartRating rating={rating} setRating={setRating} />
      </div>
      <div className="comment-section">
        <Button variant="">
          Add a comment <CirclePlus className="mx-2" />{" "}
        </Button>
      </div>
      {session?.accessToken && (
        <CommentAdd
          parent={null}
          slug={slug}
          ratings={ratings}
          session={session}
          score={rating}
          updateRating={addRatingToState}
        />
      )}

      <CommentSections
        updateRating={addRatingToState}
        ratings={ratings}
        session={session}
        slug={slug}
      />
    </div>
  );
}

const SmartRating = ({ rating, setRating }) => {
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

function CommentAdd({
  parent = null,
  slug = "",
  rating = [],
  session = {},
  score = null,
  updateRating,
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const token = session?.accessToken;

  const scoreToSend = score > 0 ? score : null;

  const onsubmit = async () => {
    if (!session?.accessToken) {
      toast("You must be login to add a comment", {
        description: "Please login to your account to add a comment ",

        action: {
          label: "Go to Login",
          onClick: () => {
            signIn("credentials");
          },
        },
      });

      return false;
    }

    setLoading(true);
    try {
      const result = await addProblemRating(token, slug, {
        message: message,
        parent: parent,
        score: scoreToSend,
      });

      if (result.id) {
        toast("Your message was sent successfully", {
          description: "your message was saved ",

          action: {
            label: "ok thanks",
            onClick: () => {
              alert("thank you too");
            },
          },
        });
        updateRating(result);
      } else {
        toast("An error occured , it is not your fault", {
          description: "We are actually unable to post your message",

          action: {
            label: "retry",
            onClick: () => {
              onsubmit();
            },
          },
        });
      }
    } catch (error) {
      toast("An error occured , it is not your fault", {
        description: "We are actually unable to post your message",

        action: {
          label: "retry",
          onClick: () => {
            onsubmit();
          },
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shadow-lg h-auto">
      <div className="grid w-full gap-2">
        <Textarea
          placeholder="Type your message here."
          onChange={(value) => {
            setMessage(value.target.value);
          }}
        />
        <ActionButton
          isLoading={loading}
          variant=""
          disabled={message.length < 10}
          onclick={onsubmit}
        >
          Send message
        </ActionButton>
      </div>
    </div>
  );
}

const CommentChild = ({
  message = "",
  id = 1,
  replies = [],
  user = { username: "", profile: "" },
  created_at = "",
  depth = 0,
  session = {},
  slug = "",
  ratings = {},
  updateRating,
  replying = false,
  parentName = "",
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [addReply, setAddReply] = useState(false);
  const marginLeft = depth * 16;

  const handleShowRepliesClick = () => {
    setShowReplies(!showReplies);
  };

  const handleAddReplyClick = () => {
    setAddReply(!addReply);
  };

  return (
    <div
      style={{ marginLeft: `${marginLeft}px` }}
      className="flex flex-col gap-4"
    >
      <div className="flex items-start space-x-4">
        <Avatar>
          <AvatarImage
            src={user.profile || "https://github.com/child-avatar.png"}
            alt="User Profile"
          />
          <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1 ">
          <h3 className="text-lg font-medium tracking-tight">
            {user.username}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Posted{" "}
            {formatDistanceToNow(parseISO(created_at), { addSuffix: true })}
          </p>
          <p>
            {replying && (
              <span className="link underline">@{parentName + " "}</span>
            )}
            {message}
          </p>
          <div className="flex gap-4">
            {replies.length > 0 && (
              <div
                className="flex items-center text-gray-500 cursor-pointer"
                onClick={handleShowRepliesClick}
              >
                <MessageSquare
                  className={`transition ${showReplies ? "rotate-180" : ""}`}
                  size={16}
                />
                <span className="ml-1 text-sm">View replies</span>
              </div>
            )}

            <div
              className="flex items-center text-gray-500 cursor-pointer"
              onClick={handleAddReplyClick}
            >
              <MessageSquarePlus
                className={`transition ${addReply ? "rotate-180" : ""}`}
                size={16}
              />
              <span className="ml-1 text-sm">reply</span>
            </div>
          </div>
        </div>
      </div>
      {addReply && (
        <CommentAdd
          slug={slug}
          session={session}
          parent={id}
          rating={ratings}
          updateRating={updateRating}
        />
      )}
      {showReplies &&
        replies.map((reply) => (
          <CommentChild
            slug={slug}
            session={session}
            key={reply.id}
            {...reply}
            depth={depth + 1}
            ratings={ratings}
            updateRating={updateRating}
            replying={true}
            parentName={user.username}
          />
        ))}
    </div>
  );
};

const CommentSections = ({ ratings, session, slug, updateRating }) => {
  return (
    <div className="flex w-full flex-col gap-4">
      {ratings.map((item, index) => {
        return (
          <CommentChild
            session={session}
            slug={slug}
            key={index + ""}
            {...item}
            depth={0}
            updateRating={updateRating}
          />
        );
      })}
    </div>
  );
};
