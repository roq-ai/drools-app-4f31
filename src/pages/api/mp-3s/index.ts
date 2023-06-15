import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { mp3ValidationSchema } from 'validationSchema/mp-3s';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getMp3s();
    case 'POST':
      return createMp3();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getMp3s() {
    const data = await prisma.mp_3
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'mp_3'));
    return res.status(200).json(data);
  }

  async function createMp3() {
    await mp3ValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.rating?.length > 0) {
      const create_rating = body.rating;
      body.rating = {
        create: create_rating,
      };
    } else {
      delete body.rating;
    }
    if (body?.shared_link?.length > 0) {
      const create_shared_link = body.shared_link;
      body.shared_link = {
        create: create_shared_link,
      };
    } else {
      delete body.shared_link;
    }
    const data = await prisma.mp_3.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
