"use client";

import React from "react";
import {
  Settings,
  Type,
  Palette,
  Hash,
  WrapText,
  RotateCcw,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import type { EditorSettings } from "@/hooks/use-editor-settings";
import { available_themes, available_fonts } from "@/hooks/use-editor-settings";

interface EditorSettingsProps {
  settings: EditorSettings;
  update_setting: <K extends keyof EditorSettings>(
    key: K,
    value: EditorSettings[K],
  ) => void;
  reset_settings: () => void;
}

const EditorSettings: React.FC<EditorSettingsProps> = ({
  settings,
  update_setting,
  reset_settings,
}) => {
  const font_sizes = [10, 12, 14, 16, 18, 20, 24];
  const line_heights = [1.2, 1.4, 1.6, 1.8, 2.0];
  const tab_sizes = [2, 4, 8];

  const light_themes = available_themes.filter((t) => t.category === "light");
  const dark_themes = available_themes.filter((t) => t.category === "dark");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative z-30 size-8 p-0 bg-background/90 backdrop-blur-sm border shadow-lg hover:bg-background hover:shadow-xl transition-all data-[state=open]:bg-background data-[state=open]:shadow-xl"
        >
          <Settings className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 p-2"
        side="left"
        align="start"
        sideOffset={12}
      >
        <div className="flex items-center justify-between mb-3 px-2">
          <div className="flex items-center gap-2">
            <Settings className="size-4 text-primary" />
            <DropdownMenuLabel className="text-sm font-semibold p-0">
              Editor Settings
            </DropdownMenuLabel>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={reset_settings}
            className="text-xs h-6 px-2 hover:bg-muted"
          >
            <RotateCcw className="size-3 mr-1" />
            Reset
          </Button>
        </div>

        <DropdownMenuSeparator />

        {/* font size section */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <Type className="size-4" />
            <span>Font Size ({settings.font_size}px)</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-32">
            {font_sizes.map((size) => (
              <DropdownMenuItem
                key={size}
                onClick={() => update_setting("font_size", size)}
                className="flex items-center justify-between"
              >
                <span>{size}px</span>
                {settings.font_size === size && (
                  <Check className="size-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* line height section */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <Hash className="size-4" />
            <span>Line Height ({settings.line_height})</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-32">
            {line_heights.map((height) => (
              <DropdownMenuItem
                key={height}
                onClick={() => update_setting("line_height", height)}
                className="flex items-center justify-between"
              >
                <span>{height}</span>
                {settings.line_height === height && (
                  <Check className="size-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* font family section */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <Type className="size-4" />
            <div className="flex items-center gap-2">
              <span
                style={{
                  fontFamily:
                    available_fonts.find(
                      (f) => f.value === settings.font_family,
                    )?.family || "monospace",
                }}
                className="text-xs px-1 py-0.5 bg-muted rounded border"
              >
                Aa
              </span>
              <span>Font</span>
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-64">
            {available_fonts.map((font) => (
              <DropdownMenuItem
                key={font.value}
                onClick={() => update_setting("font_family", font.value)}
                className="flex flex-col items-start gap-2 pr-3h-auto"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <span
                      style={{ fontFamily: font.family }}
                      className="text-xs px-2 py-1 bg-muted rounded border min-w-[40px] text-center"
                    >
                      Aa
                    </span>
                    <span className="text-sm font-medium">{font.label}</span>
                  </div>
                  {settings.font_family === font.value && (
                    <Check className="size-4 text-primary" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* theme section */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <Palette className="size-4" />
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div
                  className="w-3 h-3 rounded-sm border border-gray-300 dark:border-gray-600"
                  style={{
                    backgroundColor:
                      available_themes.find((t) => t.value === settings.theme)
                        ?.colors.bg || "#ffffff",
                  }}
                />
                <div
                  className="w-3 h-3 rounded-sm border border-gray-300 dark:border-gray-600"
                  style={{
                    backgroundColor:
                      available_themes.find((t) => t.value === settings.theme)
                        ?.colors.accent || "#3b82f6",
                  }}
                />
              </div>
              <span>Theme</span>
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-56">
            <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1">
              light themes
            </DropdownMenuLabel>
            {light_themes.map((theme) => (
              <DropdownMenuItem
                key={theme.value}
                onClick={() => update_setting("theme", theme.value)}
                className="flex items-center justify-between pl-4 pr-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div
                      className="w-3 h-3 rounded-sm border border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: theme.colors.bg }}
                    />
                    <div
                      className="w-3 h-3 rounded-sm border border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: theme.colors.accent }}
                    />
                  </div>
                  <span className="text-sm">{theme.label}</span>
                </div>
                {settings.theme === theme.value && (
                  <Check className="size-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator className="my-1" />

            <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1">
              dark themes
            </DropdownMenuLabel>
            {dark_themes.map((theme) => (
              <DropdownMenuItem
                key={theme.value}
                onClick={() => update_setting("theme", theme.value)}
                className="flex items-center justify-between pl-4 pr-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div
                      className="w-3 h-3 rounded-sm border border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: theme.colors.bg }}
                    />
                    <div
                      className="w-3 h-3 rounded-sm border border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: theme.colors.accent }}
                    />
                  </div>
                  <span className="text-sm">{theme.label}</span>
                </div>
                {settings.theme === theme.value && (
                  <Check className="size-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* tab size section */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <Hash className="size-4" />
            <span>Tab Size ({settings.tab_size} spaces)</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-32">
            {tab_sizes.map((size) => (
              <DropdownMenuItem
                key={size}
                onClick={() => update_setting("tab_size", size)}
                className="flex items-center justify-between"
              >
                <span>{size} spaces</span>
                {settings.tab_size === size && (
                  <Check className="size-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* toggles section */}
        <DropdownMenuItem
          onClick={() =>
            update_setting("show_line_nums", !settings.show_line_nums)
          }
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Hash className="size-4" />
            <span>Line Numbers</span>
          </div>
          {settings.show_line_nums && <Check className="size-4 text-primary" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => update_setting("word_wrap", !settings.word_wrap)}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <WrapText className="size-4" />
            <span>Word Wrap</span>
          </div>
          {settings.word_wrap && <Check className="size-4 text-primary" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EditorSettings;
