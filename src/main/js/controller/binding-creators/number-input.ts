import InputBinding from '../../binding/input';
import CompositeConstraint from '../../constraint/composite';
import {Constraint} from '../../constraint/constraint';
import ListConstraint from '../../constraint/list';
import RangeConstraint from '../../constraint/range';
import StepConstraint from '../../constraint/step';
import ConstraintUtil from '../../constraint/util';
import * as NumberConverter from '../../converter/number';
import NumberFormatter from '../../formatter/number';
import TypeUtil from '../../misc/type-util';
import InputValue from '../../model/input-value';
import Target from '../../model/target';
import StringNumberParser from '../../parser/string-number';
import InputBindingController from '../input-binding';
import ListInputController from '../input/list';
import NumberTextInputController from '../input/number-text';
import SliderTextInputController from '../input/slider-text';
import {InputParams} from '../ui';
import * as UiUtil from '../ui-util';

function createConstraint(params: InputParams): Constraint<number> {
	const constraints: Constraint<number>[] = [];

	if (!TypeUtil.isEmpty(params.step)) {
		constraints.push(
			new StepConstraint({
				step: params.step,
			}),
		);
	}

	if (!TypeUtil.isEmpty(params.max) || !TypeUtil.isEmpty(params.min)) {
		constraints.push(
			new RangeConstraint({
				max: params.max,
				min: params.min,
			}),
		);
	}

	if (params.options) {
		constraints.push(
			new ListConstraint({
				options: UiUtil.normalizeInputParamsOptions(
					params.options,
					NumberConverter.fromMixed,
				),
			}),
		);
	}

	return new CompositeConstraint({
		constraints: constraints,
	});
}

function createController(document: Document, value: InputValue<number>) {
	const c = value.constraint;

	if (c && ConstraintUtil.findConstraint(c, ListConstraint)) {
		return new ListInputController(document, {
			stringifyValue: NumberConverter.toString,
			value: value,
		});
	}

	if (c && ConstraintUtil.findConstraint(c, RangeConstraint)) {
		return new SliderTextInputController(document, {
			formatter: new NumberFormatter(
				UiUtil.getSuitableDecimalDigits(value.constraint, value.rawValue),
			),
			parser: StringNumberParser,
			value: value,
		});
	}

	return new NumberTextInputController(document, {
		formatter: new NumberFormatter(
			UiUtil.getSuitableDecimalDigits(value.constraint, value.rawValue),
		),
		parser: StringNumberParser,
		value: value,
	});
}

/**
 * @hidden
 */
export function create(
	document: Document,
	target: Target,
	params: InputParams,
): InputBindingController<number, number> | null {
	const initialValue = target.read();
	if (typeof initialValue !== 'number') {
		return null;
	}

	const value = new InputValue(0, createConstraint(params));
	const binding = new InputBinding({
		reader: NumberConverter.fromMixed,
		target: target,
		value: value,
		writer: (v) => v,
	});

	return new InputBindingController(document, {
		binding: binding,
		controller: createController(document, value),
		label: params.label || target.key,
	});
}
