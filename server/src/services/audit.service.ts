import { prisma } from '../utils/prisma';

export const auditLog = async (createdBy: string, entity: string, entityId: string, action: string, details?: string) => {
  await prisma.auditLog.create({ data: { createdBy, entity, entityId, action, details } });
};
