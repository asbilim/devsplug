"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CommentInput from "./comment";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowBigRight,
  ChevronDown,
  ChevronUp,
  Loader2,
  LoaderCircle,
  LoaderCircleIcon,
  MessageSquare,
} from "lucide-react";
import React from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { getTitleAttribute } from "@/data/name-icons";

export default function Comments({ comments, slug }) {
  const [datas, setDatas] = useState([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setDatas(comments.slice(0, 1));
  }, [comments]);

  return (
    <div className="flex flex-col gap-8 mb-16 w-full items-center">
      <CommentInput
        slug={slug}
        parent={null}
        update={setDatas}
        comments={comments}
      />
      <div className="flex comment-section md:max-w-6xl  overflow-x-hidden w-full m-4 py-4 flex-col">
        {datas?.map((comment, index) => {
          const isLast = index === datas.length - 1;
          return (
            <dic key={comment.id} className="w-full ">
              <SingleComment
                comment={comment}
                isChild={false}
                created_at={comment.created_at}
                slug={slug}
                parent={comment?.id}
                comments={comments}
                update={setDatas}
              />
              {comment.replies &&
                comment.replies.map((reply, replyIndex) => {
                  const isLastChild = replyIndex === comment.replies.length - 1;
                  return (
                    <SingleComment
                      key={reply.id}
                      comment={reply}
                      isChild={true}
                      isLastChild={isLastChild}
                      created_at={reply.created_at}
                      parent={comment?.id}
                      slug={slug}
                      comments={comments}
                    />
                  );
                })}
            </dic>
          );
        })}
      </div>
      <Button
        onClick={() => {
          setDatas(comments);
          setDisabled(true);
        }}
        disabled={disabled}>
        Load more comments <ArrowBigRight className="mx-4" />
      </Button>
    </div>
  );
}

export const SingleComment = ({
  comment,
  isChild = false,
  isLastChild = false,
  created_at,
  slug,
  parent,
  comments,
  update,
}) => {
  const [isReplying, setReplying] = useState(false);

  return (
    <div
      className="flex flex-col w-full solution-comments"
      id="solution-comments">
      <div className={`single-comment flex py-2 `}>
        <div className="user-infos flex gap-1 items-center ">
          <div className="flex gap-2 w-full items-start">
            <div className="user-infos flex gap-1 items-center flex-col">
              <Avatar>
                <AvatarImage
                  src={
                    comment.user.profile ||
                    "https://i.pinimg.com/564x/13/df/f6/13dff65f79f3134edfc8d8e38e350ca8.jpg"
                  }
                  alt={comment.user.username}
                />
                <AvatarFallback>{comment.user.username[0]}</AvatarFallback>
              </Avatar>
              {!isChild && (
                <div className="flex min-h-12 my-2 w-[0.10rem] bg-muted"></div>
              )}
            </div>
            <div className="flex flex-col items-center justify-center h-auto gap-2 overflow-auto">
              <div className="flex items-start justify-start w-full gap-3">
                <h3
                  className="text-xs font-semibold"
                  style={{ color: getTitleAttribute(comment?.user?.title, 0) }}>
                  {comment?.user?.username}
                </h3>
                <h4 className="text-xs  font-medium">
                  {formatDistanceToNow(
                    parseISO(created_at || "2024-04-20 23:23:33.374047+00:00"),
                    {
                      addSuffix: true,
                    }
                  )}
                </h4>
              </div>
              <div className="prose overflow-auto">
                <pre className="text-sm h-auto text-wrap no-scrollbar overflow-auto">
                  {comment?.content}
                </pre>
              </div>
              <div className="flex justify-start w-full ">
                <Button
                  variant="link"
                  className="mx-0"
                  onClick={() => setReplying(!isReplying)}>
                  <MessageSquare size={20} />{" "}
                  {isReplying ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </div>
              {isReplying && (
                <div className="flex justify-start w-full">
                  <CommentInput
                    comments={comments}
                    update={update}
                    slug={slug}
                    parent={parent}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {comment.replies && (
        <div className="">
          {comment.replies.map((reply) => (
            <SingleComment
              comments={comments}
              key={reply.id}
              comment={reply}
              isChild={false}
              update={update}
            />
          ))}
        </div>
      )}
    </div>
  );
};
