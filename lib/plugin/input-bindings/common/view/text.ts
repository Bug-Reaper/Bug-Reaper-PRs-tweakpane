import {Formatter} from '../../../common/converter/formatter';
import {Value} from '../../../common/model/value';
import {ValueMap} from '../../../common/model/value-map';
import {ClassName} from '../../../common/view/class-name';
import {View} from '../../../common/view/view';

export type TextProps<T> = ValueMap<{
	formatter: Formatter<T>;
}>;

export interface Config<T> {
	props: TextProps<T>;
	value: Value<T>;

	arrayPosition?: 'fst' | 'mid' | 'lst';
}

const className = ClassName('txt');

/**
 * @hidden
 */
export class TextView<T> implements View {
	public readonly inputElement: HTMLInputElement;
	public readonly value: Value<T>;
	public readonly element: HTMLElement;
	protected readonly props_: TextProps<T>;

	constructor(doc: Document, config: Config<T>) {
		this.onChange_ = this.onChange_.bind(this);

		this.props_ = config.props;
		this.props_.emitter.on('change', this.onChange_);

		this.element = doc.createElement('div');
		this.element.classList.add(className());
		if (config.arrayPosition) {
			this.element.classList.add(className(undefined, config.arrayPosition));
		}

		const inputElem = doc.createElement('input');
		inputElem.classList.add(className('i'));
		inputElem.type = 'text';
		this.element.appendChild(inputElem);
		this.inputElement = inputElem;

		config.value.emitter.on('change', this.onChange_);
		this.value = config.value;

		this.update();
	}

	public update(): void {
		const formatter = this.props_.get('formatter');
		this.inputElement.value = formatter(this.value.rawValue);
	}

	private onChange_(): void {
		this.update();
	}
}
