import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
	imports: [RouterModule],
	selector: "office-root",
	standalone: true,
	styleUrl: "./app.component.scss",
	templateUrl: "./app.component.html",
})
export class AppComponent {
	public title = "office";
}
