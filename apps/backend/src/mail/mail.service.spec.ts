import { Test, TestingModule } from "@nestjs/testing";
import { ISendMailOptions } from "@nestjs-modules/mailer";

import { MailModule } from "./mail.module";
import { MailService } from "./mail.service";

describe("MailService", () => {
	let service: MailService;
	let module: TestingModule;

	const mockSendMail = jest.fn();

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [MailModule],
		})
			.overrideProvider(MailService)
			.useValue({ sendMail: mockSendMail })
			.compile();

		service = module.get<MailService>(MailService);

		mockSendMail.mockReset();
	});

	afterEach(() => module.close());

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	it("should send mail (mocked)", async () => {
		const options: ISendMailOptions = {};
		expect(mockSendMail).not.toHaveBeenCalledWith(options);

		await service.sendMail(options);
		expect(mockSendMail).toHaveBeenCalledWith(options);
	});
});
