"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Building2, Copy, CreditCard, Eye, EyeOff, Globe, KeyRound, Loader2, Plus, Save, Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function SaveButton({ onClick }: { onClick: () => void }) {
  const [saving, setSaving] = useState(false);
  return (
    <Button
      size="sm"
      className="gap-1.5"
      disabled={saving}
      onClick={() => {
        setSaving(true);
        setTimeout(() => {
          setSaving(false);
          onClick();
        }, 600);
      }}
    >
      {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
      Save changes
    </Button>
  );
}

export default function SettingsPage() {
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState({
    orderEmails: true,
    inventoryAlerts: true,
    marketingDigest: false,
    securityAlerts: true,
  });

  return (
    <div>
      <PageHeader title="Settings" description="Manage your workspace, billing, notifications, and developer access." />

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="api">API keys</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="max-w-2xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" /> Workspace
                </CardTitle>
                <CardDescription>Basic information about your store.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="store-name">Store name</Label>
                  <Input id="store-name" defaultValue="Northwind Traders" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="store-url">Store URL</Label>
                  <div className="relative">
                    <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="store-url" defaultValue="northwind.commerceos.io" className="pl-9" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Timezone</Label>
                    <Select defaultValue="america-chicago">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="america-chicago">America/Chicago (CT)</SelectItem>
                        <SelectItem value="america-new_york">America/New York (ET)</SelectItem>
                        <SelectItem value="america-los_angeles">America/Los Angeles (PT)</SelectItem>
                        <SelectItem value="europe-london">Europe/London (GMT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Currency</Label>
                    <Select defaultValue="usd">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="gbp">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end border-t border-border pt-4">
                <SaveButton onClick={() => toast.success("Workspace settings saved")} />
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Notification preferences</CardTitle>
                <CardDescription>Choose what CommerceOS should notify you about.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                {[
                  { key: "orderEmails" as const, label: "New order emails", description: "Get notified whenever a new order is placed." },
                  { key: "inventoryAlerts" as const, label: "Inventory alerts", description: "Alerts when items fall below their reorder point." },
                  { key: "marketingDigest" as const, label: "Weekly marketing digest", description: "A weekly summary of campaign performance." },
                  { key: "securityAlerts" as const, label: "Security alerts", description: "Sign-ins from new devices or locations." },
                ].map((pref, i, arr) => (
                  <div key={pref.key}>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium">{pref.label}</p>
                        <p className="text-xs text-muted-foreground">{pref.description}</p>
                      </div>
                      <Switch
                        checked={notifPrefs[pref.key]}
                        onCheckedChange={(v) => setNotifPrefs((prev) => ({ ...prev, [pref.key]: v }))}
                      />
                    </div>
                    {i < arr.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
              <CardFooter className="justify-end border-t border-border pt-4">
                <SaveButton onClick={() => toast.success("Notification preferences saved")} />
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="billing">
          <div className="max-w-2xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" /> Current plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">Enterprise</p>
                      <Badge variant="accent">Current plan</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Unlimited products, orders, and team members.</p>
                  </div>
                  <p className="font-mono text-lg font-semibold tabular-fig">$499<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                </div>
              </CardContent>
              <CardFooter className="justify-end gap-2 border-t border-border pt-4">
                <Button variant="outline" size="sm">
                  View invoices
                </Button>
                <Button size="sm">Change plan</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-11 items-center justify-center rounded bg-muted text-xs font-semibold">VISA</div>
                    <div>
                      <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                      <p className="text-xs text-muted-foreground">Expires 08/28</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api">
          <div className="max-w-2xl space-y-6">
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-muted-foreground" /> API keys
                  </CardTitle>
                  <CardDescription className="mt-1">Use these keys to authenticate requests to the CommerceOS API.</CardDescription>
                </div>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> Generate key
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 rounded-lg border border-border p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">Production key</p>
                    <p className="truncate font-mono text-sm tabular-fig">
                      {apiKeyVisible ? "cos_live_sk_4f8b2e1a9c7d6e5f3a2b1c0d" : "cos_live_sk_••••••••••••••••••••••"}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon-sm" onClick={() => setApiKeyVisible((v) => !v)} aria-label="Toggle key visibility">
                    {apiKeyVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      navigator.clipboard?.writeText("cos_live_sk_4f8b2e1a9c7d6e5f3a2b1c0d");
                      toast.success("Copied to clipboard");
                    }}
                    aria-label="Copy key"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" className="text-danger hover:text-danger" aria-label="Revoke key">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-border p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">Test key</p>
                    <p className="truncate font-mono text-sm tabular-fig">cos_test_sk_••••••••••••••••••••••</p>
                  </div>
                  <Button variant="ghost" size="icon-sm" aria-label="Copy key">
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" className="text-danger hover:text-danger" aria-label="Revoke key">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
