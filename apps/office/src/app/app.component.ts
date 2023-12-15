import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

import { NxWelcomeComponent } from "./nx-welcome.component";

@Component({
	imports: [NxWelcomeComponent, RouterModule],
	selector: "heap-code-root",
	standalone: true,
	styleUrl: "./app.component.scss",
	templateUrl: "./app.component.html",
})
export class AppComponent {
	title = "office";
}
