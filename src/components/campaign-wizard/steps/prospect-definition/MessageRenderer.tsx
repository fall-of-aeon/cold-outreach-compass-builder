import React from 'react';

interface MessageRendererProps {
  content: string;
  className?: string;
}

export const MessageRenderer = ({ content, className = "" }: MessageRendererProps) => {
  const renderFormattedText = (text: string) => {
    // Split text into parts and process each part
    const parts: (string | React.ReactNode)[] = [];
    let currentIndex = 0;
    
    // First pass: Handle bold text **text**
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    
    // Reset regex
    boldRegex.lastIndex = 0;
    
    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > currentIndex) {
        parts.push(text.slice(currentIndex, match.index));
      }
      
      // Add the bold text
      parts.push(
        <strong key={`bold-${match.index}`} className="font-semibold">
          {match[1]}
        </strong>
      );
      
      currentIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (currentIndex < text.length) {
      parts.push(text.slice(currentIndex));
    }
    
    // Second pass: Handle italics *text* in the remaining string parts
    const processedParts: (string | React.ReactNode)[] = [];
    
    parts.forEach((part, index) => {
      if (typeof part === 'string') {
        const italicRegex = /\*(.*?)\*/g;
        const subParts: (string | React.ReactNode)[] = [];
        let subCurrentIndex = 0;
        let subMatch;
        
        // Reset regex
        italicRegex.lastIndex = 0;
        
        while ((subMatch = italicRegex.exec(part)) !== null) {
          // Add text before the match
          if (subMatch.index > subCurrentIndex) {
            subParts.push(part.slice(subCurrentIndex, subMatch.index));
          }
          
          // Add the italic text
          subParts.push(
            <em key={`italic-${index}-${subMatch.index}`} className="italic">
              {subMatch[1]}
            </em>
          );
          
          subCurrentIndex = subMatch.index + subMatch[0].length;
        }
        
        // Add remaining text
        if (subCurrentIndex < part.length) {
          subParts.push(part.slice(subCurrentIndex));
        }
        
        processedParts.push(...subParts);
      } else {
        processedParts.push(part);
      }
    });
    
    return processedParts;
  };

  const renderContent = () => {
    // Split content by lines to handle bullet points
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let bulletList: string[] = [];
    let bulletKey = 0;

    const flushBulletList = () => {
      if (bulletList.length > 0) {
        elements.push(
          <ul key={`bullets-${bulletKey++}`} className="list-disc list-inside space-y-1 my-2 ml-4">
            {bulletList.map((item, index) => (
              <li key={index} className="text-sm">
                {renderFormattedText(item.trim())}
              </li>
            ))}
          </ul>
        );
        bulletList = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Check if line is a bullet point (starts with -, *, or •)
      if (trimmedLine.match(/^[-*•]\s+/)) {
        const bulletText = trimmedLine.replace(/^[-*•]\s+/, '');
        bulletList.push(bulletText);
      } else {
        // Flush any pending bullet list
        flushBulletList();
        
        // Add regular line
        if (trimmedLine || bulletList.length === 0) {
          elements.push(
            <p key={`line-${index}`} className={trimmedLine ? "mb-2" : "mb-1"}>
              {renderFormattedText(line)}
            </p>
          );
        }
      }
    });

    // Flush any remaining bullet list
    flushBulletList();

    return elements.length > 0 ? elements : renderFormattedText(content);
  };

  return (
    <div className={`${className}`}>
      {renderContent()}
    </div>
  );
};