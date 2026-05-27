import { Router } from 'express';
import {
  listar,
  buscarPorId,
  criar,
  atualizar,
  remover,
  resumo,
} from '../controllers/transacoes.controller.js';

const router = Router();

router.get('/resumo', resumo);
router.get('/', listar);
router.get('/:id', buscarPorId);
router.post('/', criar);
router.put('/:id', atualizar);
router.delete('/:id', remover);

export default router;
