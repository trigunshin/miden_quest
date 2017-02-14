import {observable, computed} from "mobx";

export class Sum {
	@observable first = 1;
	@observable second = 1;
	@computed get sumTotal() {
		return this.first + this.second;
	}
}
