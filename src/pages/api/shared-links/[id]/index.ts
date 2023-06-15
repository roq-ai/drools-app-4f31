import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { sharedLinkValidationSchema } from 'validationSchema/shared-links';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.shared_link
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getSharedLinkById();
    case 'PUT':
      return updateSharedLinkById();
    case 'DELETE':
      return deleteSharedLinkById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getSharedLinkById() {
    const data = await prisma.shared_link.findFirst(convertQueryToPrismaUtil(req.query, 'shared_link'));
    return res.status(200).json(data);
  }

  async function updateSharedLinkById() {
    await sharedLinkValidationSchema.validate(req.body);
    const data = await prisma.shared_link.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteSharedLinkById() {
    const data = await prisma.shared_link.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
