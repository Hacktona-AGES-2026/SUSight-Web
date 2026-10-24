import { createCn } from "cn/config";

// Os tamanhos de texto do Figma (globals.css) precisam ser conhecidos para o
// merge não os confundir com cores (`text-note` vs `text-brand`).
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "title-lg",
            "title-page",
            "title-2",
            "title-3",
            "body",
            "subtitle",
            "note",
            "caption",
          ],
        },
      ],
    },
  },
});
