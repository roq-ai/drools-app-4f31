import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { ratingValidationSchema } from 'validationSchema/ratings';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.rating
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getRatingById();
    case 'PUT':
      return updateRatingById();
    case 'DELETE':
      return deleteRatingById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getRatingById() {
    const data = await prisma.rating.findFirst(convertQueryToPrismaUtil(req.query, 'rating'));
    return res.status(200).json(data);
  }

  async function updateRatingById() {
    await ratingValidationSchema.validate(req.body);
    const data = await prisma.rating.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteRatingById() {
    const data = await prisma.rating.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
