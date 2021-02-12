import {ClassName} from '../../misc/class-name';
import {TypeUtil} from '../../misc/type-util';
import {Color} from '../../model/color';
import {Foldable} from '../../model/foldable';
import {InputValue} from '../../model/input-value';
import {PickedColor} from '../../model/picked-color';
import {View, ViewConfig} from '../view';
import {APaletteInputView} from './a-palette';
import {ColorComponentTextsInputView} from './color-component-texts';
import {HPaletteInputView} from './h-palette';
import {InputView} from './input';
import {SvPaletteInputView} from './sv-palette';
import {TextInputView} from './text';

const className = ClassName('clp', 'input');

interface Config extends ViewConfig {
	alphaInputViews: {
		palette: APaletteInputView;
		text: TextInputView<number>;
	} | null;
	componentTextsView: ColorComponentTextsInputView;
	foldable: Foldable;
	hPaletteInputView: HPaletteInputView;
	pickedColor: PickedColor;
	supportsAlpha: boolean;
	svPaletteInputView: SvPaletteInputView;
}

/**
 * @hidden
 */
export class ColorPickerInputView extends View implements InputView<Color> {
	public readonly foldable: Foldable;
	public readonly pickedColor: PickedColor;
	private alphaViews_: {
		palette: APaletteInputView;
		text: TextInputView<number>;
	} | null;
	private hPaletteView_: HPaletteInputView;
	private compTextsView_: ColorComponentTextsInputView;
	private svPaletteView_: SvPaletteInputView;

	constructor(document: Document, config: Config) {
		super(document, config);

		this.onFoldableChange_ = this.onFoldableChange_.bind(this);
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.pickedColor = config.pickedColor;
		this.pickedColor.value.emitter.on('change', this.onValueChange_);

		this.foldable = config.foldable;
		this.foldable.emitter.on('change', this.onFoldableChange_);

		this.element.classList.add(className());

		const hsvElem = document.createElement('div');
		hsvElem.classList.add(className('hsv'));

		const svElem = document.createElement('div');
		svElem.classList.add(className('sv'));
		this.svPaletteView_ = config.svPaletteInputView;
		svElem.appendChild(this.svPaletteView_.element);
		hsvElem.appendChild(svElem);

		const hElem = document.createElement('div');
		hElem.classList.add(className('h'));
		this.hPaletteView_ = config.hPaletteInputView;
		hElem.appendChild(this.hPaletteView_.element);
		hsvElem.appendChild(hElem);
		this.element.appendChild(hsvElem);

		const rgbElem = document.createElement('div');
		rgbElem.classList.add(className('rgb'));
		this.compTextsView_ = config.componentTextsView;
		rgbElem.appendChild(this.compTextsView_.element);
		this.element.appendChild(rgbElem);

		if (config.alphaInputViews) {
			this.alphaViews_ = {
				palette: config.alphaInputViews.palette,
				text: config.alphaInputViews.text,
			};

			const aElem = document.createElement('div');
			aElem.classList.add(className('a'));

			const apElem = document.createElement('div');
			apElem.classList.add(className('ap'));
			apElem.appendChild(this.alphaViews_.palette.element);
			aElem.appendChild(apElem);

			const atElem = document.createElement('div');
			atElem.classList.add(className('at'));
			atElem.appendChild(this.alphaViews_.text.element);
			aElem.appendChild(atElem);

			this.element.appendChild(aElem);
		}

		this.update();
	}

	get allFocusableElements(): HTMLElement[] {
		const elems = [
			this.svPaletteView_.element,
			this.hPaletteView_.element,
			...this.compTextsView_.inputElements,
		];
		if (this.alphaViews_) {
			elems.push(
				this.alphaViews_.palette.element,
				this.alphaViews_.text.inputElement,
			);
		}
		return TypeUtil.forceCast(elems);
	}

	get value(): InputValue<Color> {
		return this.pickedColor.value;
	}

	public update(): void {
		if (this.foldable.expanded) {
			this.element.classList.add(className(undefined, 'expanded'));
		} else {
			this.element.classList.remove(className(undefined, 'expanded'));
		}
	}

	private onValueChange_(): void {
		this.update();
	}

	private onFoldableChange_(): void {
		this.update();
	}
}
