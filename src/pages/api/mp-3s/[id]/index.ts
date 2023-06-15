import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { mp3ValidationSchema } from 'validationSchema/mp-3s';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.mp_3
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getMp3ById();
    case 'PUT':
      return updateMp3ById();
    case 'DELETE':
      return deleteMp3ById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getMp3ById() {
    const data = await prisma.mp_3.findFirst(convertQueryToPrismaUtil(req.query, 'mp_3'));
    return res.status(200).json(data);
  }

  async function updateMp3ById() {
    await mp3ValidationSchema.validate(req.body);
    const data = await prisma.mp_3.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteMp3ById() {
    const data = await prisma.mp_3.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
