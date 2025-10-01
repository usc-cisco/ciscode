"use client";

import { useState, useCallback, useEffect } from "react";
import { useTheme } from "next-themes";
import { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { oneDark } from "@codemirror/theme-one-dark";
import { cpp } from "@codemirror/lang-cpp";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { solarizedLight, solarizedDark } from "@uiw/codemirror-theme-solarized";
import { materialDark, materialLight } from "@uiw/codemirror-theme-material";
import { monokai } from "@uiw/codemirror-theme-monokai";

export interface EditorSettings {
  font_size: number;
  line_height: number;
  theme: string;
  font_family: string;
  show_line_nums: boolean;
  word_wrap: boolean;
  tab_size: number;
}

export const available_themes = [
  {
    value: "light",
    label: "Default Light",
    category: "light",
    colors: { bg: "#ffffff", fg: "#1f2937", accent: "#3b82f6" },
  },
  {
    value: "dark",
    label: "Default Dark",
    category: "dark",
    colors: { bg: "#1e1e1e", fg: "#d4d4d4", accent: "#007acc" },
  },
  {
    value: "github-light",
    label: "GitHub Light",
    category: "light",
    colors: { bg: "#ffffff", fg: "#24292e", accent: "#0366d6" },
  },
  {
    value: "github-dark",
    label: "GitHub Dark",
    category: "dark",
    colors: { bg: "#0d1117", fg: "#c9d1d9", accent: "#58a6ff" },
  },
  {
    value: "vscode-dark",
    label: "VSCode Dark",
    category: "dark",
    colors: { bg: "#1e1e1e", fg: "#d4d4d4", accent: "#007acc" },
  },
  {
    value: "one-dark",
    label: "One Dark",
    category: "dark",
    colors: { bg: "#282c34", fg: "#abb2bf", accent: "#61afef" },
  },
  {
    value: "dracula",
    label: "Dracula",
    category: "dark",
    colors: { bg: "#282a36", fg: "#f8f8f2", accent: "#bd93f9" },
  },
  {
    value: "tokyo-night",
    label: "Tokyo Night",
    category: "dark",
    colors: { bg: "#1a1b26", fg: "#a9b1d6", accent: "#7aa2f7" },
  },
  {
    value: "solarized-light",
    label: "Solarized Light",
    category: "light",
    colors: { bg: "#fdf6e3", fg: "#657b83", accent: "#268bd2" },
  },
  {
    value: "solarized-dark",
    label: "Solarized Dark",
    category: "dark",
    colors: { bg: "#002b36", fg: "#839496", accent: "#268bd2" },
  },
  {
    value: "material-light",
    label: "Material Light",
    category: "light",
    colors: { bg: "#fafafa", fg: "#263238", accent: "#039be5" },
  },
  {
    value: "material-dark",
    label: "Material Dark",
    category: "dark",
    colors: { bg: "#263238", fg: "#eeffff", accent: "#82aaff" },
  },
  {
    value: "monokai",
    label: "Monokai",
    category: "dark",
    colors: { bg: "#272822", fg: "#f8f8f2", accent: "#a6e22e" },
  },
] as const;

export const available_fonts = [
  {
    value: "jetbrains-mono",
    label: "JetBrains Mono",
    family:
      '"JetBrains Mono", "SF Mono", "Monaco", "Cascadia Code", "Roboto Mono", monospace',
  },
  {
    value: "fira-code",
    label: "Fira Code",
    family:
      '"Fira Code", "JetBrains Mono", "SF Mono", "Cascadia Code", monospace',
  },
  {
    value: "source-code-pro",
    label: "Source Code Pro",
    family: '"Source Code Pro", "SF Mono", "Monaco", "Consolas", monospace',
  },
  {
    value: "cascadia-code",
    label: "Cascadia Code",
    family: '"Cascadia Code", "Consolas", "SF Mono", "Monaco", monospace',
  },
  {
    value: "consolas",
    label: "Consolas",
    family: '"Consolas", "SF Mono", "Monaco", "Menlo", monospace',
  },
  {
    value: "sf-mono",
    label: "SF Mono",
    family: '"SF Mono", "Monaco", "Menlo", "Consolas", monospace',
  },
  {
    value: "monaco",
    label: "Monaco",
    family: '"Monaco", "SF Mono", "Menlo", "Consolas", monospace',
  },
  {
    value: "menlo",
    label: "Menlo",
    family: '"Menlo", "Monaco", "SF Mono", "Consolas", monospace',
  },
  {
    value: "roboto-mono",
    label: "Roboto Mono",
    family: '"Roboto Mono", "Ubuntu Mono", "Consolas", "Monaco", monospace',
  },
  {
    value: "ubuntu-mono",
    label: "Ubuntu Mono",
    family: '"Ubuntu Mono", "Roboto Mono", "Consolas", "Monaco", monospace',
  },
  {
    value: "inconsolata",
    label: "Inconsolata",
    family: '"Inconsolata", "Consolas", "Monaco", "SF Mono", monospace',
  },
  {
    value: "cascadia-mono",
    label: "Cascadia Mono",
    family:
      '"Cascadia Mono", "Cascadia Code", "Consolas", "SF Mono", monospace',
  },
  {
    value: "hack",
    label: "Hack",
    family: '"Hack", "Source Code Pro", "SF Mono", "Monaco", monospace',
  },
  {
    value: "default",
    label: "System Default",
    family:
      'ui-monospace, "SF Mono", "Monaco", "Cascadia Code", "Roboto Mono", "Consolas", "Liberation Mono", "Menlo", monospace',
  },
] as const;

const default_settings: EditorSettings = {
  font_size: 14,
  line_height: 1.6,
  theme: "light",
  font_family: "jetbrains-mono",
  show_line_nums: true,
  word_wrap: false,
  tab_size: 2,
};

export function useEditorSettings() {
  const { resolvedTheme } = useTheme();
  const [settings, set_settings] = useState<EditorSettings>(default_settings);

  // sync theme with next-themes
  useEffect(() => {
    set_settings((prev) => ({
      ...prev,
      theme: resolvedTheme === "dark" ? "dark" : "light",
    }));
  }, [resolvedTheme]);

  const get_theme_extension = useCallback(() => {
    switch (settings.theme) {
      case "github-light":
        return githubLight;
      case "github-dark":
        return githubDark;
      case "vscode-dark":
        return vscodeDark;
      case "one-dark":
        return oneDark;
      case "dracula":
        return dracula;
      case "tokyo-night":
        return tokyoNight;
      case "solarized-light":
        return solarizedLight;
      case "solarized-dark":
        return solarizedDark;
      case "material-light":
        return materialLight;
      case "material-dark":
        return materialDark;
      case "monokai":
        return monokai;
      case "dark":
        return oneDark;
      case "light":
      default:
        return undefined; // use default light theme
    }
  }, [settings.theme]);

  const update_setting = useCallback(
    <K extends keyof EditorSettings>(key: K, value: EditorSettings[K]) => {
      set_settings((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const get_extensions = useCallback((): Extension[] => {
    const selected_font = available_fonts.find(
      (f) => f.value === settings.font_family,
    );

    const extensions: Extension[] = [
      cpp(),
      EditorView.theme({
        "&": {
          fontSize: `${settings.font_size}px`,
          lineHeight: settings.line_height.toString(),
        },
        ".cm-editor": {
          height: "100%",
        },
        ".cm-scroller": {
          fontFamily:
            selected_font?.family ||
            'ui-monospace, "SF Mono", "Monaco", "Cascadia Code", "Roboto Mono", "Consolas", "Liberation Mono", "Menlo", monospace',
          fontFeatureSettings: '"liga" 1, "calt" 1, "zero" 1',
          fontVariantLigatures: "contextual",
          fontVariantNumeric: "slashed-zero",
        },
        ".cm-focused": {
          outline: "none",
        },
        ".cm-content": {
          padding: "12px",
          fontFeatureSettings: "inherit",
          fontVariantLigatures: "inherit",
        },
        ".cm-line": {
          padding: "0 4px",
        },
      }),
    ];

    const theme_ext = get_theme_extension();
    if (theme_ext) {
      extensions.push(theme_ext);
    }

    if (!settings.show_line_nums) {
      extensions.push(
        EditorView.theme({
          ".cm-gutters": { display: "none" },
        }),
      );
    }

    if (settings.word_wrap) {
      extensions.push(EditorView.lineWrapping);
    }

    extensions.push(
      EditorView.theme({
        ".cm-editor.cm-focused": {
          outline: "none",
        },
        ".cm-activeLine": {
          backgroundColor:
            available_themes.find((t) => t.value === settings.theme)
              ?.category === "dark"
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.04)",
        },
        ".cm-selectionBackground": {
          backgroundColor:
            available_themes.find((t) => t.value === settings.theme)
              ?.category === "dark"
              ? "rgba(255, 255, 255, 0.15)"
              : "rgba(0, 0, 0, 0.1)",
        },
      }),
    );

    return extensions;
  }, [settings, get_theme_extension]);

  const reset_settings = useCallback(() => {
    set_settings({
      ...default_settings,
      theme: resolvedTheme === "dark" ? "dark" : "light",
    });
  }, [resolvedTheme]);

  return {
    settings,
    update_setting,
    get_extensions,
    reset_settings,
    get_theme_extension,
  };
}
