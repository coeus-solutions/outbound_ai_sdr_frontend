import React, { useState, useEffect } from 'react';
import { Mail, Calendar, User, Paperclip, X } from 'lucide-react';
import { getEmailHistory, EmailHistory } from '../../services/emails';
import { getToken } from '../../utils/auth';
import { formatDateTime } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import DOMPurify from 'dompurify';

// Helper function to format the date
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
      pattern: /^(On .* wrote:)$/m,
      keepMatch: true
    },
    {
      pattern: /^(On .* at .*, .* wrote:)$/m,
      keepMatch: true
    },
    {
      pattern: /^(-{3,}Original Message-{3,})/m,
      keepMatch: true
    },
    {
      pattern: /^(________________________________)$/m,
      keepMatch: true
    },
    {
      pattern: /^(In reply to:)$/m,
      keepMatch: true
    },
    {
      pattern: /^(Quoted message)$/m,
      keepMatch: true
    },
    {
      pattern: /^(Begin forwarded message:)$/m,
      keepMatch: true
    }
  ];

  let processedContent = content;

  // Process reply patterns
  replyPatterns.forEach(({ pattern, keepMatch }) => {
    const match = processedContent.match(pattern);
    if (match) {
      const [fullMatch] = match;
      const index = match.index || 0;
      const before = processedContent.slice(0, index).trimEnd();
      let after = processedContent.slice(index + fullMatch.length);

      after = after.split('\n')
        .map(line => {
          if (line.trim().startsWith('>') && !line.trim().startsWith('<')) {
            return line.replace(/^>+\s*/, '');
          }
          return line;
        })
        .join('<br>');

      processedContent = before + 
        (keepMatch ? '\n\n' + fullMatch + '\n' : '') +
        `<blockquote class="email-reply" style="margin-left: 0.5em; padding-left: 1em; border-left: 2px solid #e5e7eb;">` +
        after.trimStart() +
        '</blockquote>';
    }
  });

  // Process remaining '>' symbols
  processedContent = processedContent.split('\n')
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

  const containsHTML = /<[a-z][\s\S]*>/i.test(body);

  if (containsHTML) {
    const processedContent = processEmailContent(body);
    
    const sanitizedHtml = DOMPurify.sanitize(processedContent, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'a', 'span', 
        'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'table', 'tr', 
        'td', 'th', 'thead', 'tbody', 'blockquote'
      ],
      ALLOWED_ATTR: ['href', 'target', 'style', 'class', 'src', 'alt'],
      ADD_ATTR: ['target'],
    });
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        className="[&_p]:mb-4 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:mb-1 [&_blockquote]:border-l-2 [&_blockquote]:border-gray-200 [&_blockquote]:pl-4 [&_blockquote]:ml-2 [&_blockquote]:text-gray-500 [&_a]:text-blue-600 [&_a]:underline"
      />
    );
  }

  const processedContent = processEmailContent(body);
  return <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: processedContent }} />;
}

interface EmailSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  emailLogId: string;
}

export function EmailSidePanel({ isOpen, onClose, companyId, emailLogId }: EmailSidePanelProps) {
  const [emailHistory, setEmailHistory] = useState<EmailHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmailIndex, setSelectedEmailIndex] = useState<number | null>(null);
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
        if (history.length > 0) {
          setSelectedEmailIndex(0);
        }
      } catch (error) {
        console.error('Error fetching email history:', error);
        showToast('Failed to fetch email history', 'error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchEmailHistory();
  }, [companyId, emailLogId, isOpen, showToast]);

  if (!isOpen) return null;

  const selectedEmail = selectedEmailIndex !== null ? emailHistory[selectedEmailIndex] : null;

  return (
    <div className="fixed inset-y-0 right-0 w-[600px] bg-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out"
         style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Email Thread</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Email List */}
        <div className="w-1/3 border-r border-gray-200 overflow-y-auto bg-gray-50">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : emailHistory.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No email history</h3>
              <p className="mt-1 text-sm text-gray-500">No email messages found for this log.</p>
            </div>
          ) : (
            <div>
              {emailHistory.map((email, index) => {
                const hasAttachment = email.email_body?.includes('<img') || email.email_body?.includes('attachment');
                const isSelected = index === selectedEmailIndex;
                
                return (
                  <div 
                    key={email.message_id || index}
                    onClick={() => setSelectedEmailIndex(index)}
                    className={`px-4 py-3 cursor-pointer border-b border-gray-200 ${
                      isSelected ? 'bg-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-gray-900 truncate">
                        {email.from_name || email.from_email}
                      </span>
                      <span className="text-sm text-gray-600 truncate mt-1">
                        {email.email_subject}
                      </span>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <span>{formatDate(email.sent_at)}</span>
                        {hasAttachment && (
                          <Paperclip className="h-3 w-3 ml-2" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Email Content */}
        <div className="flex-1 overflow-y-auto">
          {selectedEmail ? (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {selectedEmail.email_subject}
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span>From: {selectedEmail.from_name} &lt;{selectedEmail.from_email}&gt;</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span>To: {selectedEmail.to_email}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{formatDateTime(selectedEmail.sent_at)}</span>
                  </div>
                </div>
              </div>
              <div className="prose prose-sm max-w-none">
                {renderEmailBody(selectedEmail.email_body)}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select an email to view its content
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 