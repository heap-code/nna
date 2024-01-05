import { UniqueConstraintViolationException } from "@mikro-orm/core";
import { ArgumentsHost, Catch, ConflictException } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

/**
 * Filter Translating `Mikro-orm`'s [UniqueConstraintViolationException]{@link UniqueConstraintViolationException}
 * to HTTP [ConflictException]{@link ConflictException}.
 */
@Catch(UniqueConstraintViolationException)
export class UniqueConstraintFilter extends BaseExceptionFilter {
	/** @inheritDoc */
	public override catch(exception: UniqueConstraintViolationException, host: ArgumentsHost) {
		super.catch(
			new ConflictException("A uniqueness constraint has not been respected.", {
				cause: exception,
				description: (exception as unknown as { detail: string }).detail
			}),
			host
		);
	}
}
