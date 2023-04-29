import { BadRequestException } from '@nestjs/common';

export class DupicatedException extends BadRequestException {
  constructor(property, value) {
    super({
      errors: {
        property: property,
        value: value,
        error: 'Duplicate Error',
        msg: 'is Duplicated',
      },
    });
  }
}
