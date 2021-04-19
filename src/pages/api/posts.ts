/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable consistent-return */

import { NextApiRequest, NextApiResponse } from 'next';
import { getPostsByPage } from '../../services/postsService';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { page } = req.query;
    try {
      const response = await getPostsByPage(Number(page));
      return res.json(response);
    } catch (err) {
      return res.status(500).json({ err: err.message });
    }
  }
};
