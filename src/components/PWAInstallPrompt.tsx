import { Download, X } from 'lucide-react';
import { Button } from './ui/button';

interface PWAInstallPromptProps {
  onDismiss: () => void;
}

export default function PWAInstallPrompt({ onDismiss }: PWAInstallPromptProps) {
  const handleInstall = () => {
    // In a real PWA, this would trigger the beforeinstallprompt event
    alert('Install functionality would be triggered here in a real PWA environment');
    onDismiss();
  };

  return (
    <div className="fixed bottom-6 left-6 right-6 lg:left-auto lg:right-6 lg:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-40 animate-slide-up">
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#0F9D58] rounded-xl flex items-center justify-center flex-shrink-0">
            <Download className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 mb-1">Install GroceryBag Pro</h3>
            <p className="text-gray-500 text-sm mb-3">
              Install our app for quick access and offline functionality
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleInstall}
                className="bg-[#0F9D58] hover:bg-[#0d8a4d] rounded-xl h-10"
              >
                Install App
              </Button>
              <Button
                variant="ghost"
                onClick={onDismiss}
                className="rounded-xl h-10"
              >
                Not Now
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="rounded-full flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
