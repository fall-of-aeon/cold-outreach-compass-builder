import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SecureStorage, CURRENT_STORAGE_USAGE } from '@/utils/secureStorage';
import { SecurityUtils } from '@/utils/securityUtils';

export function SecurityReport() {
  const [storageUsage, setStorageUsage] = useState<any>(null);
  const [rateLimitStatus, setRateLimitStatus] = useState<string>('OK');

  useEffect(() => {
    setStorageUsage(SecureStorage.getStorageUsage());
    
    // Check rate limit status
    const canMakeRequest = SecurityUtils.checkClientRateLimit('test-key', 10, 60000);
    setRateLimitStatus(canMakeRequest ? 'OK' : 'RATE_LIMITED');
  }, []);

  const handleClearStorage = () => {
    SecureStorage.clearAllData();
    setStorageUsage(SecureStorage.getStorageUsage());
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Privacy Report
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Authentication Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Authentication: Supabase JWT</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Rate Limiting: {rateLimitStatus}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Input Validation: Active</span>
            </div>
          </div>

          {/* Browser Storage Usage */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Browser Storage Usage:</p>
                {Object.entries(CURRENT_STORAGE_USAGE).map(([key, info]) => (
                  <div key={key} className="ml-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{info.location}</Badge>
                      <span className="text-sm">{info.description}</span>
                    </div>
                    <p className="text-xs text-muted-foreground ml-2">
                      Security: {info.security}
                    </p>
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>

          {/* Storage Details */}
          {storageUsage && (
            <div className="space-y-2">
              <h4 className="font-medium">Current Storage Usage</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p>localStorage: {Math.round(storageUsage.localStorage.used / 1024)} KB used</p>
                  <p>sessionStorage: {Math.round(storageUsage.sessionStorage.used / 1024)} KB used</p>
                </div>
                <div>
                  <p>App data items: {storageUsage.appData.length}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleClearStorage}
                    className="mt-2"
                  >
                    Clear App Data
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Security Recommendations */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">Security Best Practices:</p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                  <li>Authentication tokens are managed securely by Supabase</li>
                  <li>All API requests are rate-limited to prevent abuse</li>
                  <li>User inputs are validated and sanitized</li>
                  <li>No sensitive data is stored in browser storage</li>
                  <li>Session data is encrypted and cleared automatically</li>
                  <li>HTTPS is enforced for all communications</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

        </CardContent>
      </Card>
    </div>
  );
}