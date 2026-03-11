"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  function copyUserId() {
    navigator.clipboard.writeText(user?.id ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handlePasswordUpdate() {
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      if (user?.passwordEnabled) {
        await user.updatePassword({ currentPassword, newPassword });
      } else {
        await user?.updatePassword({ newPassword });
      }
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      const code = err.errors?.[0]?.code;
      const message = err.errors?.[0]?.message ?? "Something went wrong.";

      if (
        code === "reverification_required" ||
        code === "session_reverification_required" ||
        message.toLowerCase().includes("reverif")
      ) {
        setError(
          "Session verification required. Signing you out — please sign back in and try again.",
        );
        setTimeout(() => signOut({ redirectUrl: "/sign-in" }), 2500);
        return;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your account details
          </p>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-card border border-border rounded-lg p-6 max-w-md">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {user?.imageUrl && (
              <img
                src={user.imageUrl}
                alt="Profile"
                className="w-16 h-16 rounded-full border border-border object-cover"
              />
            )}
            <div className="space-y-1">
              <p className="text-base font-medium text-foreground">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-muted-foreground">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
          <div>
            <button
              onClick={() => signOut({ redirectUrl: "/sign-in" })}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border space-y-3">
          <div className="flex justify-between text-sm items-center">
            <span className="text-muted-foreground">User ID</span>
            <div className="flex items-center gap-2">
              <span className="text-foreground font-mono text-xs truncate max-w-50">
                {user?.id}
              </span>
              <button
                onClick={copyUserId}
                className="relative text-muted-foreground hover:text-foreground transition-colors"
                title="Copy User ID"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-all duration-200 ${copied ? "opacity-0 scale-50" : "opacity-100 scale-100"}`}
                >
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`absolute inset-0 text-green-500 transition-all duration-200 ${copied ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Member since</span>
            <span className="text-foreground">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-card border border-border rounded-lg p-6 max-w-md space-y-4">
        <div>
          <h2 className="text-base font-medium text-foreground">
            {user?.passwordEnabled ? "Change Password" : "Set a Password"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {user?.passwordEnabled
              ? "Must be at least 8 characters."
              : "Your account uses Google sign-in. You can set a password to also log in with email."}
          </p>
        </div>

        <div className="space-y-3">
          {user?.passwordEnabled && (
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          )}
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {success && (
          <p className="text-sm text-green-600 dark:text-green-400">
            Password {user?.passwordEnabled ? "updated" : "set"} successfully.
          </p>
        )}

        <button
          onClick={handlePasswordUpdate}
          disabled={
            loading ||
            (!user?.passwordEnabled
              ? !newPassword
              : !currentPassword || !newPassword)
          }
          className="w-full py-2 px-4 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Saving..."
            : user?.passwordEnabled
              ? "Update Password"
              : "Set Password"}
        </button>
      </div>
    </div>
  );
}
