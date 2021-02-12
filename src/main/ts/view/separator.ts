import {ClassName} from '../misc/class-name';
import {View, ViewConfig} from './view';

const className = ClassName('spt');

/**
 * @hidden
 */
export class SeparatorView extends View {
	constructor(document: Document, config: ViewConfig) {
		super(document, config);

		this.element.classList.add(className());

		const hrElem = document.createElement('hr');
		hrElem.classList.add(className('r'));
		this.element.appendChild(hrElem);
	}
}
