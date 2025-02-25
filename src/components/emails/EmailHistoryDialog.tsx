import React, { useState, useEffect } from 'react';
import { Mail, Calendar, User, ArrowLeft, Paperclip } from 'lucide-react';
import { Dialog } from '../shared/Dialog';
import { getEmailHistory, EmailHistory } from '../../services/emails';
import { getToken } from '../../utils/auth';
import { formatDateTime } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import DOMPurify from 'dompurify';

// Add a helper function to format the date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function processEmailContent(content: string): string {
  if (!content) return '';

  // Common email reply patterns
  const replyPatterns = [
    {
      pattern: /^(On .* wrote:)$/m,  // "On [date/time] [name] wrote:"
      keepMatch: true
    },
    {
      pattern: /^(On .* at .*, .* wrote:)$/m,  // Another common format
      keepMatch: true
    },
    {
      pattern: /^(-{3,}Original Message-{3,})/m,  // Original message separator
      keepMatch: true
    },
    {
      pattern: /^(________________________________)$/m,  // Common separator
      keepMatch: true
    },
    {
      pattern: /^(In reply to:)$/m,  // Reply indicator
      keepMatch: true
    },
    {
      pattern: /^(Quoted message)$/m,  // Quote indicator
      keepMatch: true
    },
    {
      pattern: /^(Begin forwarded message:)$/m,  // Forwarded message
      keepMatch: true
    }
  ];

  // First, process reply patterns
  replyPatterns.forEach(({ pattern, keepMatch }) => {
    const match = content.match(pattern);
    if (match) {
      const [fullMatch] = match;
      const index = match.index || 0;
      const before = content.slice(0, index).trimEnd();
      let after = content.slice(index + fullMatch.length);

      // Remove '>' symbols from the quoted content and convert newlines to <br>
      after = after.split('\n')
        .map(line => {
          if (line.trim().startsWith('>') && !line.trim().startsWith('<')) {
            return line.replace(/^>+\s*/, '');
          }
          return line;
        })
        .join('<br>');

      content = before + 
        (keepMatch ? '\n\n' + fullMatch + '\n' : '') +
        `<blockquote class="email-reply" style="margin-left: 0.5em; padding-left: 1em; border-left: 2px solid #e5e7eb;">` +
        after.trimStart() +
        '</blockquote>';
    }
  });

  // Process any remaining '>' symbols in the content (outside of blockquotes)
  // and convert newlines to <br>
  let processedContent = content.split('\n')
    .map(line => {
      if (line.trim().startsWith('>') && !line.trim().startsWith('<')) {
        return line.replace(/^>+\s*/, '');
      }
      return line;
    })
    .join('<br>');

  return processedContent;
}

function renderEmailBody(body: string | null) {
  if (!body) return null;

  // Check if the content appears to be HTML
  const containsHTML = /<[a-z][\s\S]*>/i.test(body);

  if (containsHTML) {
    // Process the content first to add blockquotes for replies
    const processedContent = processEmailContent(body);
    
    // Sanitize and render HTML content
    const sanitizedHtml = DOMPurify.sanitize(processedContent, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'a', 'span', 
        'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'table', 'tr', 
        'td', 'th', 'thead', 'tbody', 'blockquote'
      ],
      ALLOWED_ATTR: ['href', 'target', 'style', 'class', 'src', 'alt'],
      ADD_ATTR: ['target'], // Allow target attribute for links
    });
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        className="[&_p]:mb-4 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:mb-1 [&_blockquote]:border-l-2 [&_blockquote]:border-gray-200 [&_blockquote]:pl-4 [&_blockquote]:ml-2 [&_blockquote]:text-gray-500 [&_a]:text-blue-600 [&_a]:underline"
      />
    );
  }

  // For plain text, look for reply patterns and wrap in blockquotes
  const processedContent = processEmailContent(body);
  return <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: processedContent }} />;
}

interface EmailHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  emailLogId: string;
}

export function EmailHistoryDialog({ isOpen, onClose, companyId, emailLogId }: EmailHistoryDialogProps) {
  const [emailHistory, setEmailHistory] = useState<EmailHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedEmails, setExpandedEmails] = useState<Set<number>>(new Set());
  const { showToast } = useToast();

  useEffect(() => {
    async function fetchEmailHistory() {
      if (!isOpen) return;
      
      try {
        setIsLoading(true);
        const token = getToken();
        if (!token) {
          showToast('Authentication failed. Please try logging in again.', 'error');
          return;
        }

        const history = await getEmailHistory(token, companyId, emailLogId);
        setEmailHistory(history);
      } catch (error) {
        console.error('Error fetching email history:', error);
        showToast('Failed to fetch email history', 'error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchEmailHistory();
  }, [companyId, emailLogId, isOpen, showToast]);

  const toggleEmailExpand = (index: number) => {
    const newExpandedEmails = new Set(expandedEmails);
    if (expandedEmails.has(index)) {
      newExpandedEmails.delete(index);
    } else {
      newExpandedEmails.add(index);
    }
    setExpandedEmails(newExpandedEmails);
  };

  // Get the subject from the first email for the header
  const threadSubject = emailHistory.length > 0 ? emailHistory[0].email_subject : '';

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Email History" size="4xl">
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : emailHistory.length === 0 ? (
        <div className="text-center py-12">
          <Mail className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No email history</h3>
          <p className="mt-1 text-sm text-gray-500">No email messages found for this log.</p>
        </div>
      ) : (
        <div className="max-h-[70vh] overflow-y-auto">
          {emailHistory.map((email, index) => {
            const isExpanded = expandedEmails.has(index);
            const hasAttachment = email.email_body?.includes('<img') || email.email_body?.includes('attachment');
            
            return (
              <div 
                key={email.message_id || index} 
                className="border-b border-gray-200 last:border-b-0"
              >
                <div 
                  onClick={() => toggleEmailExpand(index)}
                  className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex-1 min-w-0 flex items-center">
                    <span className="font-medium text-sm text-gray-900 truncate flex-shrink-0 w-44">
                      {email.from_name || email.from_email}
                    </span>
                    <span className="text-sm text-gray-600 truncate px-2 flex-1">
                      {email.email_subject}
                    </span>
                    <div className="flex items-center flex-shrink-0 ml-2">
                      {hasAttachment && (
                        <Paperclip className="h-4 w-4 text-gray-400 mr-2" />
                      )}
                      <span className="text-xs text-gray-500 w-24 text-right whitespace-nowrap">
                        {formatDate(email.sent_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 py-3 bg-white">
                    <div className="text-sm text-gray-600 mb-4 space-y-1">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-1" />
                        <span>From: {email.from_name} &lt;{email.from_email}&gt;</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-1" />
                        <span>To: {email.to_email}</span>
                      </div>
                    </div>
                    
                    <div className="prose prose-sm max-w-none text-xs text-gray-600 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:mb-1">
                      {renderEmailBody(email.email_body)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Dialog>
  );
} 