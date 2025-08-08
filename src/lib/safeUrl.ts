/**
 * Safely opens a URL with ad and popup blocking measures
 * @param url The URL to open
 */
export const safeOpenURL = (url: string): void => {
  // Create a temporary sandboxed iframe
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.sandbox.add('allow-popups');
  iframe.sandbox.add('allow-popups-to-escape-sandbox');
  iframe.sandbox.add('allow-same-origin');
  
  // Add event listener to handle the load
  iframe.onload = () => {
    try {
      // Try to open the URL in a new window with popup blocking
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      
      // If popup was blocked, try to focus existing window
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        window.focus();
      }

      // Remove the iframe after a short delay
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 100);
    } catch (error) {
      console.error('Error opening URL:', error);
      // Fallback to direct opening if iframe method fails
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Append iframe to document
  document.body.appendChild(iframe);
};
