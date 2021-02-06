import {InputParams} from '../../api/types';
import {InputBinding} from '../../binding/input';
import {CompositeConstraint} from '../../constraint/composite';
import {Constraint} from '../../constraint/constraint';
import {ListConstraint} from '../../constraint/list';
import {ConstraintUtil} from '../../constraint/util';
import * as BooleanConverter from '../../converter/boolean';
import {InputValue} from '../../model/input-value';
import {Target} from '../../model/target';
import {ViewModel} from '../../model/view-model';
import {InputBindingController} from '../input-binding';
import {CheckboxInputController} from '../input/checkbox';
import {ListInputController} from '../input/list';
import * as UiUtil from '../ui-util';
import * as InputBindingPlugin from './input-binding-plugin';

function createConstraint(params: InputParams): Constraint<boolean> {
	const constraints: Constraint<boolean>[] = [];

	if ('options' in params && params.options !== undefined) {
		constraints.push(
			new ListConstraint({
				options: UiUtil.normalizeInputParamsOptions(
					params.options,
					BooleanConverter.fromMixed,
				),
			}),
		);
	}

	return new CompositeConstraint({
		constraints: constraints,
	});
}

function createController(document: Document, value: InputValue<boolean>) {
	const c = value.constraint;

	if (c && ConstraintUtil.findConstraint(c, ListConstraint)) {
		return new ListInputController(document, {
			viewModel: new ViewModel(),
			stringifyValue: BooleanConverter.toString,
			value: value,
		});
	}

	return new CheckboxInputController(document, {
		viewModel: new ViewModel(),
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
): InputBindingController<boolean, boolean> | null {
	return InputBindingPlugin.createController(
		{
			createBinding: (params) => {
				const initialValue = target.read();
				if (typeof initialValue !== 'boolean') {
					return null;
				}

				const value = new InputValue(
					false,
					createConstraint(params.inputParams),
				);
				return new InputBinding({
					reader: BooleanConverter.fromMixed,
					target: target,
					value: value,
					writer: (v) => v,
				});
			},
			createController: (params) => {
				return createController(document, params.binding.value);
			},
		},
		{
			document: document,
			inputParams: params,
			target: target,
		},
	);
}
