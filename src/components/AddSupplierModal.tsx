import { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface AddSupplierModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (supplier: { id: string; name: string; phone: string; email: string }) => void;
}

export default function AddSupplierModal({ open, onClose, onSuccess }: AddSupplierModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [generatedId, setGeneratedId] = useState('');

  const generateSupplierId = (fullName: string): string => {
    const names = fullName.trim().split(' ');
    const firstName = names[0] || '';
    const lastName = names[1] || '';
    
    // Get first 3 letters from firstName + lastName
    const initials = (firstName.substring(0, 2) + (lastName.charAt(0) || '')).toUpperCase().padEnd(3, 'X');
    
    // Get current month (01-12)
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    
    // Generate 4-digit random
    const random4 = String(Math.floor(1000 + Math.random() * 9000));
    
    // Generate 2-digit random
    const random2 = String(Math.floor(10 + Math.random() * 90));
    
    return `${initials}${month}-${random4}-${random2}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Name is required');
      return;
    }

    const supplierId = generateSupplierId(name);
    setGeneratedId(supplierId);
    setStep('success');
  };

  const handleClose = () => {
    if (step === 'success') {
      onSuccess({ id: generatedId, name, phone, email });
    }
    setStep('form');
    setName('');
    setPhone('');
    setEmail('');
    setGeneratedId('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {step === 'form' ? (
          <>
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Supplier Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 h-12"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="10-digit phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="mt-1.5 h-12"
                  maxLength={10}
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="supplier@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 h-12"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 h-12 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-gradient-to-r from-[#0F9D58] to-[#0d8a4d] hover:from-[#0d8a4d] hover:to-[#0b7a43] text-white rounded-xl"
                >
                  Create Supplier
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-gray-900 mb-2">Supplier Created Successfully!</h2>
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <div className="text-gray-500 text-sm mb-1">Supplier ID</div>
              <div className="text-gray-900 text-xl mb-3">{generatedId}</div>
              <div className="text-gray-500 text-sm mb-1">Name</div>
              <div className="text-gray-900 mb-2">{name}</div>
              {phone && (
                <>
                  <div className="text-gray-500 text-sm mb-1">Phone</div>
                  <div className="text-gray-900">{phone}</div>
                </>
              )}
            </div>
            <Button
              onClick={handleClose}
              className="w-full h-12 bg-gradient-to-r from-[#0F9D58] to-[#0d8a4d] hover:from-[#0d8a4d] hover:to-[#0b7a43] text-white rounded-xl"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
