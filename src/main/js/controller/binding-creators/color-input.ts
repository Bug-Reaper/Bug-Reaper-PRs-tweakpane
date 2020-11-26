import {InputParams} from '../../api/types';
import {InputBinding} from '../../binding/input';
import * as ColorConverter from '../../converter/color';
import {ColorFormatter} from '../../formatter/color';
import {Color, RgbaColorObject, RgbColorObject} from '../../model/color';
import {InputValue} from '../../model/input-value';
import {Target} from '../../model/target';
import {ViewModel} from '../../model/view-model';
import * as NumberColorParser from '../../parser/number-color';
import * as StringColorParser from '../../parser/string-color';
import {InputBindingController} from '../input-binding';
import {ColorSwatchTextInputController} from '../input/color-swatch-text';

/**
 * @hidden
 */
export function createWithString(
	document: Document,
	target: Target,
	params: InputParams,
): InputBindingController<Color, string> | null {
	const initialValue = target.read();
	if (typeof initialValue !== 'string') {
		return null;
	}
	if ('input' in params && params.input === 'string') {
		return null;
	}
	const notation = StringColorParser.getNotation(initialValue);
	if (!notation) {
		return null;
	}

	const converter = ColorConverter.fromString;
	const color = converter(initialValue);
	const value = new InputValue(color);
	const writer = ColorConverter.getStringifier(notation);
	return new InputBindingController(document, {
		binding: new InputBinding({
			reader: converter,
			target: target,
			value: value,
			writer: writer,
		}),
		controller: new ColorSwatchTextInputController(document, {
			formatter: new ColorFormatter(writer),
			parser: StringColorParser.CompositeParser,
			supportsAlpha: StringColorParser.hasAlphaComponent(notation),
			value: value,
			viewModel: new ViewModel(),
		}),
		label: params.label || target.key,
	});
}

/**
 * @hidden
 */
export function createWithNumber(
	document: Document,
	target: Target,
	params: InputParams,
): InputBindingController<Color, number> | null {
	const initialValue = target.read();
	if (typeof initialValue !== 'number') {
		return null;
	}
	if (!('input' in params)) {
		return null;
	}
	if (
		params.input !== 'color' &&
		params.input !== 'color.rgb' &&
		params.input !== 'color.rgba'
	) {
		return null;
	}
	const supportsAlpha = params.input === 'color.rgba';
	const parser = supportsAlpha
		? NumberColorParser.RgbaParser
		: NumberColorParser.RgbParser;

	const color = parser(initialValue);
	if (!color) {
		return null;
	}

	const formatter = supportsAlpha
		? new ColorFormatter(ColorConverter.toHexRgbaString)
		: new ColorFormatter(ColorConverter.toHexRgbString);
	const reader = supportsAlpha
		? ColorConverter.fromNumberToRgba
		: ColorConverter.fromNumberToRgb;
	const writer = supportsAlpha
		? ColorConverter.toRgbaNumber
		: ColorConverter.toRgbNumber;
	const value = new InputValue(color);
	return new InputBindingController(document, {
		binding: new InputBinding({
			reader: reader,
			target: target,
			value: value,
			writer: writer,
		}),
		controller: new ColorSwatchTextInputController(document, {
			formatter: formatter,
			parser: StringColorParser.CompositeParser,
			supportsAlpha: supportsAlpha,
			value: value,
			viewModel: new ViewModel(),
		}),
		label: params.label || target.key,
	});
}

/**
 * @hidden
 */
export function createWithObject(
	document: Document,
	target: Target,
	params: InputParams,
): InputBindingController<Color, RgbColorObject | RgbaColorObject> | null {
	const initialValue = target.read();
	if (!Color.isColorObject(initialValue)) {
		return null;
	}

	const color = Color.fromObject(initialValue);
	const supportsAlpha = Color.isRgbaColorObject(initialValue);
	const formatter = supportsAlpha
		? new ColorFormatter(ColorConverter.toHexRgbaString)
		: new ColorFormatter(ColorConverter.toHexRgbString);
	const value = new InputValue(color);
	return new InputBindingController(document, {
		binding: new InputBinding({
			reader: ColorConverter.fromObject,
			target: target,
			value: value,
			writer: Color.toRgbaObject,
		}),
		controller: new ColorSwatchTextInputController(document, {
			viewModel: new ViewModel(),
			formatter: formatter,
			parser: StringColorParser.CompositeParser,
			supportsAlpha: supportsAlpha,
			value: value,
		}),
		label: params.label || target.key,
	});
}
