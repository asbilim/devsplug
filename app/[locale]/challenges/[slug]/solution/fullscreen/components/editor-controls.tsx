import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { SUPPORTED_LANGUAGES } from "../../solution-editor";
import { Loader2, Play, Save, Minimize2, SwitchCamera } from "lucide-react";
import { useTranslations } from "next-intl";

interface EditorControlsProps {
  selectedLanguage: string;
  onLanguageChange: (value: string) => void;
  selectedChallenge: string;
  onChallengeChange: (value: string) => void;
  challenges: Array<{ id: string; slug: string; title: string }>;
  isLoadingChallenges: boolean;
  isMobile: boolean;
  editorOnLeft: boolean;
  onToggleEditorSide: () => void;
  onRunCode: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  onExit: () => void;
}

export function EditorControls({
  selectedLanguage,
  onLanguageChange,
  selectedChallenge,
  onChallengeChange,
  challenges,
  isLoadingChallenges,
  isMobile,
  editorOnLeft,
  onToggleEditorSide,
  onRunCode,
  onSubmit,
  isSubmitting,
  onExit,
}: EditorControlsProps) {
  const t = useTranslations("Challenge");

  return (
    <div className="border-b p-2 bg-background flex flex-col sm:flex-row items-start sm:items-center justify-between shrink-0 gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        <Select value={selectedLanguage} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-[140px] sm:w-[180px]">
            <SelectValue placeholder={t("selectLanguage")} />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_LANGUAGES.map((group) => (
              <SelectGroup key={group.group}>
                <SelectLabel>{t(`languageGroup.${group.group}`)}</SelectLabel>
                {group.languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {t(lang.labelKey)}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>

        {/* Challenge Selection */}
        <Select
          value={selectedChallenge}
          onValueChange={onChallengeChange}
          disabled={isLoadingChallenges}>
          <SelectTrigger className="w-[140px] sm:w-[180px]">
            <SelectValue placeholder={t("selectChallenge")} />
          </SelectTrigger>
          <SelectContent>
            {challenges.map((challenge) => (
              <SelectItem key={challenge.id} value={challenge.slug}>
                {challenge.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {!isMobile && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleEditorSide}
            aria-label={t("switchEditorSide")}>
            <SwitchCamera className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
        <Button
          variant="secondary"
          onClick={onRunCode}
          size="sm"
          className="flex-1 sm:flex-none">
          <Play className="h-4 w-4 mr-2" />
          {t("runCode")}
        </Button>
        <Button
          variant="default"
          onClick={onSubmit}
          disabled={isSubmitting}
          size="sm"
          className="flex-1 sm:flex-none">
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {t("submitSolution")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onExit}
          className="flex-1 sm:flex-none">
          <Minimize2 className="h-4 w-4 mr-2" />
          {t("exitFullscreen")}
        </Button>
      </div>
    </div>
  );
}
