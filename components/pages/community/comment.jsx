"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import ActionButton from "@/components/buttons/action-button";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSession, signIn } from "next-auth/react";
import { addComment, addProblemRating } from "@/data/get-problems";
export default function CommentInput({
  parent = null,
  slug = "",
  update,
  comments,
}) {
  const [error, setError] = useState(true);
  const { data: session } = useSession();
  const [isLoading, setLoading] = useState(false);

  const onsubmit = async (data) => {
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

    try {
      const result = await addComment(session?.accessToken, slug, {
        content: data.content,
        parent: parent,
      });

      update([result, ...comments]);

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
      console.log(error);
      toast("An error occured , it is not your fault", {
        description: error.message,
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ mode: "onTouched" });

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "content") {
        setError(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div className="flex flex-col max-w-xs md:max-w-6xl border w-full  p-4 md:m-4 gap-4">
      <div className="flex gap-1">
        <div className="user-infos flex gap-1 items-center ">
          <Avatar>
            <AvatarImage
              src={
                "https://i.pinimg.com/564x/13/df/f6/13dff65f79f3134edfc8d8e38e350ca8.jpg"
              }
              alt={"@username"}
            />
            <AvatarFallback>Joel</AvatarFallback>
          </Avatar>
        </div>
        <Textarea
          className="border-0 focus:border-b-4 focus:border-b-[#8482ee] outline-none focus-visible:ring-0 no-scrollbar  !p-0 flex leading-none !h-auto !min-h-12 "
          {...register("content", { required: true })}
        />
      </div>
      {!(errors.content || error) && (
        <form
          className="flex justify-end w-full"
          onSubmit={handleSubmit(onsubmit)}>
          <ActionButton
            isLoading={isLoading}
            variant=""
            disabled={errors.content || error}>
            Comment
          </ActionButton>
        </form>
      )}
    </div>
  );
}
