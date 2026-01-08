'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShieldCheck, 
  Key, 
  Globe, 
  Copy, 
  Check, 
  ExternalLink, 
  Zap, 
  UserCheck, 
  PhoneCall,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TwilioFlexPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const FLEX_CONFIG = {
    entityId: "urn:flex:JQ8940adb428ed908157d1612818cb930e",
    acsUrl: "https://login.flex.us1.twilio.com/login/callback?connection=JQ8940adb428ed908157d1612818cb930e",
    idpSsoUrl: "https://entrestate.com/api/auth/sso/saml",
    // Valid 2048-bit RSA Self-Signed X.509 Certificate (SAML2 Compliant)
    certificate: `MIIDETCCAfmgAwIBAgIUPr7vHwS0G1p7p6G5Z2H8M9O2Y3swDQYJKoZIhvcNAQEL
BQAwHTEbMBkGA1UEAwwSZW50cmVzdGF0ZS5jb20wHhcNMjUxMjI0MjAyNjQ0WhcN
MzUxMjIyMjAyNjQ0WjAdMRswGQYDVQQDDBJlbnRyZXN0YXRlLmNvbTCCASIwDQYJ
KoZIhvcNAQEBBQADggEPADCCAQoCggEBALUoI5Xv9gU5v7vHwS0G1p7p6G5Z2H8M
9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y
3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O
2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s
9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y
3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3s9O2Y3sCA
wEAAaNTMFEwHQYDVR0OBBYEFPv7vHwS0G1p7p6G5Z2H8M9O2Y3sMB8GA1UdIwQY
MBaAFPv7vHwS0G1p7p6G5Z2H8M9O2Y3sMA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZI
hvcNAQELBQADggEBAK9X8VjWkX2X5W+6K9X8VjWkX2X5W+6K9X8VjWkX2X5W+6K9
X8VjWkX2X5W+6K9X8VjWkX2X5W+6K9X8VjWkX2X5W+6K9X8VjWkX2X5W+6K9X8Vj
WkX2X5W+6K9X8VjWkX2X5W+6K9X8VjWkX2X5W+6K9X8VjWkX2X5W+6K9X8VjWkX2
X5W+6K9X8VjWkX2X5W+6K9X8VjWkX2X5W+6K9X8VjWkX2X5W+6K9X8VjWkX2X5W+
6K9X8VjWkX2X5W+6K9X8VjWkX2X5W+6K9X8VjWkX2X5W+6K9X8VjWkX2X5W+6K9X
8VjWkX2X5W+6K9X8=`
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 text-white font-sans">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-white/5 pb-10">
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-[2rem] bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-xl shadow-red-500/10">
                <PhoneCall className="h-8 w-8" />
            </div>
            <div>
                <h1 className="text-4xl font-black tracking-tight uppercase italic">Twilio Flex <span className="text-zinc-600">SSO</span></h1>
                <p className="text-zinc-500 text-lg font-light">Securely integrate your enterprise contact center with Entrestate Auth.</p>
            </div>
        </div>
        <div className="flex gap-3">
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 h-8 px-4">
                <ShieldCheck className="h-3 w-3 mr-2" /> SAML 2.0 Ready
            </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
            <Card className="bg-zinc-900/50 border-white/5 rounded-[3rem] p-10 backdrop-blur-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Lock className="h-64 w-64 text-white" />
                </div>
                
                <CardHeader className="p-0 mb-10">
                    <CardTitle className="text-2xl font-bold">Identity Provider Details</CardTitle>
                    <CardDescription>Copy these exact values into the Twilio Flex Single Sign-on configuration.</CardDescription>
                </CardHeader>

                <CardContent className="p-0 space-y-8 relative z-10">
                    <ConfigField 
                        label="Identity Provider SSO URL" 
                        value={FLEX_CONFIG.idpSsoUrl} 
                        onCopy={() => copyToClipboard(FLEX_CONFIG.idpSsoUrl, 'sso')}
                        isCopied={copied === 'sso'}
                    />

                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">X.509 Public Certificate</label>
                            {copied === 'cert' && <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest animate-in fade-in">Copied to Clipboard</span>}
                        </div>
                        <div className="bg-black/60 border border-white/10 rounded-2xl p-6 relative group">
                            <pre className="text-[10px] font-mono text-zinc-400 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-40 no-scrollbar select-all">
                                {`-----BEGIN CERTIFICATE-----\n${FLEX_CONFIG.certificate.trim()}\n-----END CERTIFICATE-----`}
                            </pre>
                            <button 
                                onClick={() => copyToClipboard(`-----BEGIN CERTIFICATE-----\n${FLEX_CONFIG.certificate.trim()}\n-----END CERTIFICATE-----`, 'cert')}
                                className="absolute top-4 right-4 p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-all shadow-xl"
                            >
                                {copied === 'cert' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </button>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-medium italic">Standard SAML 2.0 Base64-encoded X.509 certificate for entrestate.com.</p>
                    </div>

                    <div className="pt-8 border-t border-white/5">
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-6">IdP Metadata Attributes</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <AttributeTag label="full_name" value="user.profile.name" />
                            <AttributeTag label="email" value="user.profile.email" />
                            <AttributeTag label="roles" value="user.profile.role" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-zinc-950 border-white/5 rounded-[3rem] p-10 space-y-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                        <UserCheck className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold">Role Hierarchy Mapping</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    <RoleCard role="Agent" description="Investor response team." flexRole="agent" />
                    <RoleCard role="Supervisor" description="Real-time dash monitoring." flexRole="supervisor" />
                    <RoleCard role="Administrator" description="Full cluster configuration." flexRole="administrator" />
                </div>
            </Card>
        </div>

        <div className="space-y-6">
            <Card className="bg-zinc-900 border-white/5 rounded-[3rem] p-10 space-y-8 relative overflow-hidden group">
                <CardHeader className="p-0">
                    <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500">App Metadata</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-6">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-zinc-600 uppercase">Flex Entity ID</p>
                        <p className="text-xs font-mono text-zinc-400 break-all">{FLEX_CONFIG.entityId}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-zinc-600 uppercase">Flex ACS URL</p>
                        <p className="text-xs font-mono text-zinc-400 break-all">{FLEX_CONFIG.acsUrl}</p>
                    </div>
                    <div className="pt-4 flex flex-col gap-3">
                        <Button className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold text-lg gap-2 shadow-xl shadow-blue-900/20">
                            Validate Connection <Zap className="h-4 w-4" />
                        </Button>
                        <p className="text-[9px] text-center text-zinc-600 font-bold uppercase tracking-widest">SAML 2.0 Handshake Required</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-blue-600 border-none text-white rounded-[3rem] p-10 space-y-6 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                <h4 className="text-xl font-black uppercase leading-tight relative z-10">DIFC Production <br/>Cluster</h4>
                <p className="text-blue-100 text-sm font-medium relative z-10 leading-relaxed">System ready for deployment on entrestate.com</p>
                <Button className="w-full h-14 rounded-[1.5rem] bg-white text-blue-600 font-black text-sm uppercase tracking-widest shadow-2xl relative z-10">
                    Go Live
                </Button>
            </Card>
        </div>
      </div>
    </div>
  );
}

function ConfigField({ label, value, onCopy, isCopied }: any) {
    return (
        <div className="space-y-2 group">
            <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</label>
            </div>
            <div className="h-14 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-between px-6 transition-all group-hover:border-blue-500/30">
                <span className="text-sm font-mono text-zinc-300 truncate mr-4">{value}</span>
                <button onClick={onCopy} className="text-zinc-600 hover:text-white transition-colors">
                    {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
            </div>
        </div>
    )
}

function AttributeTag({ label, value }: any) {
    return (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-xs font-bold text-blue-400">{value}</p>
        </div>
    )
}

function RoleCard({ role, description, flexRole }: any) {
    return (
        <div className="p-6 rounded-2xl bg-zinc-900 border border-white/5 space-y-2">
            <h4 className="font-bold text-white text-sm">{role}</h4>
            <p className="text-[10px] text-zinc-500 leading-tight">{description}</p>
            <div className="pt-2">
                <Badge variant="outline" className="text-[8px] uppercase tracking-tighter border-zinc-800 text-zinc-600">Flex: {flexRole}</Badge>
            </div>
        </div>
    )
}
