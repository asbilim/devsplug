"use client";

import { useState, useRef } from "react";
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
import { Pencil, Check, X, Upload } from "lucide-react";

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
}

export default function UserProfile() {
  const t = useTranslations("Dashboard");
  const { data: session, update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const user = session?.user as ExtendedUser;

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    title: user?.title || "",
    bio: user?.bio || "",
  });
  const [profileImage, setProfileImage] = useState<string | null>(
    user?.image || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!session?.user) {
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      // In a real implementation, you would upload the image to a server
      // and get back a URL to store in the profile
      const updatedProfile = await updateUserProfile({
        ...formData,
        profile_picture: profileImage || undefined,
      });

      if (updatedProfile) {
        // Update the session with new user data
        await update({
          ...session,
          user: {
            ...session.user,
            ...updatedProfile,
          },
        });
        toast.success(t("profileUpdated"));
        setIsEditing(false);
      }
    } catch (error) {
      toast.error(t("profileUpdateError"));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      title: user?.title || "",
      bio: user?.bio || "",
    });
    setProfileImage(user?.image || null);
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
                onClick={handleCancel}>
                <X className="h-4 w-4" />
                <span className="sr-only">{t("cancel")}</span>
              </Button>
              <Button
                size="sm"
                className="h-8 w-8 rounded-full p-0"
                onClick={handleSubmit}>
                <Check className="h-4 w-4" />
                <span className="sr-only">{t("save")}</span>
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 rounded-full p-0"
              onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">{t("editProfile")}</span>
            </Button>
          )}
        </div>
        <div className="flex flex-col items-center pb-6">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage
                src={user?.profile || profileImage || undefined}
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
                onClick={triggerFileInput}>
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
              <Textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="min-h-[100px] resize-none"
                placeholder={t("bioPlaceholder")}
              />
            ) : (
              <p className="text-sm">{user.bio || t("noBio")}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
