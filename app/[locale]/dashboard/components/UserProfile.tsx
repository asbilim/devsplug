"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateUserProfile } from "@/app/services/api";
import { toast } from "sonner";
import { Pencil, Check, X, Upload, Loader2, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import dynamic from "next/dynamic";
import { Link } from "@/src/i18n/routing";

// Dynamically import the correct markdown editor
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-[200px] w-full border rounded-md bg-muted/50"></div>
    ),
  }
);

// Extend the session user type to include our custom properties
interface ExtendedUser {
  id?: string;
  username?: string;
  email?: string | null;
  image?: string | null;
  title?: string;
  score?: number;
  bio?: string;
  followers_count?: number;
  following_count?: number;
  motivation?: string;
  profile?: string;
}

export default function UserProfile() {
  const t = useTranslations("Dashboard");
  const { data: session, update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = session?.user as ExtendedUser;

  // Get bio from either motivation or bio field
  const userBio = user?.motivation || user?.bio || "";

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    title: user?.title || "",
    bio: userBio,
  });

  // Store the File object or null
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  // Store the preview URL for the avatar
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    user?.image || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update form data and preview when session changes or editing stops
  useEffect(() => {
    if (user) {
      const currentBio = user.motivation || user.bio || "";
      // Only reset form data if NOT currently editing
      // This prevents losing changes if session updates while editing
      if (!isEditing) {
        setFormData({
          username: user.username || "",
          email: user.email || "",
          title: user.title || "",
          bio: currentBio,
        });
        // Update preview based on session user image when not editing
        setProfileImagePreview(user.image || null);
        setProfileImageFile(null); // Clear any staged file if editing is cancelled
      }
    }
    // Depend on user object and isEditing state
  }, [user, isEditing]);

  if (!session?.user) {
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBioChange = (value?: string) => {
    setFormData((prev) => ({ ...prev, bio: value || "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImageFile(file);
        setProfileImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true); // Set loading state
      console.log("Submitting profile update:", formData, profileImageFile);

      // Prepare data object - pass the File object if it exists
      const updateData: Record<string, any> = {
        ...formData,
        profile_file: profileImageFile, // Pass the actual File object
      };

      const updatedProfile = await updateUserProfile(updateData);

      if (updatedProfile) {
        console.log("Profile updated successfully:", updatedProfile);

        // Construct the new user object for the session update
        const newUserSessionData = {
          ...session?.user, // Start with existing session user data
          // Explicitly override with updated fields from the API response
          title: updatedProfile.title,
          // Map motivation back to bio for consistency if needed by other parts of the app
          bio: updatedProfile.motivation || updatedProfile.bio,
          motivation: updatedProfile.motivation, // Keep motivation if present
          // Use the 'profile' key from backend response for image
          // Fallback to existing image if 'profile' isn't in the response
          image: updatedProfile.profile || session?.user?.image,
          profile: updatedProfile.profile, // Also store the direct profile field if needed
        };

        // Update the session with the carefully constructed user data
        await update({
          ...session,
          user: newUserSessionData,
        });

        toast.success(t("profileUpdated"));

        // Reload the page to ensure header and other components refresh with new session data
        // window.location.reload(); // Removed as per user request for modal approach

        // Note: Code below this might not execute due to reload, but kept for clarity
        setIsEditing(false);
        setProfileImageFile(null); // Clear the file state
      } else {
        console.error("Profile update failed: API returned null");
        toast.error(t("profileUpdateError"));
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(t("profileUpdateError"));
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      title: user?.title || "",
      bio: userBio,
    });
    // Reset image states on cancel
    setProfileImageFile(null);
    setProfileImagePreview(user?.image || null);
  };

  const getInitials = (name: string = "") => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="flex-1 overflow-hidden">
      <CardHeader className="relative bg-gradient-to-r from-primary/10 to-secondary/10 pb-0">
        <div className="absolute right-4 top-4 z-10">
          {isEditing ? (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 rounded-full p-0"
                disabled={isSubmitting} // Disable during submit
                onClick={handleCancel}>
                <X className="h-4 w-4" />
                <span className="sr-only">{t("cancel")}</span>
              </Button>
              <Button
                size="sm"
                className="h-8 w-8 rounded-full p-0"
                disabled={isSubmitting} // Disable during submit
                onClick={handleSubmit}>
                {/* Show loader when submitting */}
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                <span className="sr-only">{t("save")}</span>
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 flex items-center rounded-md px-2 text-xs"
                onClick={() => window.open(`/u/${user?.username}`, "_blank")}>
                <ExternalLink className="mr-1 h-3 w-3" />
                {t("viewPublicProfile")}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 rounded-full p-0"
                onClick={() => setIsEditing(true)}>
                <Pencil className="h-4 w-4" />
                <span className="sr-only">{t("editProfile")}</span>
              </Button>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center pb-6">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage
                // Use profileImagePreview if editing and it exists.
                // Otherwise, use user.profile (from backend) or fallback to user.image (from session).
                src={
                  isEditing && profileImagePreview
                    ? profileImagePreview
                    : user?.profile || user?.image || undefined
                }
                alt={user?.username || ""}
                className="object-cover"
              />
              <AvatarFallback className="text-xl">
                {getInitials(user?.username || "")}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button
                size="sm"
                variant="secondary"
                className="absolute -bottom-2 right-0 h-8 w-8 rounded-full p-0"
                onClick={triggerFileInput}
                disabled={isSubmitting} // Disable during submit
              >
                <Upload className="h-4 w-4" />
                <span className="sr-only">{t("uploadPhoto")}</span>
              </Button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              aria-label={t("uploadPhoto")}
            />
          </div>
          {isEditing ? (
            <Input
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="mb-1 max-w-[200px] text-center text-xl font-semibold"
            />
          ) : (
            <h2 className="text-xl font-semibold">{user.username}</h2>
          )}
          {isEditing ? (
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="max-w-[200px] text-center text-sm text-muted-foreground"
              placeholder={t("defaultTitle")}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              {user.title || t("defaultTitle")}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <div className="mb-1 text-sm font-medium text-muted-foreground">
              {t("email")}
            </div>
            <div className="text-sm">{user.email}</div>
          </div>
          <div>
            <div className="mb-1 text-sm font-medium text-muted-foreground">
              {t("score")}
            </div>
            <div className="text-sm">{user.score || 0}</div>
          </div>
          <div>
            <div className="mb-1 text-sm font-medium text-muted-foreground">
              {t("bio")}
            </div>
            {isEditing ? (
              <div data-color-mode="light" className="w-full">
                <MDEditor
                  value={formData.bio}
                  onChange={handleBioChange}
                  preview="edit"
                  height={200}
                  className="w-full"
                  textareaProps={{ disabled: isSubmitting }}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("bioMarkdownSupport")}
                </p>
              </div>
            ) : (
              // Restore Markdown rendering here, use formData.bio for display consistency
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {formData.bio ? (
                  <ReactMarkdown>{formData.bio}</ReactMarkdown>
                ) : (
                  <p className="text-sm italic text-muted-foreground">
                    {t("noBio")}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
