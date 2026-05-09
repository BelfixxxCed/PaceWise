export type EditorNode = SlateNode;

// types.ts
interface SlateText {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  [key: string]: unknown;
}

interface SlateNode {
  type?: string;
  id?: string;
  children: (SlateText | SlateNode)[];
  [key: string]: unknown;
}

type SlateData = SlateNode[];

/**
 * Recursively extracts plain text from Slate structured data
 * @param nodes - Array of Slate nodes or a single node
 * @returns Plain text string
 */
export function slateToPlainText(
  nodes: SlateData | SlateNode | SlateText,
): string {
  // Handle array of nodes
  if (Array.isArray(nodes)) {
    return nodes.map((node) => slateToPlainText(node)).join("\n");
  }

  // Handle text leaf nodes
  if ("text" in nodes && typeof nodes.text === "string") {
    return nodes.text;
  }

  // Handle nodes with children
  if ("children" in nodes && Array.isArray(nodes.children)) {
    const childText = nodes.children
      .map((child) => slateToPlainText(child))
      .join("");

    return childText;
  }

  return "";
}

/**
 * Alternative version that preserves line breaks between blocks
 * @param nodes - Array of Slate nodes
 * @returns Plain text string with preserved block structure
 */
export function slateToPlainTextWithBlocks(nodes: SlateData): string {
  return nodes
    .map((node) => {
      if ("children" in node && Array.isArray(node.children)) {
        return node.children.map((child) => slateToPlainText(child)).join("");
      }
      return "";
    })
    .filter((text) => text.length > 0) // Remove empty blocks
    .join("\n");
}

// Example usage in a Next.js component:
//
// import { slateToPlainText } from '@/utils/slateParser';
//
// const MyComponent = () => {
//   const slateData = [...]; // your Slate data
//   const plainText = slateToPlainText(slateData);
//
//   return <div>{plainText}</div>;
// };

export function parseNotesToText(nodes: SlateData): string {
  return slateToPlainTextWithBlocks(nodes);
}

export function parseNotesToHTML(nodes: SlateData): string {
  return nodes
    .map((node) => {
      const text = node.children
        .map((child) => {
          if ("text" in child && typeof child.text === "string") {
            let html = child.text;
            if (child.bold) html = `<strong>${html}</strong>`;
            if (child.italic) html = `<em>${html}</em>`;
            if (child.underline) html = `<u>${html}</u>`;
            return html;
          }
          return "";
        })
        .join("");
      switch (node.type) {
        case "h1":
          return `<h1>${text}</h1>`;
        case "h2":
          return `<h2>${text}</h2>`;
        case "h3":
          return `<h3>${text}</h3>`;
        case "blockquote":
          return `<blockquote>${text}</blockquote>`;
        default:
          return `<p>${text}</p>`;
      }
    })
    .join("");
}
