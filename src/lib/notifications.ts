import { prisma } from "@/lib/prisma";

type NotificationType = "submission_approved" | "submission_rejected" | "new_submission" | "system";

export async function createNotification(params: {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  link?: string;
}) {
  try {
    await prisma.notification.create({ data: params });
  } catch (e) {
    console.error("[notifications] Failed to create notification:", e);
  }
}

export async function getNotifications(userId: string, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [notifications, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.notification.count({ where: { userId } }),
    prisma.notification.count({ where: { userId, read: false } }),
  ]);
  return { notifications, total, unreadCount, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function markNotificationRead(notificationId: string, userId: string) {
  try {
    await prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { read: true },
    });
  } catch (e) {
    console.error("[notifications] Failed to mark notification read:", e);
  }
}

export async function markAllNotificationsRead(userId: string) {
  try {
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  } catch (e) {
    console.error("[notifications] Failed to mark all notifications read:", e);
  }
}

export async function deleteNotification(notificationId: string, userId: string) {
  try {
    await prisma.notification.deleteMany({
      where: { id: notificationId, userId },
    });
  } catch (e) {
    console.error("[notifications] Failed to delete notification:", e);
  }
}
