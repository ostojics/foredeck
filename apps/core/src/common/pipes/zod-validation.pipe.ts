import {Injectable, BadRequestException, PipeTransform, ArgumentMetadata} from '@nestjs/common';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: any) {}

  transform(value: Record<string, unknown>, _metadata: ArgumentMetadata) {
    if (_metadata.type !== 'body' && _metadata.type !== 'query') {
      return value;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const result = this.schema.safeParse(value);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!result.success) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(result.error);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return result.data as Record<string, unknown>;
  }
}
