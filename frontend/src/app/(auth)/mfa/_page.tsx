import React, { useState } from 'react';
import { Shield, Smartphone, Mail, Key, Check, ArrowLeft, ArrowRight, Copy, Eye, EyeOff } from 'lucide-react';

const TwoFactorSetup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [qrSecret] = useState('JBSWY3DPEHPK3PXP'); // Mock QR secret
  const [setupComplete, setSetupComplete] = useState(false);

  const methods = [
    {
      id: 'authenticator',
      name: 'Authenticator App',
      icon: <Key className="w-6 h-6" />,
      description: 'Use Google Authenticator, Authy, or similar apps',
      security: 'Most secure',
      securityLevel: 3
    },
    {
      id: 'sms',
      name: 'SMS Text Message',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Receive codes via text message',
      security: 'Moderately secure',
      securityLevel: 2
    },
    {
      id: 'email',
      name: 'Email Verification',
      icon: <Mail className="w-6 h-6" />,
      description: 'Receive codes via email',
      security: 'Basic security',
      securityLevel: 1
    }
  ];

  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 8; i++) {
      codes.push(Math.random().toString(36).substr(2, 8).toUpperCase());
    }
    return codes;
  };

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    setCurrentStep(2);
  };

  const handleSetupSubmit = () => {
    if (selectedMethod === 'sms' && phoneNumber) {
      setCurrentStep(3);
    } else if (selectedMethod === 'email' && email) {
      setCurrentStep(3);
    } else if (selectedMethod === 'authenticator') {
      setCurrentStep(3);
    }
  };

  const handleVerification = () => {
    if (verificationCode.length === 6) {
      setIsVerified(true);
      const codes = generateBackupCodes();
      setBackupCodes(codes);
      setCurrentStep(4);
    }
  };

  const handleComplete = () => {
    setSetupComplete(true);
    setCurrentStep(5);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const SecurityBadge = ({ level }) => {
    const colors = {
      1: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      2: 'bg-blue-100 text-blue-800 border-blue-200',
      3: 'bg-green-100 text-green-800 border-green-200'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[level]}`}>
        {level === 3 ? 'Most Secure' : level === 2 ? 'Moderately Secure' : 'Basic Security'}
      </span>
    );
  };

  if (setupComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2FA Setup Complete!</h2>
          <p className="text-gray-600 mb-6">
            Your account is now protected with two-factor authentication. Make sure to keep your backup codes safe.
          </p>
          <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Continue to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-500">Step {currentStep} of 4</span>
            <span className="text-sm font-medium text-gray-500">{Math.round((currentStep / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Method Selection */}
        {currentStep === 1 && (
          <div>
            <div className="text-center mb-8">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Enable Two-Factor Authentication</h2>
              <p className="text-gray-600">
                Add an extra layer of security to your account by choosing your preferred verification method.
              </p>
            </div>

            <div className="space-y-4">
              {methods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handleMethodSelect(method.id)}
                  className="w-full p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-blue-600 group-hover:text-blue-700">
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{method.name}</h3>
                        <SecurityBadge level={method.securityLevel} />
                      </div>
                      <p className="text-gray-600 text-sm">{method.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Recommendation:</strong> Authenticator apps provide the highest security and work without internet connection.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Setup Details */}
        {currentStep === 2 && (
          <div>
            <div className="flex items-center mb-6">
              <button 
                onClick={() => setCurrentStep(1)}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900">
                Setup {methods.find(m => m.id === selectedMethod)?.name}
              </h2>
            </div>

            {selectedMethod === 'sms' && (
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    We'll send verification codes to this number.
                  </p>
                </div>
              </div>
            )}

            {selectedMethod === 'email' && (
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    We'll send verification codes to this email address.
                  </p>
                </div>
              </div>
            )}

            {selectedMethod === 'authenticator' && (
              <div>
                <div className="text-center mb-6">
                  <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <div className="grid grid-cols-8 gap-1">
                      {Array.from({ length: 64 }, (_, i) => (
                        <div 
                          key={i} 
                          className={`w-2 h-2 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Scan this QR code with your authenticator app
                  </p>
                  <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                    <code className="text-sm flex-1">{qrSecret}</code>
                    <button 
                      onClick={() => copyToClipboard(qrSecret)}
                      className="p-2 hover:bg-gray-200 rounded"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Can't scan? Enter this code manually in your app
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleSetupSubmit}
                disabled={
                  (selectedMethod === 'sms' && !phoneNumber) ||
                  (selectedMethod === 'email' && !email)
                }
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Verification */}
        {currentStep === 3 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Setup</h2>
              <p className="text-gray-600">
                {selectedMethod === 'sms' && `Enter the code sent to ${phoneNumber}`}
                {selectedMethod === 'email' && `Enter the code sent to ${email}`}
                {selectedMethod === 'authenticator' && 'Enter the code from your authenticator app'}
              </p>
            </div>

            <div className="max-w-sm mx-auto mb-8">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full px-4 py-4 text-center text-2xl font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={6}
              />
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleVerification}
                disabled={verificationCode.length !== 6}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Verify Code
              </button>
            </div>

            {selectedMethod !== 'authenticator' && (
              <div className="text-center mt-4">
                <button className="text-blue-600 hover:text-blue-700 text-sm">
                  Didn't receive a code? Resend
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Backup Codes */}
        {currentStep === 4 && (
          <div>
            <div className="text-center mb-8">
              <Check className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Save Your Backup Codes</h2>
              <p className="text-gray-600">
                These backup codes can be used to access your account if you lose access to your primary 2FA method.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Backup Codes</h3>
                <button
                  onClick={() => setShowBackupCodes(!showBackupCodes)}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  {showBackupCodes ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{showBackupCodes ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              
              {showBackupCodes ? (
                <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="bg-white p-3 rounded border">
                      {code}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Click "Show" to view your backup codes
                </div>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-yellow-800 mb-2">Important:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Save these codes in a safe place</li>
                <li>• Each code can only be used once</li>
                <li>• Don't share these codes with anyone</li>
                <li>• You can generate new codes anytime in your settings</li>
              </ul>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => copyToClipboard(backupCodes.join('\n'))}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Codes</span>
              </button>
              <button
                onClick={handleComplete}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                I've Saved My Codes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoFactorSetup;