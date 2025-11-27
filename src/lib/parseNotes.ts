export interface TextNode {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export type BlockType = 'h1' | 'h2' | 'h3' | 'blockquote' | 'p' | string;

export interface BlockNode {
  type: BlockType;
  children: EditorNode[];
}

export type EditorNode = TextNode | BlockNode;

function isTextNode(node: EditorNode): node is TextNode {
  return 'text' in node;
}

function isBlockNode(node: EditorNode): node is BlockNode {
  return 'children' in node && Array.isArray((node as BlockNode).children);
}


export function parseNotesToPlainTextOnly(nodes: EditorNode[]): string {
  let result = '';

  for (const node of nodes) {
    if (isTextNode(node)) {
      result += node.text;
    }
    
    if (isBlockNode(node)) {
      const childText = parseNotesToPlainTextOnly(node.children);
      
      switch (node.type) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'blockquote':
        case 'p':
          result += childText + '\n';
          break;
        default:
          result += childText;
      }
    }
  }

  return result.trim();
}

export function parseNotesToText(nodes: EditorNode[]): string {
  return parseNotesToPlainTextOnly(nodes);
}

export function parseNotesToTextWithFormatting(nodes: EditorNode[]): string {
  return parseNotesToPlainTextOnly(nodes);
}

export function parseNotesToHTML(nodes: EditorNode[]): string {
  let result = '';

  for (const node of nodes) {
    if (isTextNode(node)) {
      let text = node.text;
      
      text = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
      
      if (node.bold) text = `<strong>${text}</strong>`;
      if (node.italic) text = `<em>${text}</em>`;
      if (node.underline) text = `<u>${text}</u>`;
      
      result += text;
    }
    
    if (isBlockNode(node)) {
      const childText = parseNotesToHTML(node.children);
      
      switch (node.type) {
        case 'h1':
          result += `<h1>${childText}</h1>`;
          break;
        case 'h2':
          result += `<h2>${childText}</h2>`;
          break;
        case 'h3':
          result += `<h3>${childText}</h3>`;
          break;
        case 'blockquote':
          result += `<blockquote>${childText}</blockquote>`;
          break;
        case 'p':
          result += `<p>${childText}</p>`;
          break;
        default:
          result += childText;
      }
    }
  }

  return result;
}

export function getStoredNotesAsText(): string | null {
  const storedContent = localStorage.getItem('editorContent');
  
  if (!storedContent) {
    return null;
  }
  
  try {
    const parsedJSON = JSON.parse(storedContent) as EditorNode[];
    return parseNotesToText(parsedJSON);
  } catch (error) {
    console.error('Error parsing stored notes:', error);
    return null;
  }
}

export function getStoredNotesAsHTML(): string | null {
  const storedContent = localStorage.getItem('editorContent');
  
  if (!storedContent) {
    return null;
  }
  
  try {
    const parsedJSON = JSON.parse(storedContent) as EditorNode[];
    return parseNotesToHTML(parsedJSON);
  } catch (error) {
    console.error('Error parsing stored notes:', error);
    return null;
  }
}