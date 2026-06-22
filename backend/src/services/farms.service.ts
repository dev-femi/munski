import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export const getFarmsByUser = async (userId: string) => {
  return prisma.farm.findMany({ where: { userId } });
};

export const createFarm = async (userId: string, data: any) => {
  return prisma.farm.create({
    data: {
      userId,
      name: data.name,
      location: data.location,
      capacitySqft: data.capacity_sqft,
    },
  });
};

export const getFarmById = async (farmId: string, userId: string) => {
  const farm = await prisma.farm.findUnique({ where: { id: farmId } });
  if (!farm || farm.userId !== userId) {
    throw new AppError(404, 'Farm not found');
  }
  return farm;
};

export const updateFarm = async (farmId: string, userId: string, data: any) => {
  const farm = await getFarmById(farmId, userId);
  return prisma.farm.update({
    where: { id: farmId },
    data: {
      name: data.name || farm.name,
      location: data.location || farm.location,
      capacitySqft: data.capacity_sqft || farm.capacitySqft,
    },
  });
};

export const deleteFarm = async (farmId: string, userId: string) => {
  const farm = await getFarmById(farmId, userId);
  return prisma.farm.delete({ where: { id: farmId } });
};
