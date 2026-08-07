export interface LockCheckParams {
  createdAt: Date | string;
  weddingDate: Date | string;
  isUnlockedByAdmin?: boolean;
  isLockedByAdmin?: boolean;
}

export interface LockCheckResult {
  isLocked: boolean;
  lockReason?: string;
  hoursUntilLock?: number;
  timeUntilLockText?: string;
  lockStartTime?: string;
  daysInUse: number;
}

/**
 * Checks whether an invitation's editing is locked to prevent multi-wedding reuse.
 *
 * Rules:
 * 1. Admin Override: If `isUnlockedByAdmin === true`, editing is ALWAYS UNLOCKED.
 * 2. Admin Manual Lock: If `isLockedByAdmin === true`, editing is ALWAYS LOCKED.
 * 3. 24-Hour Creation Grace Period: If created less than 24 hours ago, DO NOT lock editing
 *    (protects users who make typos or set initial dates last-minute).
 * 4. 2-Hour Pre-Event Lock: Locking begins 2 hours before the selected wedding date/time.
 */
export function checkInvitationLockStatus(invitation: LockCheckParams): LockCheckResult {
  const now = new Date();
  const createdAt = invitation.createdAt ? new Date(invitation.createdAt) : new Date();
  const weddingDate = invitation.weddingDate ? new Date(invitation.weddingDate) : null;

  // Calculate days in active use
  const msDiff = Math.max(0, now.getTime() - createdAt.getTime());
  const daysInUse = Math.max(1, Math.ceil(msDiff / (1000 * 60 * 60 * 24)));

  // Admin explicit override: unlock
  if (invitation.isUnlockedByAdmin) {
    return {
      isLocked: false,
      daysInUse,
      timeUntilLockText: "Admin Unlocked (Unlimited)",
    };
  }

  // Admin explicit manual lock
  if (invitation.isLockedByAdmin) {
    return {
      isLocked: true,
      lockReason: "Editing has been manually locked for this invitation by Admin.",
      daysInUse,
      timeUntilLockText: "Admin Locked",
    };
  }

  if (!weddingDate || isNaN(weddingDate.getTime()) || isNaN(createdAt.getTime())) {
    return {
      isLocked: false,
      daysInUse,
      timeUntilLockText: "Wedding Date Not Set",
    };
  }

  // 2 Hours Before Event Lock Trigger
  const lockStartTime = new Date(weddingDate.getTime() - 2 * 60 * 60 * 1000);
  const msUntilLock = lockStartTime.getTime() - now.getTime();
  const hoursUntilLock = msUntilLock / (1000 * 60 * 60);

  // Grace Period Protection: If created within the last 24 hours, allow editing unconditionally
  const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
  const isGraceActive = hoursSinceCreation < 24;

  if (now >= lockStartTime && !isGraceActive) {
    return {
      isLocked: true,
      lockReason: `Editing concluded starting 2 hours before your wedding event date (${weddingDate.toLocaleDateString(
        "en-IN"
      )}) to preserve live invitation data and guest responses.`,
      hoursUntilLock: 0,
      timeUntilLockText: "Locked (2H Pre-Event)",
      lockStartTime: lockStartTime.toISOString(),
      daysInUse,
    };
  }

  // Format human-friendly time remaining until lock
  let remainingText = "";
  if (msUntilLock > 0) {
    const totalMins = Math.floor(msUntilLock / (1000 * 60));
    const d = Math.floor(totalMins / (60 * 24));
    const h = Math.floor((totalMins % (60 * 24)) / 60);
    const m = totalMins % 60;

    if (d > 0) {
      remainingText = `Locks in ${d}d ${h}h`;
    } else if (h > 0) {
      remainingText = `Locks in ${h}h ${m}m`;
    } else {
      remainingText = `Locks in ${m} mins`;
    }
  } else {
    // If lockStartTime has passed but 24h creation grace period is active:
    const graceMsRemaining = (24 - hoursSinceCreation) * 3600 * 1000;
    const graceMins = Math.floor(graceMsRemaining / (1000 * 60));
    const gh = Math.floor(graceMins / 60);
    const gm = graceMins % 60;
    remainingText = `Creation Grace Active (Locks in ${gh}h ${gm}m)`;
  }

  return {
    isLocked: false,
    hoursUntilLock: Math.max(0, Math.round(hoursUntilLock)),
    timeUntilLockText: remainingText,
    lockStartTime: lockStartTime.toISOString(),
    daysInUse,
  };
}
