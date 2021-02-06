import * as InputBindingControllerCreators from '../api/input-binding-controllers';
import * as MonitorBindingControllerCreators from './binding-creators/monitor';
import {ButtonController} from './button';
import {FolderController} from './folder';
import {SeparatorController} from './separator';

/**
 * @hidden
 */
export type UiInputBindingController = ReturnType<
	typeof InputBindingControllerCreators.create
>;
/**
 * @hidden
 */
export type UiInputBinding = UiInputBindingController['binding'];
/**
 * @hidden
 */
export type UiMonitorBindingController = ReturnType<
	typeof MonitorBindingControllerCreators.create
>;
/**
 * @hidden
 */
export type UiMonitorBinding = UiMonitorBindingController['binding'];

/**
 * @hidden
 */
export type UiController =
	| ButtonController
	| FolderController
	| SeparatorController
	| UiInputBindingController
	| UiMonitorBindingController;
