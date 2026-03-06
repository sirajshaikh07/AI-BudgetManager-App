import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transaction.dto';

export class UpdateTransactionDto extends PartialType(
    OmitType(CreateTransactionDto, ['accountId', 'type'] as const),
) { }
