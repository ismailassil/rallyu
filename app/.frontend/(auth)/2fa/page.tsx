'use client';
import React, { useState } from 'react';
import { Shield, Smartphone, Mail, Key, CheckCircle, ArrowRight, Copy, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

// Progress Bar Component
const ProgressBar = ({ currentStep, totalSteps = 4 }) => {
  return (
    <div className="bg-gray-50 px-8 py-6">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <React.Fragment key={step}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step}
            </div>
            {step < totalSteps && (
              <div
                className={`w-16 h-1 mx-2 ${
                  step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>Choose Method</span>
        <span>Setup</span>
        <span>Verify</span>
        <span>Complete</span>
      </div>
    </div>
  );
};

// Method Selection Card Component
const MethodCard = ({ method, isSelected, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`w-12 h-12 ${method.color} rounded-lg flex items-center justify-center text-white mr-4`}>
          {method.icon}
        </div>
        <div className="text-left">
          <h3 className="font-semibold text-gray-900">{method.title}</h3>
          <p className="text-sm text-gray-600">{method.description}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Verification Code Input Component
const VerificationCodeInput = ({ code, onChange, onPaste }) => {
  return (
    <div className="flex justify-center gap-3">
      {code.map((digit, index) => (
        <input
          key={index}
          id={`code-${index}`}
          type="text"
          inputMode="numeric"
          maxLength="1"
          value={digit}
          onChange={(e) => onChange(index, e.target.value)}
          onPaste={index === 0 ? onPaste : undefined}
          className="w-12 h-12 text-center text-2xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
        />
      ))}
    </div>
  );
};

// Backup Codes Component
const BackupCodes = ({ codes, onGenerateNew, onCopyAll }) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
      <h3 className="font-semibold text-yellow-800 mb-2">Save Your Backup Codes</h3>
      <p className="text-yellow-700 text-sm mb-4">
        Store these backup codes in a safe place. You can use them to access your account if you lose your primary 2FA method.
      </p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {codes.map((code, index) => (
          <div key={index} className="bg-white p-2 rounded border font-mono text-center">
            {code}
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button
          onClick={onGenerateNew}
          className="flex items-center text-sm text-yellow-700 hover:text-yellow-800"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Generate New Codes
        </button>
        <button
          onClick={onCopyAll}
          className="flex items-center text-sm text-yellow-700 hover:text-yellow-800 ml-auto"
        >
          <Copy className="w-4 h-4 mr-1" />
          Copy All
        </button>
      </div>
    </div>
  );
};

// Step 1: Method Selection
const MethodSelectionStep = ({ selectedMethod, onMethodSelect, onNext }) => {
  const methods = [
    {
      id: 'sms',
      title: 'Text Message (SMS)',
      description: 'Receive codes via SMS to your phone number',
      icon: <Smartphone className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      id: 'authenticator',
      title: 'Authenticator App',
      description: 'Use apps like Google Authenticator or Authy',
      icon: <Key className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      id: 'email',
      title: 'Email Verification',
      description: 'Receive codes via email',
      icon: <Mail className="w-6 h-6" />,
      color: 'bg-purple-500'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
        <Shield className="w-8 h-8 text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Enable Two-Factor Authentication</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Add an extra layer of security to your account. Choose how you'd like to receive verification codes.
      </p>
      
      <div className="grid gap-4 max-w-lg mx-auto">
        {methods.map((method) => (
          <MethodCard
            key={method.id}
            method={method}
            isSelected={selectedMethod === method.id}
            onClick={() => onMethodSelect(method.id)}
          />
        ))}
      </div>
      
      <button
        onClick={onNext}
        disabled={!selectedMethod}
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center mx-auto"
      >
        Continue
        <ArrowRight className="ml-2 w-4 h-4" />
      </button>
    </motion.div>
  );
};

// Step 2: Setup Configuration
const SetupConfigurationStep = ({ selectedMethod, phoneNumber, setPhoneNumber, email, setEmail, totpSecret, onCopySecret, onBack, onNext }) => {
  const methods = [
    {
      id: 'sms',
      title: 'Text Message (SMS)',
      description: 'Receive codes via SMS to your phone number',
      icon: <Smartphone className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      id: 'authenticator',
      title: 'Authenticator App',
      description: 'Use apps like Google Authenticator or Authy',
      icon: <Key className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      id: 'email',
      title: 'Email Verification',
      description: 'Receive codes via email',
      icon: <Mail className="w-6 h-6" />,
      color: 'bg-purple-500'
    }
  ];

  const getMethodIcon = () => {
    const method = methods.find(m => m.id === selectedMethod);
    return method ? method.icon : null;
  };

  const getMethodTitle = () => {
    const method = methods.find(m => m.id === selectedMethod);
    return method ? method.title : '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          {getMethodIcon()}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Set up {getMethodTitle()}
        </h2>
        <p className="text-gray-600">
          {selectedMethod === 'sms' && 'Enter your phone number to receive SMS codes'}
          {selectedMethod === 'authenticator' && 'Scan the QR code with your authenticator app'}
          {selectedMethod === 'email' && 'Enter your email address to receive verification codes'}
        </p>
      </div>

      {selectedMethod === 'sms' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {selectedMethod === 'authenticator' && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <div className="w-32 h-32 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
              <div className="text-xs text-gray-500">QR Code</div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Scan this QR code with your authenticator app
            </p>
            <div className="bg-white p-3 rounded border">
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono">{totpSecret}</code>
                <button
                  onClick={onCopySecret}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedMethod === 'email' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-8">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
};

// Step 3: Verification
const VerificationStep = ({ verificationCode, onCodeChange, onPaste, onBack, onNext }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Key className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Setup</h2>
        <p className="text-gray-600">
          Enter the 6-digit code sent to your device
        </p>
      </div>

      <div className="space-y-6">
        <VerificationCodeInput
          code={verificationCode}
          onChange={onCodeChange}
          onPaste={onPaste}
        />

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Didn't receive a code?{' '}
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              Resend code
            </button>
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={onNext}
            disabled={verificationCode.some(digit => digit === '')}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Verify
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Step 4: Completion
const CompletionStep = ({ backupCodes, onGenerateNewCodes, onCopyAllCodes, onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Two-Factor Authentication Enabled!</h2>
        <p className="text-gray-600">
          Your account is now more secure with 2FA enabled.
        </p>
      </div>

      <BackupCodes
        codes={backupCodes}
        onGenerateNew={onGenerateNewCodes}
        onCopyAll={onCopyAllCodes}
      />

      <div className="text-center">
        <button
          onClick={onComplete}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Complete Setup
        </button>
      </div>
    </motion.div>
  );
};

// Main Component
const TwoFactorSetup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [totpSecret, setTotpSecret] = useState('KJHGF7654SDFGHJKL');
  const [backupCodes, setBackupCodes] = useState([
    'KJH7-DFG9',
    'MNB8-HJK3',
    'QWE2-RTY5',
    'ASD4-FGH6',
    'ZXC1-VBN7'
  ]);

  const handleCodeChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      
      // Auto-focus next input
      if (value && index < 5) {
        document.getElementById(`code-${index + 1}`).focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').substring(0, 6);
    const newCode = Array(6).fill('').map((_, i) => pastedData[i] || '');
    setVerificationCode(newCode);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const generateNewBackupCodes = () => {
    const newCodes = Array(5).fill().map(() => 
      `${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    );
    setBackupCodes(newCodes);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <MethodSelectionStep
            selectedMethod={selectedMethod}
            onMethodSelect={setSelectedMethod}
            onNext={() => setCurrentStep(2)}
          />
        );
      case 2:
        return (
          <SetupConfigurationStep
            selectedMethod={selectedMethod}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            email={email}
            setEmail={setEmail}
            totpSecret={totpSecret}
            onCopySecret={() => copyToClipboard(totpSecret)}
            onBack={() => setCurrentStep(1)}
            onNext={() => setCurrentStep(3)}
          />
        );
      case 3:
        return (
          <VerificationStep
            verificationCode={verificationCode}
            onCodeChange={handleCodeChange}
            onPaste={handlePaste}
            onBack={() => setCurrentStep(2)}
            onNext={() => setCurrentStep(4)}
          />
        );
      case 4:
        return (
          <CompletionStep
            backupCodes={backupCodes}
            onGenerateNewCodes={generateNewBackupCodes}
            onCopyAllCodes={() => copyToClipboard(backupCodes.join('\n'))}
            onComplete={() => {
              setCurrentStep(1);
              setSelectedMethod(null);
              setVerificationCode(['', '', '', '', '', '']);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <ProgressBar currentStep={currentStep} />
          <div className="p-8">
            {renderStep()}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Having trouble? Contact support for help with 2FA setup</p>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorSetup;