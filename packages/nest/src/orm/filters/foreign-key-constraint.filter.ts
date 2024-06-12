import { ForeignKeyConstraintViolationException } from "@mikro-orm/core";
import { ArgumentsHost, Catch, NotFoundException } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

/**
 * Filter Translating `Mikro-orm`'s {@link ForeignKeyConstraintViolationException ForeignKeyConstraintViolationException}
 * to HTTP {@link NotFoundException NotFoundException}.
 */
@Catch(ForeignKeyConstraintViolationException)
export class ForeignKeyConstraintFilter extends BaseExceptionFilter {
	/** @inheritDoc */
	public override catch(
		exception: ForeignKeyConstraintViolationException,
		host: ArgumentsHost,
	) {
		super.catch(
			new NotFoundException(
				"A foreign relation key did not match an entity",
				{
					cause: exception,
					description: (exception as unknown as { detail: string })
						.detail,
				},
			),
			host,
		);
	}
}
