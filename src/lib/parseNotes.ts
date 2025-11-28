// types.ts
interface SlateText {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  [key: string]: any;
}

interface SlateNode {
  type?: string;
  id?: string;
  children: (SlateText | SlateNode)[];
  [key: string]: any;
}

type SlateData = SlateNode[];

/**
 * Recursively extracts plain text from Slate structured data
 * @param nodes - Array of Slate nodes or a single node
 * @returns Plain text string
 */
export function slateToPlainText(nodes: SlateData | SlateNode | SlateText): string {
  // Handle array of nodes
  if (Array.isArray(nodes)) {
    return nodes.map(node => slateToPlainText(node)).join('\n');
  }

  // Handle text leaf nodes
  if ('text' in nodes && typeof nodes.text === 'string') {
    return nodes.text;
  }

  // Handle nodes with children
  if ('children' in nodes && Array.isArray(nodes.children)) {
    const childText = nodes.children
      .map(child => slateToPlainText(child))
      .join('');
    
    return childText;
  }

  return '';
}

/**
 * Alternative version that preserves line breaks between blocks
 * @param nodes - Array of Slate nodes
 * @returns Plain text string with preserved block structure
 */
export function slateToPlainTextWithBlocks(nodes: SlateData): string {
  return nodes
    .map(node => {
      if ('children' in node && Array.isArray(node.children)) {
        return node.children
          .map(child => slateToPlainText(child))
          .join('');
      }
      return '';
    })
    .filter(text => text.length > 0) // Remove empty blocks
    .join('\n');
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