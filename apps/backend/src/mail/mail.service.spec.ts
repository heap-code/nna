import { Test, TestingModule } from "@nestjs/testing";
import { MailerService } from "@nestjs-modules/mailer";

import { MailModule } from "./mail.module";
import { MailService } from "./mail.service";
import { ConfigurationModule } from "../configuration";

describe("MailService", () => {
	let service: MailService;
	let module: TestingModule;

	const mockSendMail = jest.fn();

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [ConfigurationModule.forRoot({}), MailModule],
		})
			.overrideProvider(MailerService)
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
		expect(mockSendMail).not.toHaveBeenCalled();

		await service.sendMail({});
		expect(mockSendMail).toHaveBeenCalled();
	});
});
